'use strict';

const API = 'http://localhost:10003/api/hackathon';

// ── State ────────────────────────────────────────────────────────────────────
let currentStep = 1;
let memberCount = 1;
let currentOrderId = null;
let pollTimer = null;

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
      headers: { 'Content-Type': 'application/json' },
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
function startPolling(orderId) {
  let attempts = 0;
  const MAX = 30; // 30 × 3 s = 90 s max

  pollTimer = setInterval(async () => {
    attempts++;
    if (attempts > MAX) {
      clearInterval(pollTimer);
      showFinalStatus('timeout');
      return;
    }

    try {
      const res  = await fetch(`${API}/status/${orderId}`);
      const data = await res.json();
      if (data.status === 'registered') {
        clearInterval(pollTimer);
        showFinalStatus('success', data.team);
      } else if (data.status === 'expired' || data.status === 'not_found') {
        clearInterval(pollTimer);
        showFinalStatus('expired');
      }
    } catch { /* ignore network blips */ }
  }, 3000);
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
  clearInterval(pollTimer);
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
