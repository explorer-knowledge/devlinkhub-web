// ─── Auth Module ──────────────────────────────────────────────────────────────
// Manages all authentication logic: Firebase sign-in/up, backend sync, and UI state.

// ── Helpers ──────────────────────────────────────────────────────────────────

async function syncWithBackend(user) {
  try {
    const idToken = await user.getIdToken(/* forceRefresh */ true);
    const res = await fetch(`${CONFIG.BACKEND_URL}/api/auth/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        provider: user.providerData[0]?.providerId || "password",
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      console.warn("[Auth] Backend sync failed:", body);
    }
  } catch (err) {
    console.error("[Auth] Backend sync error:", err);
  }
}

async function logoutFromBackend(idToken) {
  try {
    await fetch(`${CONFIG.BACKEND_URL}/api/auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${idToken}` },
    });
  } catch (err) {
    console.warn("[Auth] Backend logout error:", err);
  }
}

// ── reCAPTCHA Helpers ─────────────────────────────────────────────────────────

let captchaWidgetId = null;

function renderCaptcha(containerId) {
  if (typeof grecaptcha === "undefined") return;
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";
  captchaWidgetId = grecaptcha.render(container, {
    sitekey: CONFIG.RECAPTCHA_SITE_KEY,
    theme: "dark",
    size: "normal",
  });
}

function getCaptchaToken() {
  if (typeof grecaptcha === "undefined" || captchaWidgetId === null) return null;
  return grecaptcha.getResponse(captchaWidgetId) || null;
}

function resetCaptcha() {
  if (typeof grecaptcha !== "undefined" && captchaWidgetId !== null) {
    grecaptcha.reset(captchaWidgetId);
  }
}

// ── Modal Management ──────────────────────────────────────────────────────────

function openModal(id) {
  closeAllModals();
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add("active");
    document.body.classList.add("modal-open");

    // Only render CAPTCHA for auth modals (not the hackathon register modal)
    if (id === "modal-login" || id === "modal-signup") {
      const containerId = id === "modal-login" ? "recaptcha-login" : "recaptcha-signup";
      setTimeout(() => renderCaptcha(containerId), 200);
    }
  }
}

function closeAllModals() {
  document.querySelectorAll(".modal").forEach((m) => m.classList.remove("active"));
  document.body.classList.remove("modal-open");
  captchaWidgetId = null;
}

// ── Email / Password Auth ─────────────────────────────────────────────────────

async function handleEmailLogin(e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  const errEl = document.getElementById("login-error");
  errEl.textContent = "";

  const token = getCaptchaToken();
  if (!token) {
    errEl.textContent = "Please complete the CAPTCHA.";
    return;
  }

  try {
    setLoading("btn-login-submit", true);
    const cred = await firebaseAuth.signInWithEmailAndPassword(email, password);
    await syncWithBackend(cred.user);
    closeAllModals();
    showToast("Signed in successfully!", "success");
  } catch (err) {
    errEl.textContent = friendlyError(err.code);
    resetCaptcha();
  } finally {
    setLoading("btn-login-submit", false);
  }
}

async function handleEmailSignup(e) {
  e.preventDefault();
  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;
  const errEl = document.getElementById("signup-error");
  errEl.textContent = "";

  if (password.length < 6) {
    errEl.textContent = "Password must be at least 6 characters.";
    return;
  }

  const token = getCaptchaToken();
  if (!token) {
    errEl.textContent = "Please complete the CAPTCHA.";
    return;
  }

  try {
    setLoading("btn-signup-submit", true);
    const cred = await firebaseAuth.createUserWithEmailAndPassword(email, password);
    await cred.user.updateProfile({ displayName: name });
    await syncWithBackend(cred.user);
    closeAllModals();
    showToast("Account created! Welcome to DevLink.", "success");
  } catch (err) {
    errEl.textContent = friendlyError(err.code);
    resetCaptcha();
  } finally {
    setLoading("btn-signup-submit", false);
  }
}

// ── OAuth Auth ────────────────────────────────────────────────────────────────

async function handleOAuthLogin(provider) {
  try {
    closeAllModals();
    const cred = await firebaseAuth.signInWithPopup(provider);
    await syncWithBackend(cred.user);
    showToast(`Welcome, ${cred.user.displayName || "there"}!`, "success");
  } catch (err) {
    if (err.code !== "auth/popup-closed-by-user") {
      showToast(friendlyError(err.code), "error");
    }
  }
}

// ── Logout ────────────────────────────────────────────────────────────────────

async function handleLogout() {
  try {
    const user = firebaseAuth.currentUser;
    if (user) {
      const idToken = await user.getIdToken();
      await logoutFromBackend(idToken);
    }
    await firebaseAuth.signOut();
    showToast("You have been signed out.", "info");
  } catch (err) {
    console.error("[Auth] Logout error:", err);
    showToast("Logout failed. Try again.", "error");
  }
}

// ── Auth State Observer ───────────────────────────────────────────────────────

firebaseAuth.onAuthStateChanged((user) => {
  const navAuth = document.getElementById("nav-auth-buttons");
  const navProfile = document.getElementById("nav-profile");
  const profileImg = document.getElementById("profile-img");
  const profileName = document.getElementById("profile-name");

  if (user) {
    // Logged-in state
    navAuth.style.display = "none";
    navProfile.style.display = "flex";

    // Set avatar: prefer provider photo, fall back to email-based default
    const isOAuth = user.providerData.some(
      (p) => p.providerId === "google.com" || p.providerId === "github.com"
    );
    profileImg.src = isOAuth && user.photoURL
      ? user.photoURL
      : CONFIG.DEFAULT_AVATAR;
    profileImg.alt = user.displayName || user.email || "User";
    profileName.textContent = (user.displayName || user.email || "User").split(" ")[0];
  } else {
    // Logged-out state
    navAuth.style.display = "flex";
    navProfile.style.display = "none";
  }
});

// ── Utility ───────────────────────────────────────────────────────────────────

function friendlyError(code) {
  const map = {
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password. Try again.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/email-already-in-use": "This email is already registered.",
    "auth/weak-password": "Password is too weak (min 6 chars).",
    "auth/too-many-requests": "Too many attempts. Please wait a moment.",
    "auth/popup-blocked": "Popup was blocked. Allow popups for this site.",
    "auth/account-exists-with-different-credential":
      "An account already exists with the same email using a different sign-in method.",
  };
  return map[code] || "Something went wrong. Please try again.";
}

function setLoading(btnId, isLoading) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.disabled = isLoading;
  btn.dataset.originalText = btn.dataset.originalText || btn.textContent;
  btn.textContent = isLoading ? "Please wait…" : btn.dataset.originalText;
}

function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// ── Event Listeners (wired after DOM ready) ───────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  // Nav buttons
  document.getElementById("btn-nav-login")?.addEventListener("click", () => openModal("modal-login"));
  document.getElementById("btn-nav-signup")?.addEventListener("click", () => openModal("modal-signup"));
  document.getElementById("btn-nav-register")?.addEventListener("click", () => openModal("modal-register"));

  // Profile dropdown
  document.getElementById("profile-btn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    document.getElementById("profile-dropdown")?.classList.toggle("open");
  });
  document.addEventListener("click", () => {
    document.getElementById("profile-dropdown")?.classList.remove("open");
  });

  // Logout
  document.getElementById("btn-logout")?.addEventListener("click", handleLogout);

  // Modal close buttons & backdrop
  document.querySelectorAll(".modal-close, .modal-backdrop").forEach((el) => {
    el.addEventListener("click", closeAllModals);
  });
  document.querySelectorAll(".modal-box").forEach((box) => {
    box.addEventListener("click", (e) => e.stopPropagation());
  });

  // Login form
  document.getElementById("form-login")?.addEventListener("submit", handleEmailLogin);

  // Signup form
  document.getElementById("form-signup")?.addEventListener("submit", handleEmailSignup);

  // OAuth buttons — Login modal
  document.getElementById("btn-login-google")?.addEventListener("click", () => handleOAuthLogin(googleProvider));
  document.getElementById("btn-login-github")?.addEventListener("click", () => handleOAuthLogin(githubProvider));

  // OAuth buttons — Signup modal
  document.getElementById("btn-signup-google")?.addEventListener("click", () => handleOAuthLogin(googleProvider));
  document.getElementById("btn-signup-github")?.addEventListener("click", () => handleOAuthLogin(githubProvider));

  // Switch between login / signup modals
  document.getElementById("link-to-signup")?.addEventListener("click", (e) => {
    e.preventDefault();
    openModal("modal-signup");
  });
  document.getElementById("link-to-login")?.addEventListener("click", (e) => {
    e.preventDefault();
    openModal("modal-login");
  });

  // Hero CTA buttons
  document.getElementById("btn-hero-signup")?.addEventListener("click", () => openModal("modal-signup"));
  document.getElementById("btn-hero-login")?.addEventListener("click", () => openModal("modal-login"));
});
