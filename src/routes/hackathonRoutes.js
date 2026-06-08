'use strict';

const { Router }  = require('express');
const express     = require('express');
const {
  initiatePayment,
  handleWebhook,
  getRegistrationStatus,
  applyPromoCode
} = require('../controllers/hackController');
const { liveCount } = require('../controllers/countController');
const {
  initiateLimiter,
  statusLimiter,
  webhookLimiter,
  liveCountLimiter,
  promoLimiter,
} = require('../middleware/rateLimiter');

const router = Router();

// ─── IMPORTANT: Webhook must use express.raw() NOT express.json() ─────────────
//
// Cashfree sends the raw body. We must compute HMAC-SHA256(timestamp+rawBody, secretKey)
// and compare it to the x-webhook-signature header.
// express.json() would parse the body first and destroy the raw bytes needed for signing.
//
// This route is registered BEFORE the global express.json() middleware in index.js
// by mounting the router with its own middleware here.

router.post(
  '/webhook',
  webhookLimiter,
  express.raw({ type: 'application/json' }),
  handleWebhook,
);

// ─── Standard JSON routes ─────────────────────────────────────────────────────

// POST /api/hackathon/initiate
// Step 1 — validate all details + create Cashfree order + save PendingRegistration
router.post('/initiate', initiateLimiter, initiatePayment);

// GET  /api/hackathon/status/:orderId
// Frontend polls this to check if webhook has fired and team is registered
router.get('/status/:orderId', statusLimiter, getRegistrationStatus);

// GET  /api/hackathon/team/:teamId
// Full registration details for confirmation page
// router.get('/team/:teamId', getTeam);
router.post('/promo', promoLimiter, applyPromoCode);

router.get('/live-count', liveCountLimiter, liveCount);

module.exports = router;
