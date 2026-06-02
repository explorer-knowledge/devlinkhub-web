'use strict';

const crypto  = require('crypto');
const prisma  = require('../db/prismaClient');
const razorpay = require('../config/razorpay');
const { validateRegistrationBody } = require('../config/validation');
const { sendHackathonInvite }      = require('../config/mailer');

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
    const validationError = validateRegistrationBody(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const { teamName, participants } = req.body;

    const leader      = participants.find(p => p.isLeader);
    const leaderEmail = leader.email.trim().toLowerCase();


    //Create Razorpay order
    const amountPaise = parseInt(process.env.REGISTRATION_FEE_PAISE || '49900', 10);
    const safeLocal   = leaderEmail.split('@')[0].replace(/[^a-z0-9]/gi, '').slice(0, 20);
    const receipt     = `devlinkhub_hack_${Date.now()}_${safeLocal}`;

    const order = await razorpay.orders.create({
      amount:   amountPaise,
      currency: 'INR',
      receipt,
      notes: {
        teamName,
        leaderEmail,
      },
    });

    //Store pending registration (TTL: 10 min from now)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.pendingRegistration.upsert({
      where:  { razorpayOrderId: order.id },
      create: {
        razorpayOrderId: order.id,
        payload: {
          teamName: teamName.trim(),
          participants: participants.map(p => ({
            name:     p.name.trim(),
            email:    p.email.trim().toLowerCase(),
            phone:    p.phone.trim(),
            college:  p.college.trim(),
            isLeader: !!p.isLeader,
          })),
        },
        expiresAt,
      },
      update: { expiresAt }, // refresh TTL on retry
    });

    console.log(`[Hackathon] Pending registration stored for order ${order.id} | team: ${teamName}`);

    res.status(201).json({
      orderId:  order.id,
      amount:   order.amount,
      currency: order.currency,
      keyId:    process.env.RAZORPAY_KEY_ID,
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
  // 1. Grab raw body and signature header
  const rawBody   = req.body; // Buffer — because of express.raw()
  const signature = req.headers['x-razorpay-signature'];

  if (!signature) {
    console.warn('[Webhook] Missing x-razorpay-signature header');
    return res.status(400).json({ error: 'Missing signature header.' });
  }

  // 2. Verify HMAC-SHA256 signature
  const expectedSig = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');

  if (!crypto.timingSafeEqual(Buffer.from(expectedSig), Buffer.from(signature))) {
    console.warn('[Webhook] ❌ Invalid signature — possible forged request.');
    return res.status(400).json({ error: 'Invalid webhook signature.' });
  }

  // 3. Parse verified body
  let event;
  try {
    event = JSON.parse(rawBody.toString('utf8'));
  } catch {
    return res.status(400).json({ error: 'Malformed JSON body.' });
  }

  const eventId   = req.headers['x-razorpay-event-id'];      // unique per Razorpay event
  const eventType = event.event;   // e.g. "payment.captured"

  if (!eventId) {
    console.warn('[Webhook] Missing x-razorpay-event-id header Critical issue');
    return;
  }

  console.log(`[Webhook] ✅ Verified event: ${eventType} | id: ${eventId}`);

  // 4. Respond 200 immediately — Razorpay requires a fast response
  //    (it retries on 5xx, so replying before async work is important)
  res.status(200).json({ status: 'ok' });

  // 5. Process only "payment.captured" events
  if (eventType !== 'payment.captured') {
    console.log(`[Webhook] Ignoring event: ${eventType}`);
    return;
  }

  // 6. Idempotency — skip if we've already handled this exact event
  try {
    const existing = await prisma.webhookEvent.findUnique({ where: { razorpayEventId: eventId } });
    if (existing) {
      console.log(`[Webhook] Duplicate event ${eventId} — skipping.`);
      return;
    }
  } catch (err) {
    console.error('[Webhook] Idempotency check failed:', err);
    return;
  }

  // 7. Extract payment details from the event payload
  const payment = event?.payload?.payment?.entity;
  if (!payment) {
    console.error('[Webhook] No payment entity in payload:', JSON.stringify(event));
    return;
  }

  const orderId   = payment.order_id;
  const paymentId = payment.id;
  const amount    = payment.amount; // paise

  console.log(`[Webhook] Payment captured — orderId: ${orderId} | paymentId: ${paymentId} | amount: ₹${(amount / 100).toFixed(2)}`);

  // 8. Find the pending registration
  let pending;
  try {
    pending = await prisma.pendingRegistration.findUnique({
      where: { razorpayOrderId: orderId },
    });
  } catch (err) {
    console.error('[Webhook] Failed to fetch pending registration:', err);
    return;
  }

  if (!pending) {
    console.error(`[Webhook] No pending registration found for orderId: ${orderId}`);
    return;
  }

  // 9. Check TTL
  if (new Date() > pending.expiresAt) {
    console.warn(`[Webhook] Pending registration expired for orderId: ${orderId}`);
    await prisma.pendingRegistration.delete({ where: { razorpayOrderId: orderId } }).catch(() => {});
    return;
  }

  const p      = pending.payload;
  const teamId = crypto.randomUUID(); // shared UUID for every row in this team

  // 10. Persist in a transaction: create all participant rows, delete pending, log event
  try {
    await prisma.$transaction(async (tx) => {
      // Create one HackathonParticipant row per person (leader + members)
      await tx.hackathonParticipant.createMany({
        data: p.participants.map(participant => ({
          teamId,
          teamName:          p.teamName,
          razorpayOrderId:   orderId,
          razorpayPaymentId: paymentId,
          amountPaid:        amount,
          status:            'registered',
          isLeader:          participant.isLeader,
          name:              participant.name,
          email:             participant.email,
          phone:             participant.phone,
          college:           participant.college,
        })),
      });

      // Delete pending row (no longer needed)
      await tx.pendingRegistration.delete({ where: { razorpayOrderId: orderId } });

      // Log event for idempotency
      await tx.webhookEvent.create({
        data: {
          razorpayEventId: eventId,
          event:           eventType,
        },
      });
    });

    console.log(`[Webhook] 🎉 Team "${p.teamName}" (id: ${teamId}) registered successfully via webhook!`);

    // 11. Fire invite emails to non-leader participants (non-blocking — don't await)
    const leader  = p.participants.find(participant => participant.isLeader);
    const members = p.participants.filter(participant => !participant.isLeader);

    for (const member of members) {
      const confirmToken = crypto.randomBytes(32).toString('hex');
      sendHackathonInvite({
        toEmail:     member.email,
        teamName:    p.teamName,
        leaderName:  leader ? leader.name : 'Team Leader',
        confirmToken,
      }).catch(mailErr => {
        console.error(`[Webhook] Failed to send invite to ${member.email}:`, mailErr.message);
      });
    }

  } catch (err) {
    // P2002 = unique constraint violation → team already registered from a duplicate webhook
    if (err.code === 'P2002') {
      console.log(`[Webhook] Team for order ${orderId} already registered — duplicate webhook ignored.`);
    } else {
      console.error('[Webhook] Failed to register team:', err);
    }
  }
}

// ─── GET /api/hackathon/status/:orderId ───────────────────────────────────────
//
// Frontend polls this after payment to know if the webhook has fired and
// the team has been registered.
//
// Responses:
//   { status: "pending" }     — payment initiated, webhook not yet received
//   { status: "registered", teamId, teamName, participants }  — webhook processed
//   { status: "not_found" }   — unknown orderId

async function getRegistrationStatus(req, res) {
  try {
    const { orderId } = req.params;

    // Check confirmed table first (any row with this orderId is sufficient)
    const leaderRow = await prisma.hackathonParticipant.findFirst({
      where:  { razorpayOrderId: orderId, isLeader: true },
      select: { teamId: true, teamName: true, status: true, createdAt: true },
    });

    if (leaderRow) {
      return res.json({
        status:   'registered',
        team: {
          id:       leaderRow.teamId,
          teamName: leaderRow.teamName,
          status:   leaderRow.status,
          createdAt: leaderRow.createdAt,
        }
      });
    }

    // Check pending table
    const pending = await prisma.pendingRegistration.findUnique({
      where: { razorpayOrderId: orderId },
    });

    if (pending) {
      if (new Date() > pending.expiresAt) {
        return res.json({ status: 'expired', orderId });
      }
      return res.json({ status: 'pending', orderId });
    }

    res.status(404).json({ status: 'not_found', orderId });

  } catch (err) {
    console.error('[Hackathon] getRegistrationStatus error:', err);
    res.status(500).json({ error: err.message });
  }
}

// ─── GET /api/hackathon/team/:teamId ─────────────────────────────────────────
//
// Retrieve full registration details for a confirmed team (for confirmation page).
// Uses the shared teamId UUID (set during webhook processing).

async function getTeam(req, res) {
  try {
    const { teamId } = req.params;

    const participants = await prisma.hackathonParticipant.findMany({
      where:   { teamId },
      orderBy: [{ isLeader: 'desc' }, { createdAt: 'asc' }],
    });

    if (!participants || participants.length === 0) {
      return res.status(404).json({ error: 'Team not found.' });
    }

    // Shape a clean response
    const leader  = participants.find(p => p.isLeader);
    const members = participants.filter(p => !p.isLeader);

    res.json({
      team: {
        teamId:            leader.teamId,
        teamName:          leader.teamName,
        razorpayOrderId:   leader.razorpayOrderId,
        razorpayPaymentId: leader.razorpayPaymentId,
        amountPaid:        leader.amountPaid,
        status:            leader.status,
        createdAt:         leader.createdAt,
        leader: {
          name:    leader.name,
          email:   leader.email,
          phone:   leader.phone,
          college: leader.college,
        },
        members: members.map(m => ({
          name:    m.name,
          email:   m.email,
          phone:   m.phone,
          college: m.college,
        })),
      },
    });

  } catch (err) {
    console.error('[Hackathon] getTeam error:', err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  initiatePayment,
  handleWebhook,
  getRegistrationStatus,
  getTeam,
};
