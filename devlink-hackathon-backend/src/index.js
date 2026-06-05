'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const hackathonRoutes = require('./routes/hackathonRoutes');
const app = express();
const { loadEmails } = require('./services/emailLoadService');
const { loadOrderId } = require('./services/orderIdService');
const { loadPhone } = require('./services/phoneLoadService');
const { loadEventId } = require('./services/webhookEventId');
const { loadFromCache, downloadLatest } = require('./services/disposableService');
const { startScheduler } = require('./services/scheduler');
const PORT = process.env.PORT || 10003;

// ─── CORS ───────────
app.use(cors({
  origin:  [
      process.env.FRONTEND_URL,
      'http://localhost:4000',
      'https://juliette-hokey-pacifically.ngrok-free.dev',
      'https://temporary.404lab.xyz',
    ],
  credentials: true,
}));
// app.use(cors());

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
    service: 'devlink-hackathon-backend',
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