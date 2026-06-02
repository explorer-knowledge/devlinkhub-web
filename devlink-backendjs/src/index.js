'use strict';

require('dotenv').config();

const express       = require('express');
const cors          = require('cors');
const authRoutes    = require('./routes/authRoutes');
const hackathonRoutes = require('./routes/hackathonRoutes');

const app  = express();
const PORT = process.env.PORT || 10000;

// ─── CORS ─────────────────────────────────────────────────────────────────────
// Allow requests from the static frontend (port 4000) and any ngrok tunnels

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (curl, Postman, server-to-server)
    if (!origin) return callback(null, true);

    const allowed = [
      process.env.FRONTEND_URL || 'http://localhost:4000',
      'http://localhost:3000',
      'http://localhost:4000',
    ];

    // Also allow any ngrok URL
    if (allowed.includes(origin) || origin.includes('ngrok')) {
      return callback(null, true);
    }

    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/hackathon', hackathonRoutes);

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n⚡ DevLink Backend (CJS) running on http://localhost:${PORT}`);
  console.log(`   Auth:      /api/auth`);
  console.log(`   Hackathon: /api/hackathon\n`);
});
