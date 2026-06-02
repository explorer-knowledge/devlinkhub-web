'use strict';

const admin = require('firebase-admin');
require('dotenv').config();

// ─── Firebase Admin Singleton ─────────────────────────────────────────────────
// Initialized once from .env variables. No JSON key file needed.
// Used by authMiddleware to verify Firebase ID tokens server-side.

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // .env stores \n literally — replace so the PEM key is valid
      privateKey: process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        : undefined,
    }),
  });
}

module.exports = admin;
