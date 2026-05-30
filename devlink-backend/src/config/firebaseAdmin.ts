import admin from "firebase-admin";

// ─── Firebase Admin Singleton ─────────────────────────────────────────────────
// Initialized once from environment variables (no JSON file needed).
// Used by authMiddleware to verify Firebase ID tokens server-side.

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // .env stores \n literally — replace so the PEM is valid
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export default admin;
