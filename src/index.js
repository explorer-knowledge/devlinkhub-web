'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const hackathonRoutes = require('./routes/hackathonRoutes');
const { globalLimiter } = require('./middleware/rateLimiter');
const app = express();
app.set('trust proxy', 1)
const { loadEmails } = require('./services/emailLoadService');
const { loadOrderId } = require('./services/orderIdService');
const { loadPhone } = require('./services/phoneLoadService');
const { loadEventId } = require('./services/webhookEventId');
const { loadFromCache, downloadLatest } = require('./services/disposableService');
const { startScheduler } = require('./services/scheduler');
const PORT = process.env.PORT || 10003;

// ─── CORS ───────────
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'https://temporary.404lab.xyz',
    'https://event.devlinkhub.in',
  ],
  credentials: true,
}));
app.use(globalLimiter); // ─── Global rate limit: 120 req/min per IP ───────────
// app.use(cors());

// ─── Cloudflare Origin Guard ───────────────────────────────────────────────────
//
// In production, Cloudflare Transform Rules inject X-CF-Secret on every proxied
// request. Any direct hit to the raw .onrender.com URL (bypassing Cloudflare)
// will be missing this header and gets a 403.
//
// ⚠️  EXEMPT /api/hackathon/webhook — Razorpay calls Render directly, not through
//     Cloudflare, so it will never carry the CF secret header.
//
// Set CF_SECRET in both:
//   • Cloudflare → Rules → Transform Rules → Modify Request Header (inject header)
//   • Render → Environment Variables (same value)
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'production') return next();
  if (req.path === '/api/hackathon/webhook') return next();
  if (req.path === '/health') return next(); // Razorpay bypasses CF
  if (req.headers['x-origin'] !== process.env.CF_SECRET) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
});

// ─── Body Parsing ─────────────────────────────────────────────────────────────
//
// ⚠️  ORDER MATTERS — THIS IS CRITICAL FOR THE WEBHOOK:
//
// The webhook route (/api/hackathon/webhook) MUST receive the raw Buffer body
// so that HMAC-SHA256(rawBody, webhookSecret) can be computed and verified against
// the x-razorpay-signature header.
//
// express.json() applied globally WILL consume the body first, even if a route-level
// express.raw() is also registered — the global middleware wins because it runs first.
//
// Solution: explicitly EXCLUDE the webhook path from the global JSON parser.
// The webhook route registers its own express.raw() in hackathonRoutes.js.

app.use((req, _res, next) => {
  if (req.path === '/api/hackathon/webhook') return next(); // skip — raw() handles it
  express.json()(req, _res, next);
});
app.use((req, _res, next) => {
  if (req.path === '/api/hackathon/webhook') return next();
  express.urlencoded({ extended: true })(req, _res, next);
});

// ─── Health Check ─────────────
app.get('/health', (_req, res) =>
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
  })
);

// ─── Routes ───────────────────
app.use('/api/hackathon', hackathonRoutes);

// ─── 404 ──────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// ─── Global Error Handler ─────────────
app.use((err, _req, res, _next) => {
  console.error('[Server Error]', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

async function start() {
  await loadEmails();
  await loadOrderId();
  await loadEventId();
  await loadPhone();
  const cacheloaded = await loadFromCache();

  if (!cacheloaded) {
    await downloadLatest();
  } else {
    downloadLatest();
  }
  startScheduler();

  app.listen(PORT, () => {
    console.log(`\n⚡ DevLink Hackathon Backend running on http://localhost:${PORT}`);
    console.log(`\n   Routes:`);
    console.log(`   GET  /health`);
    console.log(`   POST /api/hackathon/initiate        → validate + create Razorpay order + save pending`);
    console.log(`   POST /api/hackathon/webhook         → Razorpay event → verify sig → save to DB`);
    console.log(`   GET  /api/hackathon/status/:orderId → poll registration status`);
  });
  require('./services/redisToDb');
}

start().catch(err => {
  console.error("Startup failed:", err);
  process.exit(1);
});  //Start the listening