'use strict';

const admin = require('../config/firebaseAdmin');

// ─── authenticateToken middleware ─────────────────────────────────────────────
// Reads the Firebase ID token from "Authorization: Bearer <token>" header,
// verifies it with Firebase Admin SDK, and attaches decoded user info to req.user.

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    // Attach decoded Firebase user info to the request
    req.user = {
      uid:     decoded.uid,
      email:   decoded.email   || null,
      name:    decoded.name    || null,
      picture: decoded.picture || null,
    };
    next();
  } catch (err) {
    console.error('[Auth] Token verification failed:', err.message);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { authenticateToken };
