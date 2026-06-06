'use strict';

const redis = require('../db/redisClient');
const razorpay = require('../config/razorpay');
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');
const { validateRegistrationBody } = require('../config/validation');
const { orderIdExists, getOrderData,getOrderCount,getPromoCodeUseCount, addOrderIdtoCache } = require('../services/orderIdService');
const { eventIdExists, addEventIdtoCache } = require('../services/webhookEventId');
const { broadcast } = require('./countController');

// ─── POST /api/hackathon/initiate ─────────────────────────────────────────────
//
// Step 1 — Frontend sends ALL team + participant details.
//   1. Validate input (via validation.js — checks disposable emails, duplicates, etc.)
//   2. Check for duplicate leader email in confirmed registrations
//   3. Create Razorpay order
//   4. Persist a PendingRegistration row (keyed by orderId) so the webhook
//      handler can find it later — even if the browser tab is closed.
//
// Body: { teamName, participants: [{ name, email, phone, college, isLeader }] }
// Response: { orderId, amount, currency, keyId }

async function initiatePayment(req, res) {
  try {
    if (getOrderCount() > process.env.MAX_SEAT+1){
      return res.status(601).json({error: "Registration are Closed Now"});
    }
    console.log("/initiate route fired");
    const validationError = validateRegistrationBody(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const { teamName, participants } = req.body;

    const leader = participants.find(p => p.isLeader);
    const leaderEmail = leader.email.trim().toLowerCase();
    const leaderPhone = leader.phone.trim();

    //Create Razorpay order
    let amountPaise = parseInt(process.env.REGISTRATION_FEE_PAISE, 10);
    const safeLocal = leaderEmail.split('@')[0].replace(/[^a-z0-9]/gi, '').slice(0, 10);
    const receipt = `devlinkhub_hack_${Date.now()}_${safeLocal}`;

    if(req.body.promoCode){
      const result = resolvePromoCode(req.body.promoCode,amountPaise);
      if (result.valid) {
      amountPaise = result.finalAmountPaise;
      console.log(`[Hackathon] Promo "${req.body.promoCode.trim().toUpperCase()}" applied — ₹${(result.discountPaise / 100).toFixed(2)} off → ₹${(amountPaise / 100).toFixed(2)}`);
      } else {
        console.warn(`[Hackathon] Unknown promo code submitted: "${req.body.promoCode}" — ignoring.`);
      }
    }

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt,
      notes: {
        teamName,
        leaderEmail,
        leaderPhone,
      },
    });

    //Store pending registration (TTL: 10 min from now)
    // const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const redisKey = `pending_registration:${order.id}`;
    const payload = {
      teamName: teamName.trim(),
      participants: participants.map(p => ({
        name: p.name.trim(),
        email: p.email.trim().toLowerCase(),
        phone: p.phone.trim(),
        college: p.college.trim(),
        isLeader: p.isLeader,
      })),
    };

    await redis.setex(redisKey, 600, JSON.stringify(payload));

    console.log(`[Hackathon] Pending registration stored for order ${order.id} | team: ${teamName}`);

    res.status(201).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });

  } catch (err) {
    console.error('[Hackathon] initiatePayment error:', err);
    res.status(500).json({ error: 'Failed to create payment order. Please try again.' });
  }
}

// ─── POST /api/hackathon/webhook ──────────────────────────────────────────────
//
// Razorpay calls this URL when a payment event occurs.
//
// IMPORTANT: This handler receives the RAW request body (Buffer), not parsed
// JSON. The route MUST be mounted with express.raw() before express.json().
//
// Signature verification:
//   HMAC-SHA256( rawBody, RAZORPAY_WEBHOOK_SECRET ) == x-razorpay-signature
//
// On "payment.captured":
//   1. Idempotency check (WebhookEvent table)
//   2. Look up PendingRegistration by order ID
//   3. Write all HackathonParticipant rows in a transaction (shared teamId UUID)
//   4. Delete pending registration row
//   5. Log WebhookEvent
//   6. Fire invite emails to non-leader participants (non-blocking)

async function handleWebhook(req, res) {
  console.log("/webhook route fired");
  // Grab raw body and signature header
  const rawBody = req.body; // Buffer — because of express.raw()
  const webhookSignature = req.headers['x-razorpay-signature'];
  const eventId = req.headers['x-razorpay-event-id'];

  if (!eventId) {
    console.warn('[Webhook] Missing x-razorpay-event-id header Critical issue');
    return;
  }

  // Idempotency — skip if we've already handled this exact event
  try {
    if (eventIdExists(eventId)) {
      console.log(`[Webhook] Duplicate event ${eventId} — skipping.`);
      return;
    }
  } catch (err) {
    console.error('[Webhook] Idempotency check failed:', err);
    return;
  }

  if (!webhookSignature) {
    console.warn('[Webhook] Missing x-razorpay-signature header');
    return res.status(400).json({ error: 'Missing signature header.' });
  }

  if (!validateWebhookSignature(rawBody.toString(), webhookSignature, process.env.RAZORPAY_WEBHOOK_SECRET)) {
    console.warn('[Webhook] Signature verification failed!');
    return res.status(400).send('Invalid signature');
  }


  let event;
  try {
    event = JSON.parse(rawBody.toString('utf8'));
  } catch {
    return res.status(400).json({ error: 'Malformed JSON body.' });
  }

  const eventType = event.event;   // e.g. "payment.captured"
  console.log(`[Webhook]  Verified event: ${eventType} | id: ${eventId}`);


  // Respond 200 immediately — Razorpay requires a fast response
  //    (it retries on 5xx, so replying before async work is important)
  res.status(200).json({ status: 'ok' });

  // Process only "payment.captured" events
  if (eventType !== 'payment.captured') {
    console.log(`[Webhook] Ignoring event: ${eventType}`);
    return;
  }



  // Extract payment details from the event payload
  const payment = event?.payload?.payment?.entity;
  if (!payment) {
    console.error('[Webhook] No payment entity in payload:', JSON.stringify(event));
    return;
  }

  const orderId = payment.order_id;
  const paymentId = payment.id;
  const amount = payment.amount; // paise

  const expectedAmountPaise = parseInt(24900, 10);
  if (amount < expectedAmountPaise) {
    console.error(`[Webhook] Underpayment! Expected ${expectedAmountPaise}, got ${amount}`);
    return;
  }

  if (typeof orderId !== 'string' || typeof paymentId !== 'string' || !paymentId || !orderId) {
    console.error('[Webhook] Invalid or missing orderId/paymentId');
    return;
  }

  console.log(`[Webhook] Payment captured — orderId: ${orderId} | paymentId: ${paymentId} | amount: ₹${(amount / 100).toFixed(2)}`);

  // Find the pending registration
  const redisKey = `pending_registration:${orderId}`;
  let pending;
  try {
    pending = await redis.get(redisKey);
  } catch (err) {
    console.error('[Webhook] Failed to fetch pending registration:', err);
    return;
  }

  if (!pending) {
    console.error(`[Webhook] No pending registration found for orderId: ${orderId}`);
    return;
  }


  const payload = JSON.parse(pending);
  const teamNumber = getOrderCount() + 1;
  const teamId = `DLH-${String(teamNumber).padStart(2, '0')}`; // e.g. DLH-01, DLH-02

  payload.teamId = teamId.trim();
  payload.razorpayOrderId = orderId.trim();
  payload.razorpayPaymentId = paymentId.trim();
  payload.amountPaid = amount;
  payload.status = "registered";
  payload.createdAt = new Date();


  const webhookEvent = {
    razorpayEventId: eventId,
    event: eventType
  }

  const queue = {
    payload: payload,
    webhook_event: webhookEvent
  };
  //Persist in a transaction: create all participant rows, delete pending, log event
  try {
    addOrderIdtoCache(payload);
    addEventIdtoCache(eventId);
    broadcast();
    await redis.lpush('registration_queue', JSON.stringify(queue));
    
    await redis.del(`pending_registration:${orderId}`);

    // await redis.lpush('webhook_event', JSON.stringify(webhookEvent));
    

    console.log(`[Webhook] Team "${payload.teamName}" (id: ${teamId}) registered successfully via webhook!`);

  } catch (err) {
    // P2002 = unique constraint violation → team already registered from a duplicate webhook
    if (err.code === 'P2002') {
      console.log(`[Webhook] Team for order ${orderId} already registered — duplicate webhook ignored.`);
    } else {
      console.error('[Webhook] Failed to register team:', err);
    }
  }
}

// ─── GET /api/hackathon/status/:orderId ──

async function getRegistrationStatus(req, res) {
  try {
    console.log("/status route fired");
    const { orderId } = req.params;

    if (orderIdExists(orderId)) {
      console.log("hello");
      const leaderRow = getOrderData(orderId);
      return res.json({
        status: 'registered',
        team: {
          id: leaderRow.teamId,
          teamName: leaderRow.teamName,
          status: leaderRow.status,
          createdAt: leaderRow.createdAt,
        }
      });
    }

    // Check pending table
    const pending = await redis.get(`pending_registration:${orderId}`);
    if (pending) {
      console.log("not hello");
      return res.json({ status: 'pending', orderId });
    }
    console.log("not hello not found");
    res.status(404).json({ status: 'not_found', orderId });

  } catch (err) {
    console.error('[Hackathon] getRegistrationStatus error:', err);
    res.status(500).json({ error: err.message });
  }
}


// ─── POST /api/hackathon/promo ─────────────────────────────────────────────────
//
// Frontend calls this to validate a promo code BEFORE initiating payment.
// Returns the discounted amount (in paise) if the code is valid.
//
// Body: { promoCode: string }
// Response (valid):   { valid: true,  discount: number, finalAmountPaise: number, message: string }
// Response (invalid): { valid: false, message: string }

const PROMO_CODES = {
  'DEVLINKHUB100': 10000,
  //'EARLY20':   20,
};

async function applyPromoCode(req, res) {
  try {
    const { promoCode } = req.body;

    if (!promoCode || typeof promoCode !== 'string') {
      return res.status(400).json({ valid: false, message: 'Promo code is required.' });
    }

    const code = promoCode.trim().toUpperCase();

    const baseAmountPaise = parseInt(process.env.REGISTRATION_FEE_PAISE, 10);
    const result = resolvePromoCode(code, baseAmountPaise);

    if (!result.valid) {
      return res.status(200).json({ valid: false, message: result.message ||'Invalid promo code.' });
    }

    return res.status(200).json({
      valid:            true,
      discount:         result.discountPaise,
      finalAmountPaise: result.finalAmountPaise,
      message:          `Promo applied! ${(result.discountPaise / 100).toFixed(2)} Rs off — you pay ₹${(result.finalAmountPaise / 100).toFixed(2)}.`,
    });


  } catch (err) {
    console.error('[Hackathon] applyPromoCode error:', err);
    res.status(500).json({ valid: false, message: 'Something went wrong. Please try again.' });
  }
}


function resolvePromoCode(code, baseAmountPaise) {
  const normalized     = code.trim().toUpperCase();
  const discountPaise = PROMO_CODES[normalized];
  if (discountPaise === undefined) {
    return { valid: false };
  }

  const currentUses = getPromoCodeUseCount();
  const maxUses = parseInt(process.env.MAX_PROMO_USES, 10);
  if (currentUses >= maxUses) {
    return { valid: false, message: 'Promo code usage limit has been reached.' };
  }

  const finalAmountPaise    = parseInt(baseAmountPaise - discountPaise, 10);
  return { valid: true, discountPaise, finalAmountPaise };
}





// ─── GET /api/hackathon/team/:teamId ─────────────────────────────────────────
//
// Retrieve full registration details for a confirmed team (for confirmation page).
// Uses the shared teamId UUID (set during webhook processing).

// async function getTeam(req, res) {
//   try {
//     const { teamId } = req.params;

//     const participants = await prisma.hackathonParticipant.findMany({
//       where: { teamId },
//       orderBy: [{ isLeader: 'desc' }, { createdAt: 'asc' }],
//     });

//     if (!participants || participants.length === 0) {
//       return res.status(404).json({ error: 'Team not found.' });
//     }

//     // Shape a clean response
//     const leader = participants.find(p => p.isLeader);
//     const members = participants.filter(p => !p.isLeader);

//     res.json({
//       team: {
//         teamId: leader.teamId,
//         teamName: leader.teamName,
//         razorpayOrderId: leader.razorpayOrderId,
//         razorpayPaymentId: leader.razorpayPaymentId,
//         amountPaid: leader.amountPaid,
//         status: leader.status,
//         createdAt: leader.createdAt,
//         leader: {
//           name: leader.name,
//           email: leader.email,
//           phone: leader.phone,
//           college: leader.college,
//         },
//         members: members.map(m => ({
//           name: m.name,
//           email: m.email,
//           phone: m.phone,
//           college: m.college,
//         })),
//       },
//     });

//   } catch (err) {
//     console.error('[Hackathon] getTeam error:', err);
//     res.status(500).json({ error: err.message });
//   }
// }

module.exports = {
  initiatePayment,
  handleWebhook,
  getRegistrationStatus,
  applyPromoCode,
  // getTeam,
};
