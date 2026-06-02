// ─── DevLink Test Frontend Config ────────────────────────────────────────────
// All backend and Firebase configuration is centralised here.
// Change BACKEND_URL to match your running backend (ngrok URL or localhost).

const CONFIG = {
  BACKEND_URL: "http://localhost:10002",

  FIREBASE: {
    apiKey: "AIzaSyA-YZdoDbPnM0laGVI-EVTpFyrQDqLU_3w",
    authDomain: "devlink-firebase-dc7a4.firebaseapp.com",
    projectId: "devlink-firebase-dc7a4",
    storageBucket: "devlink-firebase-dc7a4.firebasestorage.app",
    messagingSenderId: "576983700633",
    appId: "1:576983700633:web:eab4a5526bf3bf0896d408",
  },

  // Google reCAPTCHA v2 Site Key (replace with your actual site key from https://www.google.com/recaptcha/admin)
  // For Cloudflare Turnstile: replace with your Turnstile sitekey from Cloudflare dashboard
  RECAPTCHA_SITE_KEY: "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI", // ← this is Google's public TEST key
  // TURNSTILE_SITE_KEY: "0x4AAAAAAA...", // ← uncomment & fill in if you prefer Cloudflare Turnstile

  DEFAULT_AVATAR: "assets/images/default-avatar.png",
};
