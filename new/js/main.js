/* 
==================================================
  DEVLINKHUB — COMPLETE DYNAMIC CONTROLLER
  PATH: new/js/main.js
==================================================
*/

document.addEventListener('DOMContentLoaded', () => {
  initUtilities();
  initWaterCanvas();
  initTiltController();
  initStatsObserver();
  initGSAPController();
  initTerminalActivity();
  initCountdownTimer();
  initResourceLoader();
  initParticlesBackground();
  initModalListeners();
});

/* --- Interactive Code Modals --- */
function initModalListeners() {
  window.openCodeModal = function(title, code) {
    const modal = document.getElementById('central-modal');
    const titleSpan = document.getElementById('modal-title-span');
    const codeDisplay = document.getElementById('modal-code-display');
    
    if (modal && titleSpan && codeDisplay) {
      titleSpan.textContent = title;
      codeDisplay.textContent = code;
      modal.style.display = 'flex';
      gsap.fromTo('.modal-card', { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.5)' });
    }
  };

  window.closeCodeModal = function() {
    gsap.to('.modal-card', {
      scale: 0.9, opacity: 0, duration: 0.3, onComplete: () => {
        const modal = document.getElementById('central-modal');
        if (modal) modal.style.display = 'none';
      }
    });
  };

  // Close when clicking outside card
  const modal = document.getElementById('central-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeCodeModal();
      }
    });
  }
}

/* --- tsParticles Network Nodes Background --- */
function initParticlesBackground() {
  if (typeof tsParticles === 'undefined') return;
  tsParticles.load("particles-js", {
    fpsLimit: 60,
    particles: {
      number: { value: 65, limit: 120 },
      color: { value: "#00f5ff" },
      shape: { type: "circle" },
      opacity: {
        value: 0.12,
        random: true,
        anim: { enable: true, speed: 0.5, opacity_min: 0.05, sync: false }
      },
      size: {
        value: 3,
        random: true,
        anim: { enable: true, speed: 1.5, size_min: 1, sync: false }
      },
      links: {
        enable: true,
        distance: 145,
        color: "#7c3aed",
        opacity: 0.16,
        width: 1
      },
      move: {
        enable: true,
        speed: 1.0,
        direction: "none",
        random: false,
        straight: false,
        outModes: { default: "out" },
        attract: { enable: false, rotateX: 600, rotateY: 1200 }
      }
    },
    interactivity: {
      detectsOn: "canvas",
      events: {
        onHover: { enable: true, mode: "grab" },
        onClick: { enable: true, mode: "push" },
        resize: true
      },
      modes: {
        grab: { distance: 160, links: { opacity: 0.35 } },
        push: { quantity: 2 }
      }
    },
    retina_detect: true
  });
}


/* --- Utilities, Scrolls, Drawer overlays --- */
function initUtilities() {
  const nav = document.querySelector('nav.frosted-navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // Mobile Drawer Toggle
  const ham = document.querySelector('.hamburger-btn');
  const drawer = document.querySelector('.mobile-drawer');
  const close = document.querySelector('.close-drawer');

  if (ham && drawer) {
    ham.addEventListener('click', () => drawer.classList.add('open'));
    if (close) close.addEventListener('click', () => drawer.classList.remove('open'));
    drawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => drawer.classList.remove('open'));
    });
  }

  // Underline Active Page Link Highlights on scroll
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.navbar-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.clientHeight;
      if (window.scrollY >= (top - 180)) {
        current = sec.getAttribute('id') || '';
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* --- Canvas Water Flow Hypnotic Sine Waves (Option A) --- */
function initWaterCanvas() {
  const canvas = document.getElementById('water-flow-mesh');
  const canvasRes = document.getElementById('water-flow-mesh-res');
  if (!canvas) return;

  function renderWaveGrid(cv) {
    const ctx = cv.getContext('2d');
    let width = cv.width = cv.parentElement.clientWidth;
    let height = cv.height = cv.parentElement.clientHeight;

    window.addEventListener('resize', () => {
      width = cv.width = cv.parentElement.clientWidth;
      height = cv.height = cv.parentElement.clientHeight;
    });

    let frame = 0;
    const spacing = 45; // Grid point spacing
    const amplitude = 12; // Wave height
    const frequency = 0.007; // Wave frequency

    function animate() {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = 'rgba(0, 245, 255, 0.12)';
      ctx.lineWidth = 1;

      // Draw horizontal displaced mesh lines
      for (let y = spacing; y < height; y += spacing) {
        ctx.beginPath();
        for (let x = 0; x <= width; x += 15) {
          const displacement = Math.sin(x * frequency + y * 0.01 + frame * 0.02) * amplitude;
          if (x === 0) {
            ctx.moveTo(x, y + displacement);
          } else {
            ctx.lineTo(x, y + displacement);
          }
        }
        ctx.stroke();
      }

      // Draw vertical displaced mesh lines
      for (let x = spacing; x < width; x += spacing) {
        ctx.beginPath();
        for (let y = 0; y <= height; y += 15) {
          const displacement = Math.sin(x * 0.01 + y * frequency + frame * 0.02) * amplitude;
          if (y === 0) {
            ctx.moveTo(x + displacement, y);
          } else {
            ctx.lineTo(x + displacement, y);
          }
        }
        ctx.stroke();
      }

      frame++;
      requestAnimationFrame(animate);
    }
    animate();
  }

  renderWaveGrid(canvas);
  if (canvasRes) renderWaveGrid(canvasRes);
}

/* --- 3D Depth Perspective Hover Tilts --- */
function initTiltController() {
  document.querySelectorAll('.glass-card').forEach(card => {
    // Inject custom spotlight container inside card
    const spotlight = document.createElement('div');
    spotlight.className = 'spotlight-glow';
    card.appendChild(spotlight);

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Rotate bounds: max 4 deg X, max 6 deg Y
      const rotateX = -((y - rect.height / 2) / (rect.height / 2)) * 4;
      const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      spotlight.style.background = `radial-gradient(350px circle at ${x}px ${y}px, rgba(0, 245, 255, 0.09) 0%, rgba(255, 255, 255, 0.01) 75%, transparent 100%)`;
    });

    card.addEventListener('mouseleave', () => {
      // Revert base transforms (featured visual retains Y rotation)
      if (card.classList.contains('hero-visual-card')) {
        card.style.transform = `perspective(1200px) rotateY(-8deg)`;
      } else {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
      }
      spotlight.style.background = '';
    });
  });
}

/* --- GSAP ScrollTrigger Animations & Staggers --- */
function initGSAPController() {
  if (typeof gsap === 'undefined') return;

  // tsParticles canvas parallax scroll logic
  gsap.to('.hero-particles-bg', {
    yPercent: 18,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  // Staggered reveal of hero section elements
  const heroTL = gsap.timeline();
  heroTL.from('.hero-eyebrow', { opacity: 0, y: -15, duration: 0.6, ease: 'power3.out' })
        .from('.hero-headline span', { opacity: 0, y: 80, stagger: 0.18, duration: 1.1, ease: 'power4.out' }, '-=0.4')
        .from('.hero-subtitle', { opacity: 0, y: 15, duration: 0.8, ease: 'power2.out' }, '-=0.5')
        .from('.hero-btns', { opacity: 0, y: 12, duration: 0.7, ease: 'power3.out' }, '-=0.5');

  // Infinite horizontal scroll strip strip-track animation
  const strip = document.querySelector('.live-strip-track');
  if (strip) {
    const w = strip.scrollWidth;
    gsap.fromTo(strip, { x: 0 }, {
      x: -w / 2,
      duration: 35,
      ease: 'none',
      repeat: -1
    });
  }

  // Staggered reveal of pillars, calendar cards
  gsap.utils.toArray('.bento-pillars-grid .glass-card').forEach(card => {
    gsap.from(card, {
      opacity: 0, y: 60, scale: 0.95, duration: 0.8, ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 82%',
        toggleActions: 'play none none none'
      }
    });
  });

  gsap.utils.toArray('.events-asym-grid .glass-card').forEach(card => {
    gsap.from(card, {
      opacity: 0, y: 80, scale: 0.96, duration: 0.9, ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Scattered resource tiles landing animation
  const tiles = gsap.utils.toArray('.resource-tiles-grid .glass-card');
  if (tiles.length > 0) {
    gsap.from(tiles, {
      opacity: 0,
      x: () => gsap.utils.random(-150, 150),
      y: () => gsap.utils.random(-120, 120),
      duration: 1,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.resource-tiles-grid',
        start: 'top 88%'
      }
    });
  }

  // Boot sequence console line highlights
  const lines = gsap.utils.toArray('.boot-line');
  if (lines.length > 0) {
    const bootTL = gsap.timeline({
      scrollTrigger: {
        trigger: '.boot-sequence-console',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    lines.forEach((line, i) => {
      bootTL.to(line, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, i * 0.4);
    });

    // Animate fake progress loader bar
    bootTL.to('.boot-pbar-fill', {
      width: '100%',
      duration: 1.5,
      ease: 'power1.inOut'
    }, '+=0.2');

    // Reveal huge CTA block scale and fade
    bootTL.to('.staged-cta-block', {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: 'back.out(1.7)'
    }, '+=0.3');
  }

  // Smooth shifting colors in the community gradient
  gsap.to('.shifting-gradient-community', {
    backgroundPosition: '100% 50%',
    duration: 18,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true
  });
}

/* --- Count-Up Stat Numbers --- */
function initStatsObserver() {
  const elements = document.querySelectorAll('.stat-number-display');
  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetValue = parseInt(el.getAttribute('data-target'), 10);
        
        let start = 0;
        const duration = 2000; // 2 seconds
        let startTime = null;

        function animate(timestamp) {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          el.innerHTML = Math.floor(progress * targetValue) + '+';
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        }
        requestAnimationFrame(animate);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(el => obs.observe(el));
}

/* --- Persistent Terminal Activity Simulator --- */
function initTerminalActivity() {
  const terminal = document.querySelector('.persistent-terminal');
  const terminalHeader = document.querySelector('.terminal-window-header');
  const minimizeBtn = document.querySelector('.terminal-minimize-btn');
  const consoleDisplay = document.getElementById('terminal-console-render');

  if (terminalHeader) {
    terminalHeader.addEventListener('click', () => {
      terminal.classList.toggle('minimized');
      if (terminal.classList.contains('minimized')) {
        minimizeBtn.innerHTML = '&#9652;'; // up arrow
      } else {
        minimizeBtn.innerHTML = '&#9662;'; // down arrow
      }
    });
  }

  if (!consoleDisplay) return;

  const logs = [
    "connecting to devlinkhub network...",
    "[████████░░] 80% loading community nodes...",
    "node_modules installed: 47 developers online",
    "git commit -m \"new hackathon registered\"",
    "ping community.devlinkhub.io — response: 2ms",
    "checking active compiler guilds...",
    "successfully synched staged repositories.",
    "connection stable. Awaiting dispatches..."
  ];

  let logIndex = 0;

  function appendLog() {
    if (logIndex >= logs.length) {
      consoleDisplay.innerHTML = '';
      logIndex = 0;
    }
    const logLine = document.createElement('div');
    logLine.innerHTML = `&gt; ${logs[logIndex]}`;
    consoleDisplay.appendChild(logLine);
    consoleDisplay.scrollTop = consoleDisplay.scrollHeight;
    logIndex++;
    
    // Blinking caret remains at the bottom
    const caret = document.createElement('span');
    caret.className = 'blinking-caret';
    const oldCaret = consoleDisplay.querySelector('.blinking-caret');
    if (oldCaret) oldCaret.remove();
    consoleDisplay.appendChild(caret);
  }

  // Stage lines one by one every 2.5 seconds, clear and loop
  appendLog();
  setInterval(appendLog, 2500);
}

/* --- Countdown Timer for Featured Event --- */
function initCountdownTimer() {
  const timerDisplay = document.getElementById('featured-event-countdown');
  if (!timerDisplay) return;

  let targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 3); // 3 days in future by default
  targetDate.setHours(targetDate.getHours() + 14);

  function updateTimer() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      timerDisplay.innerHTML = "00 : 00 : 00 : 00";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    const pad = (num) => String(num).padStart(2, '0');

    timerDisplay.innerHTML = `${pad(days)} : ${pad(hours)} : ${pad(mins)} : ${pad(secs)}`;
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* --- Staged Loading Bar for Resource Tiles on Load --- */
function initResourceLoader() {
  document.querySelectorAll('.resource-tile-card').forEach((tile, index) => {
    const mask = tile.querySelector('.tile-loading-mask');
    const fill = tile.querySelector('.tile-loader-fill');
    if (!mask || !fill) return;

    // Simulate different loading durations for authenticity
    const delay = index * 100;
    const duration = 800 + Math.random() * 800;

    setTimeout(() => {
      gsap.to(fill, {
        width: '100%',
        duration: duration / 1000,
        ease: 'power1.inOut',
        onComplete: () => {
          gsap.to(mask, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
              mask.style.display = 'none';
            }
          });
        }
      });
    }, delay);
  });
}
