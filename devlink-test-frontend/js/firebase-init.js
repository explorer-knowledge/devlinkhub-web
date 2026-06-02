// ─── Firebase SDK Initialisation ─────────────────────────────────────────────
// Loaded AFTER config.js so CONFIG is already in scope.
// Uses the Firebase compat CDN build for simplicity (no bundler required).

const firebaseApp = firebase.initializeApp(CONFIG.FIREBASE);
const firebaseAuth = firebase.auth();

// ─── Auth Providers ───────────────────────────────────────────────────────────
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.addScope("profile");
googleProvider.addScope("email");

const githubProvider = new firebase.auth.GithubAuthProvider();
githubProvider.addScope("user:email");
githubProvider.addScope("read:user");
