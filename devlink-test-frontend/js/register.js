// ─── Hackathon Registration Module ───────────────────────────────────────────
// Manages the team creation → invite → polling → finalize flow.

const POLL_INTERVAL_MS = 5000; // poll member verification every 5 seconds

let currentTeamId = null;
let pollTimer = null;

// ── Member slot state: { email, memberId, status, inviteSent } × N ────────────
let memberSlots = [];

//GetAuthHeaders
async function getAuthHeaders(){
  const user = firebaseAuth.currentUser;
  if(!user){
    throw new Error("User not Logged in");
  };
  const idToken = await user.getIdToken();

  return{
    "Content-Type": "application/json",
    Authorization: `Bearer ${idToken}`,
  };
};





// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 — Validate leader form and create team in backend
// ─────────────────────────────────────────────────────────────────────────────

async function handleCreateTeam(e) {
  e.preventDefault();

  const teamName = document.getElementById("reg-team-name").value.trim();
  const leaderName = document.getElementById("reg-leader-name").value.trim();
  const leaderEmail = document.getElementById("reg-leader-email").value.trim();
  const leaderPhone = document.getElementById("reg-leader-phone").value.trim();
  const leaderCollege = document.getElementById("reg-leader-college").value.trim();

  const sizeSelect = document.getElementById("reg-team-size");
  const numMembers = parseInt(sizeSelect.value, 10);

  const members = [];
  for (let i = 0; i < numMembers; i++) {
    members.push({
      name: document.getElementById(`member-name-${i}`).value.trim(),
      email: document.getElementById(`member-email-${i}`).value.trim(),
      phone: document.getElementById(`member-phone-${i}`).value.trim(),
      college: document.getElementById(`member-college-${i}`).value.trim(),
    });
  }

  const errEl = document.getElementById("reg-error");
  errEl.textContent = "";

  if (!teamName || !leaderName || !leaderEmail || !leaderPhone || !leaderCollege) {
    errEl.textContent = "Please fill in all leader details.";
    return;
  }

  for (let m of members) {
    if (!m.name || !m.email || !m.phone || !m.college) {
      errEl.textContent = "Please enter complete details for all team members.";
      return;
    }
    if (m.email === leaderEmail) {
      errEl.textContent = "Leader email cannot be the same as a team member email.";
      return;
    }
  }

  try {
    setLoading("btn-reg-create", true);

    const res = await fetch(`${CONFIG.BACKEND_URL}/api/hackathon/register`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify({ teamName, leaderName, leaderEmail, leaderPhone, leaderCollege, members }),
    });

    const data = await res.json();

    if (!res.ok) {
      errEl.textContent = data.error || "Failed to create team. Try again.";
      return;
    }

    // Store team id and member ids
    currentTeamId = data.team.id;
    memberSlots = data.team.members.map((m) => ({
      memberId: m.id,
      email: m.email,
      status: m.status,
      inviteSent: false
    }));

    buildInviteRows();
    showRegStep(2);

    if (memberSlots.length > 0) {
      startPolling();
      showToast("Team created! Now send invites to your members.", "success");
    } else {
      // Single person team, all verified implicitly
      const finalizeBtn = document.getElementById("btn-reg-finalize");
      if (finalizeBtn) {
        finalizeBtn.disabled = false;
        finalizeBtn.classList.remove("btn-disabled");
      }
    }
  } catch (err) {
    errEl.textContent = "Network error. Is the backend running?";
    console.error("[Register] createTeam error:", err);
  } finally {
    setLoading("btn-reg-create", false);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 — Send invite to an individual member
// ─────────────────────────────────────────────────────────────────────────────

async function handleSendInvite(slotIndex) {
  const slot = memberSlots[slotIndex];
  if (!slot || !slot.memberId) return;

  const btnId = `btn-invite-${slotIndex}`;

  setLoading(btnId, true);

  try {
    const res = await fetch(`${CONFIG.BACKEND_URL}/api/hackathon/invite`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify({ memberId: slot.memberId }),
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(data.error || "Failed to send invite.", "error");
      return;
    }

    slot.inviteSent = true;
    slot.status = "pending";
    renderMemberStatus(slotIndex);
    showToast(`Invite sent to ${slot.email}`, "success");
  } catch (err) {
    showToast("Network error sending invite.", "error");
    console.error("[Register] sendInvite error:", err);
  } finally {
    setLoading(btnId, false);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POLLING — Check backend every 5s for member verification updates
// ─────────────────────────────────────────────────────────────────────────────

function startPolling() {
  if (pollTimer) clearInterval(pollTimer);
  if (memberSlots.length > 0) {
    pollTimer = setInterval(pollTeamStatus, POLL_INTERVAL_MS);
  }
}

function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
}

async function pollTeamStatus() {
  if (!currentTeamId) return;

  try {
    const res = await fetch(`${CONFIG.BACKEND_URL}/api/hackathon/team-status/${currentTeamId}`);
    if (!res.ok) return;

    const data = await res.json();

    let anyChanged = false;
    data.members.forEach((m, i) => {
      if (memberSlots[i] && memberSlots[i].status !== m.status) {
        memberSlots[i].status = m.status;
        anyChanged = true;
      }
    });

    if (anyChanged) {
      renderAllMemberStatuses();
    }

    // Enable finalize button only if all verified
    const finalizeBtn = document.getElementById("btn-reg-finalize");
    if (finalizeBtn) {
      if (data.allVerified) {
        finalizeBtn.disabled = false;
        finalizeBtn.classList.remove("btn-disabled");
        stopPolling(); // no more polling needed
      } else {
        finalizeBtn.disabled = true;
      }
    }
  } catch (err) {
    // silently ignore poll errors
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// FINALIZE — Register the team once all members are verified
// ─────────────────────────────────────────────────────────────────────────────

async function handleFinalizeTeam() {
  if (!currentTeamId) return;

  try {
    setLoading("btn-reg-finalize", true);

    const res = await fetch(`${CONFIG.BACKEND_URL}/api/hackathon/finalize/${currentTeamId}`, {
      method: "POST",
      headers: await getAuthHeaders()
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(data.error || "Could not finalize. Try again.", "error");
      return;
    }

    stopPolling();
    showRegStep(3); // success screen
    showToast("🎉 Team registered successfully!", "success");
  } catch (err) {
    showToast("Network error. Try again.", "error");
  } finally {
    setLoading("btn-reg-finalize", false);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// UI HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function showRegStep(step) {
  document.querySelectorAll(".reg-step").forEach((el) => el.classList.remove("active"));
  const stepEl = document.getElementById(`reg-step-${step}`);
  if (stepEl) stepEl.classList.add("active");

  // Update stepper indicator
  document.querySelectorAll(".reg-stepper-dot").forEach((dot, i) => {
    dot.classList.toggle("completed", i + 1 < step);
    dot.classList.toggle("current", i + 1 === step);
  });
}

function renderMemberStatus(slotIndex) {
  const slot = memberSlots[slotIndex];
  const statusEl = document.getElementById(`invite-status-${slotIndex}`);
  const btn = document.getElementById(`btn-invite-${slotIndex}`);

  if (!statusEl) return;

  if (slot.status === "verified") {
    statusEl.className = "invite-badge badge-verified";
    statusEl.innerHTML = `<span>✅</span> Verified`;
    if (btn) {
      btn.textContent = "Resend";
      btn.classList.add("btn-resent");
    }
  } else if (slot.inviteSent) {
    statusEl.className = "invite-badge badge-pending";
    statusEl.innerHTML = `<span>⏳</span> Unverified`;
  } else {
    statusEl.className = "invite-badge badge-idle";
    statusEl.innerHTML = `<span>—</span> Not invited`;
  }
}

function renderAllMemberStatuses() {
  memberSlots.forEach((_, i) => renderMemberStatus(i));
}

function buildMemberInputs() {
  const container = document.getElementById("members-container");
  if (!container) return;
  const sizeSelect = document.getElementById("reg-team-size");
  const numMembers = parseInt(sizeSelect.value, 10);
  
  let html = "";
  for (let i = 0; i < numMembers; i++) {
    html += `
      <div style="margin-bottom: 24px; padding: 16px; border: 1px solid var(--border-color); border-radius: 8px;">
        <p style="font-weight: 600; margin-bottom: 12px;">Member ${i + 1}</p>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label" for="member-name-${i}">Full Name</label>
            <input id="member-name-${i}" class="form-input" type="text" placeholder="Member ${i + 1} Name" required />
          </div>
          <div class="form-group">
            <label class="form-label" for="member-email-${i}">Email Address</label>
            <input id="member-email-${i}" class="form-input" type="email" placeholder="member${i + 1}@example.com" required />
          </div>
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label" for="member-phone-${i}">Mobile No.</label>
            <input id="member-phone-${i}" class="form-input" type="tel" placeholder="+91 98765 43210" required />
          </div>
          <div class="form-group">
            <label class="form-label" for="member-college-${i}">College / Institution</label>
            <input id="member-college-${i}" class="form-input" type="text" placeholder="Member ${i + 1} College" required />
          </div>
        </div>
      </div>
    `;
  }
  container.innerHTML = html;
}

function buildInviteRows() {
  const container = document.getElementById("invites-container");
  if (!container) return;
  
  let html = "";
  for (let i = 0; i < memberSlots.length; i++) {
    html += `
      <p class="member-num">Member ${i + 1}</p>
      <div class="invite-row">
        <input id="member-display-${i}" class="form-input" type="email" value="${memberSlots[i].email}" readonly />
        <button id="btn-invite-${i}" class="btn-invite" type="button">Send Invite</button>
        <span id="invite-status-${i}" class="invite-badge badge-idle"><span>—</span> Not invited</span>
      </div>
    `;
  }
  container.innerHTML = html;
  
  for (let i = 0; i < memberSlots.length; i++) {
    const btn = document.getElementById(`btn-invite-${i}`);
    if (btn) {
      btn.addEventListener("click", () => handleSendInvite(i));
    }
  }
}

function resetRegisterModal() {
  currentTeamId = null;
  stopPolling();
  memberSlots = [];

  // Reset forms
  document.getElementById("form-register")?.reset();
  buildMemberInputs();
  
  const invitesContainer = document.getElementById("invites-container");
  if (invitesContainer) invitesContainer.innerHTML = "";

  const finalizeBtn = document.getElementById("btn-reg-finalize");
  if (finalizeBtn) finalizeBtn.disabled = true;

  showRegStep(1);
}

// ─────────────────────────────────────────────────────────────────────────────
// EVENT WIRING — Run after DOM ready
// ─────────────────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  // Team size dropdown
  document.getElementById("reg-team-size")?.addEventListener("change", buildMemberInputs);
  buildMemberInputs();

  // Create Team form
  document.getElementById("form-register")?.addEventListener("submit", handleCreateTeam);

  // Finalize button
  document.getElementById("btn-reg-finalize")?.addEventListener("click", handleFinalizeTeam);

  // Reset on modal close
  document.getElementById("modal-register")?.addEventListener("transitionend", (e) => {
    if (!document.getElementById("modal-register").classList.contains("active")) {
      resetRegisterModal();
    }
  });

  // "Register another team" button on success screen
  document.getElementById("btn-reg-again")?.addEventListener("click", () => {
    resetRegisterModal();
    openModal("modal-register");
  });
});

