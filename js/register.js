// State Management
let formState = {
  teamName: "",
  leader: null, // { name, college, mobile, email }
  memberCount: null, // Initialized as null, becomes 1, 2, 3, 4 on click
  members: [], // Array of member objects: { name, college, mobile, email }
  lastSaved: null
};

// Config state tracking for modal context
let activeModalTarget = null; // 'leader' or 'member_0', 'member_1', etc.

// DOM elements
let elements = {};

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  initDOMReferences();
  initCanvasWave();
  initEventListeners();
  restoreSession();
});

// Cache DOM Elements
function initDOMReferences() {
  elements = {
    canvas: document.getElementById('water-canvas'),
    teamNameInput: document.getElementById('team-name-input'),
    charCount: document.getElementById('char-count'),
    teamNameStatus: document.getElementById('team-name-status'),
    teamNameError: document.getElementById('team-name-error'),
    
    sizeBtns: document.querySelectorAll('.size-btn'),
    membersList: document.getElementById('dynamic-members-list'),
    
    summaryPill: document.getElementById('summary-pill'),
    summaryText: document.getElementById('summary-text'),
    submitBtn: document.getElementById('submit-btn'),
    
    modalOverlay: document.getElementById('modal-overlay'),
    modalPanel: document.getElementById('modal-panel'),
    modalTitle: document.getElementById('modal-title'),
    modalSubtitle: document.getElementById('modal-subtitle'),
    modalCloseBtn: document.getElementById('modal-close-btn'),
    modalSaveBtn: document.getElementById('modal-save-btn'),
    
    // Modal fields
    modalNameInput: document.getElementById('modal-name-input'),
    modalCollegeInput: document.getElementById('modal-college-input'),
    modalPhoneInput: document.getElementById('modal-phone-input'),
    modalEmailInput: document.getElementById('modal-email-input'),
    
    // Modal validations
    modalNameError: document.getElementById('modal-name-error'),
    modalCollegeError: document.getElementById('modal-college-error'),
    modalPhoneError: document.getElementById('modal-phone-error'),
    modalEmailError: document.getElementById('modal-email-error'),
    
    // Toast
    toast: document.getElementById('toast-container'),
    toastText: document.getElementById('toast-text'),
    autosaveBadge: document.getElementById('autosave-badge'),
    
    // Cards & Panels for animations
    navbar: document.querySelector('.navbar'),
    mainCard: document.querySelector('.registration-card'),
    formGroups: document.querySelectorAll('.form-group'),
    
    // Success view overlay
    successOverlay: document.getElementById('success-overlay')
  };
}

/* ==========================================
   1. CANVAS FLOWING WATER EFFECT
   ========================================== */
function initCanvasWave() {
  const canvas = elements.canvas;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  let time = 0;
  const spacing = 70; // Grid spacing in px (increased from 45 for performance)
  
  // Debounced resize listener to avoid layout reflows
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, 150);
  });
  
  let lastTime = 0;
  function draw(timestamp) {
    const currentTime = timestamp || performance.now();
    if (currentTime - lastTime < 33) { // 30fps cap
      requestAnimationFrame(draw);
      return;
    }
    lastTime = currentTime;
    
    ctx.clearRect(0, 0, width, height);
    
    const cols = Math.ceil(width / spacing) + 1;
    const rows = Math.ceil(height / spacing) + 1;
    
    let points = [];
    for (let c = 0; c < cols; c++) {
      points[c] = [];
      for (let r = 0; r < rows; r++) {
        let x = c * spacing;
        let baseY = r * spacing;
        
        // Exact wave equation requested
        let y = baseY + Math.sin(x * 0.015 + time) * 30 + Math.cos(x * 0.008 + time * 0.7) * 15;
        points[c][r] = { x, y };
      }
    }
    
    // Create gradients to transition from light color on top to dark blue on the bottom
    const lineGrad = ctx.createLinearGradient(0, 0, 0, height);
    lineGrad.addColorStop(0, 'rgba(0, 245, 255, 0.16)');      // Light cyan/teal at the top
    lineGrad.addColorStop(0.4, 'rgba(124, 58, 237, 0.08)');   // Soft violet transition
    lineGrad.addColorStop(1, 'rgba(0, 30, 110, 0.35)');       // Dark blue at the bottom
    
    const dotGrad = ctx.createLinearGradient(0, 0, 0, height);
    dotGrad.addColorStop(0, 'rgba(0, 245, 255, 0.5)');        // Glowing light cyan dots at top
    dotGrad.addColorStop(0.4, 'rgba(124, 58, 237, 0.3)');     // Violet dots in the middle
    dotGrad.addColorStop(1, 'rgba(0, 30, 110, 0.5)');         // Deep dark blue dots at bottom
    
    // Draw connecting mesh lines
    ctx.beginPath();
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = 1;
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        let p = points[c][r];
        if (c < cols - 1) {
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(points[c + 1][r].x, points[c + 1][r].y);
        }
        if (r < rows - 1) {
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(points[c][r + 1].x, points[c][r + 1].y);
        }
      }
    }
    ctx.stroke();
    
    // Draw glowing intersections
    ctx.beginPath();
    ctx.fillStyle = dotGrad;
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        let p = points[c][r];
        ctx.moveTo(p.x + 1, p.y);
        ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
      }
    }
    ctx.fill();
    
    time += 0.008;
    requestAnimationFrame(draw);
  }
  
  requestAnimationFrame(draw);
}

/* ==========================================
   2. INITIALIZE LISTENERS & EVENT HANDLERS
   ========================================== */
function initEventListeners() {
  // Page entry animations (GSAP with fallback)
  triggerPageLoadAnimations();
  
  // Team Name validation & count
  elements.teamNameInput.addEventListener('input', (e) => {
    const val = e.target.value;
    elements.charCount.textContent = `${val.length}/30`;
    validateTeamName(false); // Validate silently on type
    debounceSave();
  });
  
  elements.teamNameInput.addEventListener('blur', () => {
    validateTeamName(true); // Full validation on blur with UI updates
  });
  
  // Team Size Selection
  elements.sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Scale bounce effect
      btn.style.transform = 'scale(0.94)';
      setTimeout(() => {
        btn.style.transform = 'scale(1.05)';
        setTimeout(() => {
          btn.style.transform = '';
        }, 100);
      }, 80);
      
      const count = parseInt(btn.dataset.size, 10);
      selectTeamSize(count, true);
    });
  });
  
  // Modal Interactions
  elements.modalCloseBtn.addEventListener('click', closeModal);
  elements.modalOverlay.addEventListener('click', (e) => {
    if (e.target === elements.modalOverlay) {
      closeModal();
    }
  });
  
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && elements.modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });
  
  // Modal Field Blur Validation
  elements.modalNameInput.addEventListener('blur', () => validateModalField('name'));
  elements.modalCollegeInput.addEventListener('blur', () => validateModalField('college'));
  elements.modalPhoneInput.addEventListener('blur', () => validateModalField('phone'));
  elements.modalEmailInput.addEventListener('blur', () => validateModalField('email'));
  
  elements.modalNameInput.addEventListener('input', () => validateModalField('name', false));
  elements.modalCollegeInput.addEventListener('input', () => validateModalField('college', false));
  elements.modalPhoneInput.addEventListener('input', () => validateModalField('phone', false));
  elements.modalEmailInput.addEventListener('input', () => validateModalField('email', false));
  
  // Modal Save Changes
  elements.modalSaveBtn.addEventListener('click', saveModalData);
  
  // Form Submit
  elements.submitBtn.addEventListener('click', submitRegistration);
}

/* ==========================================
   3. FORM VALIDATION LOGIC
   ========================================== */

// Regex definitions
const PHONE_REGEX = /^[6-9]\d{9}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function validateTeamName(showUI = true) {
  const val = elements.teamNameInput.value.trim();
  formState.teamName = val;
  
  if (val.length === 0) {
    if (showUI) {
      showInputError(elements.teamNameInput, elements.teamNameError, elements.teamNameStatus, "Team name is required");
    }
    return false;
  }
  
  if (val.length < 3 || val.length > 30) {
    if (showUI) {
      showInputError(elements.teamNameInput, elements.teamNameError, elements.teamNameStatus, "Must be between 3 and 30 characters");
    }
    return false;
  }
  
  showInputSuccess(elements.teamNameInput, elements.teamNameError, elements.teamNameStatus);
  return true;
}

function validateModalField(field, showUI = true) {
  let val, input, errEl;
  
  if (field === 'name') {
    input = elements.modalNameInput;
    errEl = elements.modalNameError;
    val = input.value.trim();
    
    if (val.length < 2) {
      if (showUI) showInputError(input, errEl, null, "Name must be at least 2 characters");
      return false;
    }
    if (/\d/.test(val)) {
      if (showUI) showInputError(input, errEl, null, "Name cannot contain numbers");
      return false;
    }
  } else if (field === 'college') {
    input = elements.modalCollegeInput;
    errEl = elements.modalCollegeError;
    val = input.value.trim();
    
    if (val.length < 3) {
      if (showUI) showInputError(input, errEl, null, "College name must be at least 3 characters");
      return false;
    }
  } else if (field === 'phone') {
    input = elements.modalPhoneInput;
    errEl = elements.modalPhoneError;
    val = input.value.trim();
    
    if (!PHONE_REGEX.test(val)) {
      if (showUI) showInputError(input, errEl, null, "⚠ Enter valid 10-digit mobile number");
      return false;
    }
  } else if (field === 'email') {
    input = elements.modalEmailInput;
    errEl = elements.modalEmailError;
    val = input.value.trim();
    
    if (!EMAIL_REGEX.test(val)) {
      if (showUI) showInputError(input, errEl, null, "⚠ Enter a valid email address");
      return false;
    }
  }
  
  showInputSuccess(input, errEl, null, field === 'phone' ? "✓ Valid number" : (field === 'email' ? "✓ Valid email" : ""));
  return true;
}

function showInputError(input, errorEl, statusIcon, message) {
  input.classList.remove('valid');
  input.classList.add('invalid');
  
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.remove('success');
    errorEl.classList.add('error');
    errorEl.classList.add('visible');
  }
  
  if (statusIcon) {
    statusIcon.innerHTML = `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#ff5050" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
    `;
    statusIcon.classList.add('visible');
  }
}

function showInputSuccess(input, errorEl, statusIcon, message = "") {
  input.classList.remove('invalid');
  input.classList.add('valid');
  
  if (errorEl) {
    if (message) {
      errorEl.textContent = message;
      errorEl.classList.remove('error');
      errorEl.classList.add('success');
      errorEl.classList.add('visible');
    } else {
      errorEl.classList.remove('visible');
      errorEl.textContent = "";
    }
  }
  
  if (statusIcon) {
    statusIcon.innerHTML = `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#39ff14" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;
    statusIcon.classList.add('visible');
  }
}

function triggerShakeEffect(element) {
  element.classList.add('shake');
  setTimeout(() => {
    element.classList.remove('shake');
  }, 400);
}

/* ==========================================
   4. MODAL MANAGEMENT
   ========================================== */
function openConfigModal(target) {
  activeModalTarget = target;
  
  // Set modal headers
  if (target === 'leader') {
    elements.modalTitle.textContent = "Team Leader Details";
    elements.modalSubtitle.textContent = "> fill in your credentials";
    populateModalFields(formState.leader);
  } else {
    const idx = parseInt(target.replace('member_', ''), 10);
    elements.modalTitle.textContent = `Member ${idx + 1} Details`;
    elements.modalSubtitle.textContent = `> configure developer_${idx + 1} node`;
    populateModalFields(formState.members[idx]);
  }
  
  // Open modal using GSAP for premium transition
  if (window.gsap) {
    elements.modalOverlay.classList.add('open');
    gsap.killTweensOf([elements.modalOverlay, elements.modalPanel]);
    gsap.fromTo(elements.modalOverlay, { opacity: 0 }, { duration: 0.25, opacity: 1 });
    gsap.fromTo(elements.modalPanel, { scale: 0.92, opacity: 0 }, { duration: 0.3, scale: 1, opacity: 1, ease: "back.out(1.4)" });
  } else {
    elements.modalOverlay.classList.add('open');
  }
}

function populateModalFields(data) {
  // Clear modal validation states
  const fields = [elements.modalNameInput, elements.modalCollegeInput, elements.modalPhoneInput, elements.modalEmailInput];
  const errors = [elements.modalNameError, elements.modalCollegeError, elements.modalPhoneError, elements.modalEmailError];
  
  fields.forEach(f => {
    f.value = "";
    f.classList.remove('valid', 'invalid');
  });
  
  errors.forEach(e => {
    e.classList.remove('visible');
    e.textContent = "";
  });
  
  // Populate values
  if (data) {
    elements.modalNameInput.value = data.name || "";
    elements.modalCollegeInput.value = data.college || "";
    elements.modalPhoneInput.value = data.mobile || "";
    elements.modalEmailInput.value = data.email || "";
    
    // Re-validate silently to show valid states
    validateModalField('name', false);
    validateModalField('college', false);
    validateModalField('phone', false);
    validateModalField('email', false);
  }
}

function closeModal() {
  if (window.gsap) {
    gsap.to(elements.modalOverlay, { 
      duration: 0.2, 
      opacity: 0, 
      onComplete: () => {
        elements.modalOverlay.classList.remove('open');
        activeModalTarget = null;
      }
    });
    gsap.to(elements.modalPanel, { duration: 0.2, scale: 0.92, opacity: 0 });
  } else {
    elements.modalOverlay.classList.remove('open');
    activeModalTarget = null;
  }
}

function saveModalData() {
  // Validate all fields
  const isNameValid = validateModalField('name', true);
  const isCollegeValid = validateModalField('college', true);
  const isPhoneValid = validateModalField('phone', true);
  const isEmailValid = validateModalField('email', true);
  
  if (!isNameValid || !isCollegeValid || !isPhoneValid || !isEmailValid) {
    // Shake the modal panel to indicate errors
    triggerShakeEffect(elements.modalPanel);
    return;
  }
  
  const savedData = {
    name: elements.modalNameInput.value.trim(),
    college: elements.modalCollegeInput.value.trim(),
    mobile: elements.modalPhoneInput.value.trim(),
    email: elements.modalEmailInput.value.trim()
  };
  
  // Show saving feedback animation
  const prevBtnText = elements.modalSaveBtn.innerHTML;
  elements.modalSaveBtn.disabled = true;
  elements.modalSaveBtn.innerHTML = `&gt; saving...`;
  
  setTimeout(() => {
    elements.modalSaveBtn.innerHTML = `✓ Saved`;
    
    // Apply data to state
    if (activeModalTarget === 'leader') {
      formState.leader = savedData;
      updateLeaderButtonUI();
    } else {
      const idx = parseInt(activeModalTarget.replace('member_', ''), 10);
      formState.members[idx] = savedData;
      updateMemberButtonUI(idx);
    }
    
    setTimeout(() => {
      elements.modalSaveBtn.disabled = false;
      elements.modalSaveBtn.innerHTML = prevBtnText;
      closeModal();
      
      // Immediate autosave
      saveSession(true);
      evaluateFormStatus();
    }, 200);
  }, 400);
}

/* ==========================================
   5. DYNAMIC TEAM SIZE & MEMBER BUTTONS
   ========================================== */
function selectTeamSize(size, triggerSave = false) {
  if (formState.memberCount === size) return;
  
  formState.memberCount = size;
  
  // Update button highlights
  elements.sizeBtns.forEach(btn => {
    if (parseInt(btn.dataset.size, 10) === size) {
      btn.classList.add('selected');
    } else {
      btn.classList.remove('selected');
    }
  });
  
  // Sync the members array size
  syncMembersArray(size);
  
  // Re-render member configuration buttons
  renderMemberButtons();
  
  if (triggerSave) {
    saveSession(true);
  }
  evaluateFormStatus();
}

function syncMembersArray(size) {
  // If array is larger, truncate. If smaller, pad with null/empty configs
  const extraMembersCount = Math.max(0, size - 1);
  if (formState.members.length > extraMembersCount) {
    formState.members = formState.members.slice(0, extraMembersCount);
  } else {
    while (formState.members.length < extraMembersCount) {
      formState.members.push(null);
    }
  }
}

function renderMemberButtons() {
  elements.membersList.innerHTML = "";
  
  if (!formState.memberCount) return;
  
  // 1. Render Team Leader Button (Always first in the dynamic list)
  const leaderBtn = document.createElement('button');
  leaderBtn.type = "button";
  leaderBtn.className = "config-button";
  leaderBtn.id = "leader-config-btn";
  
  leaderBtn.innerHTML = `
    <div class="config-btn-left">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
      <span id="leader-btn-label">[ + Configure Team Leader ]</span>
    </div>
    <div class="config-btn-right" id="leader-btn-status">&gt; click to expand</div>
  `;
  
  leaderBtn.addEventListener('click', () => {
    openConfigModal('leader');
  });
  
  elements.membersList.appendChild(leaderBtn);
  updateLeaderButtonUI();
  
  // 2. Render Member Buttons (Member 1 to Member N-1)
  for (let i = 0; i < formState.memberCount - 1; i++) {
    const btnId = `member-btn-${i}`;
    const btn = document.createElement('button');
    btn.type = "button";
    btn.className = "config-button";
    btn.id = btnId;
    btn.style.marginTop = "16px";
    
    btn.innerHTML = `
      <div class="config-btn-left">
        <svg viewBox="0 0 24 24">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span id="member-btn-label-${i}">[ + Configure Member ${i + 1} ]</span>
      </div>
      <div class="config-btn-right" id="member-btn-right-${i}">&gt; click to expand</div>
    `;
    
    btn.addEventListener('click', () => {
      openConfigModal(`member_${i}`);
    });
    
    elements.membersList.appendChild(btn);
    
    // If we have saved data for this member, update the button UI
    if (formState.members[i]) {
      updateMemberButtonUI(i);
    }
  }
}

function updateLeaderButtonUI() {
  const btn = document.getElementById('leader-config-btn');
  const label = document.getElementById('leader-btn-label');
  const right = document.getElementById('leader-btn-status');
  
  if (!btn || !label || !right) return;
  
  if (formState.leader) {
    btn.classList.add('configured');
    label.innerHTML = `<span class="config-status-dot"></span> ✓ Leader Configured`;
    
    const summary = `@${formState.leader.name.toLowerCase().replace(/\s+/g, '')} — ${formState.leader.college} — ${formState.leader.mobile}`;
    right.className = "config-summary";
    right.textContent = summary;
  } else {
    btn.classList.remove('configured');
    label.innerHTML = `[ + Configure Team Leader ]`;
    right.className = "config-btn-right";
    right.textContent = `> click to expand`;
  }
}

function updateMemberButtonUI(idx) {
  const btn = document.getElementById(`member-btn-${idx}`);
  const label = document.getElementById(`member-btn-label-${idx}`);
  const right = document.getElementById(`member-btn-right-${idx}`);
  
  if (!btn || !formState.members[idx]) return;
  
  btn.classList.add('configured');
  label.innerHTML = `<span class="config-status-dot"></span> ✓ Member ${idx + 1} Configured`;
  
  const summary = `@${formState.members[idx].name.toLowerCase().replace(/\s+/g, '')} — ${formState.members[idx].college}`;
  right.className = "config-summary";
  right.textContent = summary;
}

/* ==========================================
   6. LOCAL STORAGE - AUTOSAVE SYSTEM
   ========================================== */
let saveTimeout = null;

function debounceSave() {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveSession(false); // Trigger visual feedback for debounced team name typing
  }, 800);
}

function saveSession(isImmediate = false) {
  formState.lastSaved = Date.now();
  localStorage.setItem('devlinkhub_hackathon_reg', JSON.stringify(formState));
  
  // Visual feedback: pulse the autosave badge
  elements.autosaveBadge.classList.add('saved');
  elements.autosaveBadge.innerHTML = `⚡ Saved`;
  
  setTimeout(() => {
    elements.autosaveBadge.classList.remove('saved');
    elements.autosaveBadge.innerHTML = `⚡ Autosave ON`;
  }, 1000);
}

function restoreSession() {
  const raw = localStorage.getItem('devlinkhub_hackathon_reg');
  if (!raw) {
    // If no session found, default to memberCount: 1 to look initialized
    selectTeamSize(1, false);
    return;
  }
  
  try {
    const saved = JSON.parse(raw);
    if (!saved) return;
    
    // Restore Team Name
    if (saved.teamName) {
      elements.teamNameInput.value = saved.teamName;
      elements.charCount.textContent = `${saved.teamName.length}/30`;
      validateTeamName(true);
    }
    
    // Restore leader
    if (saved.leader) {
      formState.leader = saved.leader;
      updateLeaderButtonUI();
    }
    
    // Restore member count & members
    if (saved.memberCount) {
      formState.memberCount = saved.memberCount;
      formState.members = saved.members || [];
      
      // Update highlights and render member buttons
      elements.sizeBtns.forEach(btn => {
        if (parseInt(btn.dataset.size, 10) === saved.memberCount) {
          btn.classList.add('selected');
        } else {
          btn.classList.remove('selected');
        }
      });
      
      renderMemberButtons();
    } else {
      selectTeamSize(1, false);
    }
    
    evaluateFormStatus();
    
    // Slide in Toast Notification
    showToast("⚡ Previous session restored — your details are back");
    
  } catch (err) {
    console.error("Error restoring session: ", err);
    selectTeamSize(1, false);
  }
}

function showToast(message) {
  elements.toastText.textContent = message;
  elements.toast.classList.add('visible');
  
  setTimeout(() => {
    elements.toast.classList.remove('visible');
  }, 4000);
}

/* ==========================================
   7. FORM STATE EVALUATION & SUBMIT
   ========================================== */
function evaluateFormStatus() {
  const isTeamNameValid = validateTeamName(false);
  const isLeaderValid = formState.leader !== null;
  
  // Check if all members in the current count are fully configured
  let allMembersValid = true;
  if (!formState.memberCount) {
    allMembersValid = false;
  } else {
    const extraCount = formState.memberCount - 1;
    for (let i = 0; i < extraCount; i++) {
      if (!formState.members[i]) {
        allMembersValid = false;
        break;
      }
    }
  }
  
  const isReady = isTeamNameValid && isLeaderValid && allMembersValid;
  
  if (isReady) {
    // Show summary pill
    const countText = formState.memberCount === 1 ? '1 member' : `${formState.memberCount} members`;
    elements.summaryText.textContent = `> team: ${formState.teamName} — leader: ${formState.leader.name} — members: ${countText} — status: READY`;
    elements.summaryPill.style.display = 'flex';
    
    // Enable submit
    elements.submitBtn.classList.remove('disabled');
    elements.submitBtn.classList.add('active');
    elements.submitBtn.innerHTML = `⚡ Submit Registration →`;
    elements.submitBtn.style.pointerEvents = 'auto';
  } else {
    // Hide summary pill
    elements.summaryPill.style.display = 'none';
    
    // Disable submit
    elements.submitBtn.classList.add('disabled');
    elements.submitBtn.classList.remove('active');
    elements.submitBtn.innerHTML = `&gt; complete all details to proceed`;
    elements.submitBtn.style.pointerEvents = 'none';
  }
}

function submitRegistration() {
  // Double-check validations
  const isTeamNameValid = validateTeamName(true);
  const isLeaderValid = formState.leader !== null;
  
  let allMembersValid = true;
  const extraCount = formState.memberCount - 1;
  for (let i = 0; i < extraCount; i++) {
    if (!formState.members[i]) {
      allMembersValid = false;
      break;
    }
  }
  
  if (!isTeamNameValid || !isLeaderValid || !allMembersValid) {
    triggerShakeEffect(elements.mainCard);
    return;
  }
  
  // Submit successful!
  // Clear localStorage
  localStorage.removeItem('devlinkhub_hackathon_reg');
  
  // Animate success screen using GSAP for a wow factor
  if (window.gsap) {
    elements.successOverlay.style.display = 'flex';
    gsap.fromTo(elements.successOverlay, { opacity: 0 }, { duration: 0.4, opacity: 1 });
    gsap.fromTo(elements.successOverlay.querySelector('.success-card'), 
      { scale: 0.8, opacity: 0 }, 
      { duration: 0.6, scale: 1, opacity: 1, ease: "back.out(1.2)", delay: 0.1 }
    );
  } else {
    elements.successOverlay.style.display = 'flex';
  }
  
  // Setup restart button in success overlay
  document.getElementById('restart-btn').addEventListener('click', () => {
    location.reload();
  });
}

/* ==========================================
   8. ENHANCED PAGE ENTRY ANIMATIONS (GSAP)
   ========================================== */
function triggerPageLoadAnimations() {
  if (!window.gsap) return;
  
  // Set starting positions
  gsap.set(elements.navbar, { opacity: 0, y: -20 });
  gsap.set(elements.mainCard, { opacity: 0, y: 40, scale: 0.97 });
  gsap.set(elements.formGroups, { opacity: 0, y: 20 });
  
  // Timeline
  const tl = gsap.timeline({ delay: 0.2 });
  
  tl.to(elements.navbar, { duration: 0.6, opacity: 1, y: 0, ease: "power2.out" })
    .to(elements.mainCard, { duration: 0.8, opacity: 1, y: 0, scale: 1, ease: "power3.out" }, "-=0.3")
    .to(elements.formGroups, { duration: 0.5, opacity: 1, y: 0, stagger: 0.08, ease: "power2.out" }, "-=0.5");
}
