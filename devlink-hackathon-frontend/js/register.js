'use strict';

const API = 'https://juliette-hokey-pacifically.ngrok-free.dev/api/hackathon';

// ── State ────────────────────────────────────────────────────────────────────
let currentStep = 1;
let memberCount = 1;
let currentOrderId = null;
let pollTimer      = null;  // setTimeout handle for the active poll loop
let pollStartedAt  = null;  // Date.now() when the current poll loop began

// ── DOM helpers ──────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

function toast(msg, type = 'info') {
  const t = $('toast');
  t.textContent = (type === 'error' ? '✕  ' : type === 'success' ? '✓  ' : 'ℹ  ') + msg;
  t.className = `toast ${type} show`;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 4000);
}

function setLoading(btn, loading) {
  btn.disabled = loading;
  btn.dataset.orig = btn.dataset.orig || btn.textContent;
  btn.textContent = loading ? 'Please wait…' : btn.dataset.orig;
}

// ── Progress ─────────────────────────────────────────────────────────────────
function setStep(n) {
  currentStep = n;
  document.querySelectorAll('.step').forEach(s => s.classList.toggle('active', +s.dataset.step === n));
  document.querySelectorAll('.step-dot').forEach(d => {
    const i = +d.dataset.step;
    d.classList.toggle('active', i === n);
    d.classList.toggle('done', i < n);
  });
  document.querySelectorAll('.step-line').forEach(l => {
    l.classList.toggle('done', +l.dataset.after < n);
  });
}

// ── Member cards ─────────────────────────────────────────────────────────────
function buildMemberCards(count) {
  const container = $('members-container');
  container.innerHTML = '';
  for (let i = 1; i <= count; i++) {
    container.insertAdjacentHTML('beforeend', `
      <div class="member-card">
        <h4>
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
          Member ${i}
        </h4>
        <div class="form-grid">
          <div class="full"><label>Full Name</label><input id="m${i}-name" placeholder="Jane Doe" required></div>
          <div><label>Email</label><input id="m${i}-email" type="email" placeholder="jane@college.edu" required></div>
          <div><label>Phone</label><input id="m${i}-phone" type="tel" placeholder="9876543210" required></div>
          <div class="full"><label>College / Institute</label><input id="m${i}-college" placeholder="IIT Bombay" required></div>
        </div>
      </div>`);
  }
}

// ── Validation helpers ───────────────────────────────────────────────────────
function val(id) { return ($(id)?.value || '').trim(); }

function validateStep1() {
  if (!val('teamName'))      { toast('Team name is required', 'error'); return false; }
  if (!val('leaderName'))    { toast('Leader name is required', 'error'); return false; }
  const email = val('leaderEmail');
  if (!email || !email.includes('@')) { toast('Valid leader email is required', 'error'); return false; }
  if (!val('leaderPhone'))   { toast('Leader phone is required', 'error'); return false; }
  if (!val('leaderCollege')) { toast('Leader college is required', 'error'); return false; }
  return true;
}

function validateStep2() {
  const leaderEmail = val('leaderEmail').toLowerCase();
  const seen = new Set([leaderEmail]);
  for (let i = 1; i <= memberCount; i++) {
    if (!val(`m${i}-name`))   { toast(`Member ${i}: name is required`, 'error'); return false; }
    const e = val(`m${i}-email`).toLowerCase();
    if (!e || !e.includes('@')) { toast(`Member ${i}: valid email required`, 'error'); return false; }
    if (seen.has(e))            { toast(`Member ${i}: duplicate email`, 'error'); return false; }
    seen.add(e);
    if (!val(`m${i}-phone`))   { toast(`Member ${i}: phone is required`, 'error'); return false; }
    if (!val(`m${i}-college`)) { toast(`Member ${i}: college is required`, 'error'); return false; }
  }
  return true;
}

function collectPayload() {
  // Build a flat participants array matching HackathonParticipant schema.
  // The leader row has isLeader:true; every additional member has isLeader:false.
  const participants = [
    {
      name:     val('leaderName'),
      email:    val('leaderEmail'),
      phone:    val('leaderPhone'),
      college:  val('leaderCollege'),
      isLeader: true,
    },
    ...Array.from({ length: memberCount }, (_, i) => ({
      name:     val(`m${i+1}-name`),
      email:    val(`m${i+1}-email`),
      phone:    val(`m${i+1}-phone`),
      college:  val(`m${i+1}-college`),
      isLeader: false,
    })),
  ];

  return {
    teamName:     val('teamName'),
    participants,
  };
}

// ── Step 3: initiate payment ──────────────────────────────────────────────────
async function initiatePayment() {
  const btn = $('btn-pay');
  setLoading(btn, true);

  try {
    const res  = await fetch(`${API}/initiate`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        "ngrok-skip-browser-warning": "true"
       },
      body: JSON.stringify(collectPayload()),
    });
    const data = await res.json();

    if (!res.ok) { toast(data.error || 'Failed to initiate payment', 'error'); setLoading(btn, false); return; }

    currentOrderId = data.orderId;
    openRazorpay(data);
  } catch (err) {
    toast('Network error — is the backend running?', 'error');
    console.error(err);
    setLoading(btn, false);
  }
}

// ── Razorpay Checkout ─────────────────────────────────────────────────────────
function openRazorpay({ orderId, amount, currency, keyId }) {
  const options = {
    key:         keyId,
    amount,
    currency,
    name:        'DevLink Hackathon',
    description: 'Team Registration Fee',
    order_id:    orderId,
    theme:       { color: '#6c63ff' },
    handler: () => {
      // Payment done — move to polling screen
      setStep(4);
      startPolling(orderId);
    },
    modal: {
      ondismiss: () => {
        setLoading($('btn-pay'), false);
        toast('Payment cancelled', 'error');
      },
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
}

// ── Step 4: Poll status ───────────────────────────────────────────────────────
//
// Design:
//  • Recursive setTimeout (not setInterval) so no two fetches overlap.
//  • Exponential back-off: 2 s → 4 → 8 → 16 → capped at 30 s, ±20 % jitter.
//  • Consecutive-error counter — warns the user after 5 network failures in a row.
//  • HTTP 5xx treated as a transient error, not a parse target.
//  • `not_found` tolerated for the first NOT_FOUND_GRACE_MS (30 s) to cover
//    the race window between webhook processing and in-memory cache population.
//  • Double-start guard: clears any existing timer at the top.
//  • Live attempt counter shown in the polling screen.
//
function startPolling(orderId) {
  // ── Guard: cancel any previous poll loop ──────────────────────────────────
  if (pollTimer != null) {
    clearTimeout(pollTimer);
    pollTimer = null;
  }

  // ── Config ─────────────────────────────────────────────────────────────────
  const INITIAL_DELAY_MS    = 2_000;   // first poll after 2 s
  const MAX_DELAY_MS        = 30_000;  // back-off cap
  const JITTER_RATIO        = 0.20;    // ±20 % randomisation
  const TIMEOUT_MS          = 90_000;  // absolute wall-clock deadline
  const MAX_CONSEC_ERRORS   = 5;       // consecutive network failures before warning
  const NOT_FOUND_GRACE_MS  = 30_000;  // tolerate not_found for this long

  let delay          = INITIAL_DELAY_MS;
  let consecutiveErr = 0;
  let attempt        = 0;
  pollStartedAt      = Date.now();

  // ── Helpers ────────────────────────────────────────────────────────────────
  function updatePollCounter() {
    const msg = $('poll-msg');
    if (msg) msg.textContent = `Checking registration status… (attempt ${attempt})`;
  }

  function scheduleNext() {
    if (pollTimer != null) clearTimeout(pollTimer);
    pollTimer = setTimeout(poll, delay);
    // Compute next delay: double, cap, jitter
    const next   = Math.min(delay * 2, MAX_DELAY_MS);
    const jitter = next * JITTER_RATIO * (Math.random() * 2 - 1); // [-20 %, +20 %]
    delay = Math.round(next + jitter);
  }

  // ── Core poll function ────────────────────────────────────────────────────
  async function poll() {
    pollTimer = null;
    attempt++;
    updatePollCounter();

    // Absolute timeout guard
    if (Date.now() - pollStartedAt >= TIMEOUT_MS) {
      showFinalStatus('timeout');
      return;
    }

    let res, data;
    try {
      res = await fetch(`${API}/status/${orderId}`,{
        headers: {
          "ngrok-skip-browser-warning": "true"
        }
      }
    );

      // Server-side errors (5xx) — treat as a transient blip, do not parse
      if (res.status >= 500) {
        throw new Error(`Server error ${res.status}`);
      }

      data = await res.json();
      consecutiveErr = 0; // reset on any successful HTTP response
      console.log(`[Poll] attempt=${attempt} status=${data.status} orderId=${orderId}`, data);
    } catch (err) {
      consecutiveErr++;
      console.warn(`[Poll] Network/server error (${consecutiveErr} consecutive):`, err.message);

      if (consecutiveErr >= MAX_CONSEC_ERRORS) {
        toast('Having trouble reaching the server. Still trying…', 'error');
      }

      scheduleNext();
      return;
    }

    // ── Terminal success ────────────────────────────────────────────────────
    if (data.status === 'registered') {
      showFinalStatus('success', data.team);
      return;
    }

    // ── Hard failure explicitly returned by the backend ─────────────────────
    if (data.status === 'expired') {
      showFinalStatus('expired');
      return;
    }

    // ── not_found: tolerate during the webhook-processing grace window ───────
    // The backend deletes the Redis pending key before the in-memory orderMap
    // is populated, so there is a brief race where a valid registration returns
    // not_found.  Treat it as pending until the grace window expires.
    if (data.status === 'not_found') {
      const elapsed = Date.now() - pollStartedAt;
      if (elapsed >= NOT_FOUND_GRACE_MS) {
        // Still not found after 30 s — something went wrong server-side
        showFinalStatus('expired');
        return;
      }
      // Within grace window — keep polling
      scheduleNext();
      return;
    }

    // ── Still pending (or any other non-terminal value) — keep going ─────────
    scheduleNext();
  }

  // Kick off the first poll
  scheduleNext();
}

function showFinalStatus(type, team) {
  const icon = $('status-icon');
  const title = $('status-title');
  const sub   = $('status-sub');

  if (type === 'success') {
    icon.textContent = '🎉';
    title.textContent = 'Registration Successful!';
    sub.innerHTML = `Team <strong>${team.teamName}</strong> is now registered.<br>
      Check your email for confirmation. Team ID: <code style="color:var(--accent2)">${team.id}</code>`;
  } else if (type === 'expired') {
    icon.textContent = '❌';
    title.textContent = 'Registration Expired';
    sub.textContent = 'The registration window has expired. Please contact support if your payment was deducted.';
  } else {
    icon.textContent = '⏳';
    title.textContent = 'Processing…';
    sub.textContent = 'Payment received but confirmation is taking longer than expected. Please check your email or contact support.';
  }

  $('poll-spinner').style.display = 'none';
  $('poll-msg').style.display = 'none';
  $('status-icon').style.display = 'block';
  $('status-title').style.display = 'block';
  $('status-sub').style.display = 'block';
  $('btn-done').style.display = 'inline-flex';
}

// ── Modal open/close ──────────────────────────────────────────────────────────
function openModal() {
  $('overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  setStep(1);
  buildMemberCards(memberCount);
}

function closeModal() {
  $('overlay').classList.remove('open');
  document.body.style.overflow = '';
  // Cancel the recursive setTimeout poll loop (was clearInterval before)
  if (pollTimer != null) {
    clearTimeout(pollTimer);
    pollTimer = null;
  }
  pollStartedAt = null;
  currentOrderId = null;
}

// ── Wire events ───────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildMemberCards(memberCount);

  $('btn-open').addEventListener('click', openModal);
  $('btn-close').addEventListener('click', closeModal);
  $('overlay').addEventListener('click', e => { if (e.target === $('overlay')) closeModal(); });

  // Step 1 → 2
  $('btn-next1').addEventListener('click', () => {
    if (validateStep1()) setStep(2);
  });

  // Member count selector
  $('member-count').addEventListener('change', e => {
    memberCount = +e.target.value;
    buildMemberCards(memberCount);
  });

  // Step 2 → 3
  $('btn-next2').addEventListener('click', () => {
    if (validateStep2()) {
      // populate review
      $('rev-team').textContent   = val('teamName');
      $('rev-leader').textContent = `${val('leaderName')} · ${val('leaderEmail')}`;
      $('rev-members').textContent = `${memberCount} member${memberCount > 1 ? 's' : ''}`;
      setStep(3);
    }
  });

  $('btn-back2').addEventListener('click', () => setStep(1));
  $('btn-back3').addEventListener('click', () => setStep(2));

  $('btn-pay').addEventListener('click', initiatePayment);

  $('btn-done').addEventListener('click', () => {
    closeModal();
    setTimeout(() => {
      // Reset form for re-use
      document.querySelectorAll('input').forEach(i => i.value = '');
      $('member-count').value = '1';
      memberCount = 1;
      buildMemberCards(1);
      setStep(1);
    }, 400);
  });
});
