'use strict';

const { rateLimit, ipKeyGenerator } = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const redis = require('../db/rateLimitRedis');

// ─── Helper: build a limiter backed by AWS Redis ───────────────────────────────
function makeRedisLimiter({ windowMs, max, keyPrefix, message }) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,

    // Cloudflare sends the real IP in CF-Connecting-IP.
    // Render proxy sends it in X-Forwarded-For.
    // Fall back to req.ip (works locally).
    keyGenerator: (req) => {
      const ip =
        req.headers['cf-connecting-ip'] ||
        (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
        req.ip;
      return ipKeyGenerator(ip);
    },

    store: new RedisStore({
      prefix: keyPrefix,
      sendCommand: (...args) => redis.call(...args),
    }),

    handler: (_req, res) => {
      console.log("rate limited");
      res.status(429).json({ error: message || 'Too many requests, please slow down.' });
    },
  });
}

// ─── Route-specific limiters ───────────────────────────────────────────────────

// POST /api/hackathon/initiate
// A real user registers once — 5 attempts per 15 min is generous for retries
const initiateLimiter = makeRedisLimiter({
  windowMs: 15 * 60 * 1000,
  max: 7,
  keyPrefix: 'rl:initiate:',
  message: 'Too many registration attempts. Please wait 15 minutes and try again.',
});

// GET /api/hackathon/status/:orderId
// Frontend polls every ~3s for ~90s after payment = ~30 requests; 40 gives headroom
const statusLimiter = makeRedisLimiter({
  windowMs: 5 * 60 * 1000,
  max: 40,
  keyPrefix: 'rl:status:',
  message: 'Too many status checks. Please slow down.',
});

// POST /api/hackathon/webhook
// Called only by Razorpay servers; real security is HMAC verification
const webhookLimiter = makeRedisLimiter({
  windowMs: 30 * 1000,
  max: 30,
  keyPrefix: 'rl:webhook:',
  message: 'Too many webhook requests.',
});

// GET /api/hackathon/live-count
// Public-facing counter — polled by the UI; keep generous but bounded
const liveCountLimiter = makeRedisLimiter({
  windowMs: 2 * 60 * 1000,
  max: 60,
  keyPrefix: 'rl:livecount:',
  message: 'Too many requests.',
});

// POST /api/hackathon/promo
// Frontend polls this to validate promo codes; strict limit to prevent brute-forcing
const promoLimiter = makeRedisLimiter({
  windowMs: 5 * 60 * 1000,
  max: 5,
  keyPrefix: 'rl:promo:',
  message: 'Too many promo code attempts. Please wait a minute and try again.',
});

// Applied globally in index.js — hard ceiling for every route
const globalLimiter = makeRedisLimiter({
  windowMs: 5 * 60 * 1000,
  max: 140,
  keyPrefix: 'rl:global:',
  message: 'Too many requests. Please slow down.',
});

module.exports = {
  initiateLimiter,
  statusLimiter,
  webhookLimiter,
  liveCountLimiter,
  promoLimiter,
  globalLimiter,
};
