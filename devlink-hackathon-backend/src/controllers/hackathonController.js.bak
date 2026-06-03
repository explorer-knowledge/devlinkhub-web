'use strict';

const crypto   = require('crypto');
const prisma   = require('../db/prismaClient');
const razorpay = require('../config/razorpay');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function validateRegistrationBody(body) {
  const { teamName, leaderName, leaderEmail, leaderPhone, leaderCollege, members } = body;

  if (!teamName || !leaderName || !leaderEmail || !leaderPhone || !leaderCollege) {
    return 'All leader fields (teamName, leaderName, leaderEmail, leaderPhone, leaderCollege) are required.';
  }

  if (!Array.isArray(members) || members.length === 0 || members.length > 3) {
    return 'You must provide between 1 and 3 additional team members.';
  }

  const emailsSeen = new Set([leaderEmail.trim().toLowerCase()]);

  // for (let i = 0; i < members.length; i++) {
  //   const m = members[i];
  //   if (!m.name || !m.email || !m.phone || !m.college) {
  //     return `All fields (name, email, phone, college) are required for member ${i + 1}.`;
  //   }
  //   const normalized = m.email.trim().toLowerCase();
  //   if (emailsSeen.has(normalized)) {
  //     return `Duplicate email detected: ${m.email}. Each member must have a unique email.`;
  //   }
  //   emailsSeen.add(normalized);
  // }

  for (const member of members){
    console.log(member);
    const email  = member.email.trim().toLowerCase();
    
    if(!(member.name|| member.email || member.phone || member.college)){
      return "Fill all the fields";
    }
    
    if(emailsSeen.has(email)){
      return "Duplicate email found";
    }
        emailsSeen.add(email);
  }

  return null; // no error
}

// ─── POST /api/hackathon/initiate ─────────────────────────────────────────────
//
// Step 1 — Frontend sends ALL team + member details.
//   1. Validate input
//   2. Check for duplicate leader email in confirmed registrations
//   3. Create Razorpay order
//   4. Persist a PendingRegistration row (keyed by orderId) so the webhook
//      handler can find it later — even if the browser tab is closed.
//
// Response: { orderId, amount, currency, keyId }

async function initiatePayment(req, res) {
  try {
    // 1. Validate
    console.log(req.body)
    const validationError = validateRegistrationBody(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const { teamName, leaderName, leaderEmail, leaderPhone, leaderCollege, members } = req.body;

    // 2. Ensure leader email isn't already registered (confirmed table)
    const alreadyRegistered = await prisma.hackathonTeam.findFirst({
      where: { leaderEmail: leaderEmail.trim().toLowerCase() },
    });
    if (alreadyRegistered) {
      return res.status(409).json({
        error: 'A team with this leader email is already registered.',
        teamId: alreadyRegistered.id,
      });
    }

    // 3. Create Razorpay order
    const amountPaise = parseInt(process.env.REGISTRATION_FEE_PAISE || '49900', 10);
    const receipt     = `hack_${Date.now()}_${leaderEmail.replace(/[^a-z0-9]/gi, '').slice(0, 20)}`;

    const order = await razorpay.orders.create({
      amount:   amountPaise,
      currency: 'INR',
      receipt,
      notes: { teamName, leaderEmail: leaderEmail.trim() },
    });

    // 4. Store pending registration (TTL: 30 min from now)
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    await prisma.pendingRegistration.upsert({
      where:  { razorpayOrderId: order.id },
      create: {
        razorpayOrderId: order.id,
        payload: {
          teamName:      teamName.trim(),
          leaderName:    leaderName.trim(),
          leaderEmail:   leaderEmail.trim().toLowerCase(),
          leaderPhone:   leaderPhone.trim(),
          leaderCollege: leaderCollege.trim(),
          members:       members.map(m => ({
            name:    m.name.trim(),
            email:   m.email.trim().toLowerCase(),
            phone:   m.phone.trim(),
            college: m.college.trim(),
          })),
        },
        expiresAt,
      },
      update: { expiresAt }, // refresh TTL on retry
    });

    console.log(`[Hackathon] 🕐 Pending registration stored for order ${order.id} | team: ${teamName}`);

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
//   3. Write HackathonTeam + HackathonMember to DB (in a transaction)
//   4. Delete pending registration row
//   5. Log WebhookEvent

async function handleWebhook(req, res) {
  // 1. Grab raw body and signature header
  const rawBody  = req.body; // Buffer — because of express.raw()
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

  const eventId   = event.id;         // unique per Razorpay event
  const eventType = event.event;      // e.g. "payment.captured"

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

  console.log(`[Webhook] 💳 Payment captured — orderId: ${orderId} | paymentId: ${paymentId} | amount: ₹${(amount / 100).toFixed(2)}`);

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

  const p = pending.payload;

  // 10. Persist in a transaction: create team + members, delete pending, log event
  try {
    await prisma.$transaction(async (tx) => {
      // Create confirmed team
      await tx.hackathonTeam.create({
        data: {
          teamName:          p.teamName,
          leaderName:        p.leaderName,
          leaderEmail:       p.leaderEmail,
          leaderPhone:       p.leaderPhone,
          leaderCollege:     p.leaderCollege,
          razorpayOrderId:   orderId,
          razorpayPaymentId: paymentId,
          amountPaid:        amount,
          status:            'registered',
          members: {
            create: p.members.map(m => ({
              name:    m.name,
              email:   m.email,
              phone:   m.phone,
              college: m.college,
            })),
          },
        },
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

    console.log(`[Webhook] 🎉 Team "${p.teamName}" registered successfully via webhook!`);
  } catch (err) {
    // If it's a unique constraint violation, the team already exists — safe to ignore
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
//   { status: "registered", teamId, teamName }  — webhook processed, team in DB
//   { status: "not_found" }   — unknown orderId

async function getRegistrationStatus(req, res) {
  try {
    const { orderId } = req.params;

    // Check confirmed table first
    const team = await prisma.hackathonTeam.findUnique({
      where:  { razorpayOrderId: orderId },
      select: { id: true, teamName: true, leaderEmail: true, status: true, createdAt: true },
    });

    if (team) {
      return res.json({ status: 'registered', team });
    }

    // Check pending table
    const pending = await prisma.pendingRegistration.findUnique({
      where: { razorpayOrderId: orderId },
    });

    if (pending) {
      return res.json({ status: 'pending', orderId });
    }

    res.status(404).json({ status: 'not_found', orderId });
  } catch (err) {
    console.error('[Hackathon] getRegistrationStatus error:', err);
    res.status(500).json({ error: err.message });
  }
}

// ─── GET /api/hackathon/team/:teamId ─────────────────────────────────────────
// Retrieve full registration details (for confirmation page)

async function getTeam(req, res) {
  try {
    const { teamId } = req.params;

    const team = await prisma.hackathonTeam.findUnique({
      where:   { id: teamId },
      include: { members: true },
    });

    if (!team) {
      return res.status(404).json({ error: 'Team not found.' });
    }

    res.json({ team });
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
