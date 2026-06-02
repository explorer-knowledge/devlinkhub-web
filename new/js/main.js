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
  initHeroTerminalOriginal();
});

/* --- Interactive Code Modals & Resource Mappings --- */
const resourceCodes = {
  dsa: {
    title: "DSA Cheat Roadmap",
    code: `// DSA staged cheatsheet\nimport { Graph } from '@devlinkhub/dsa';\n\nconst graph = new Graph();\ngraph.addNode('A');\ngraph.addNode('B');\ngraph.addEdge('A', 'B');\nconsole.log(graph.hasPath('A', 'B')); // true`
  },
  system_design: {
    title: "System Design Core Model",
    code: `# Systems Architecture models\n- High availability database replication patterns\n- Distributed Redis caching staging strategies\n- Horizontal microservices cluster scaling protocols`
  },
  frontend: {
    title: "Frontend Dev Setup",
    code: `// Frontend architectural starter\nnpx create-next-app@latest my-starter --ts --tailwind\ncd my-starter\nnpm install @devlinkhub/core`
  },
  backend: {
    title: "Backend REST API Seed",
    code: `// Go REST API Gin boilerplate\npackage main\nimport "github.com/gin-gonic/gin"\n\nfunc main() {\n  r := gin.Default()\n  r.GET("/api/health", func(c *gin.Context) {\n    c.JSON(200, gin.H{"status": "operational"})\n  })\n  r.Run(":8080")\n}`
  },
  devops: {
    title: "DevOps Compose Presets",
    code: `# Multi-container orchestrators\nversion: '3.8'\nservices:\n  web:\n    image: devlinkhub/node-staging:latest\n    ports:\n      - "3000:3000"\n  db:\n    image: postgres:15\n    environment:\n      POSTGRES_DB: staging_pool`
  },
  open_source: {
    title: "Open Source Sync Pipelines",
    code: `# Git workflows\n- Cloned repository staging configurations\n- Setup upstream active trackers\n- Staged code lints prior to pull requests`
  },
  interview: {
    title: "Interview Prep Cheat Roadmap",
    code: `# Technical interview models\n- Staged time/space complexity analysis guidelines\n- Basic algorithmic patterns (sliding window, graph traversal)\n- Systems scaling and sharding interviews presets`
  },
  ai_ml: {
    title: "AI & Machine Learning Agent Core",
    code: `// LangChain LLM integration setup\nimport { LLMChain } from '@devlinkhub/agents';\n\nconst agent = new LLMChain({ model: 'gemini-pro' });\nconst response = await agent.dispatch('initialize community');`
  }
};

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

  // Bind click trigger for all resource tile elements
  document.querySelectorAll('.resource-tile-card').forEach(tile => {
    tile.addEventListener('click', () => {
      const key = tile.getAttribute('data-code-key');
      if (key && resourceCodes[key]) {
        window.openCodeModal(resourceCodes[key].title, resourceCodes[key].code);
      }
    });
  });
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

/* --- Persistent Terminal Activity Simulator & Swapper --- */
let activeCommunityLogs = [];
let isHackathonCliActive = false;

function initTerminalActivity() {
  const terminal = document.querySelector('.persistent-terminal');
  const terminalHeader = document.querySelector('.terminal-window-header');
  const minimizeBtn = document.querySelector('.terminal-minimize-btn');
  const consoleDisplay = document.getElementById('terminal-console-render');
  const heroMainCli = document.getElementById('hero-main-cli');

  const footerBtn = document.getElementById('hero-footer-register-btn');
  if (footerBtn) {
    footerBtn.addEventListener('click', () => {
      window.location.href = 'register.html';
    });
  }

  // Minimize Toggle
  if (terminalHeader) {
    terminalHeader.addEventListener('click', (e) => {
      // Don't trigger minimize if clicking close/dots, or swap trigger
      if (e.target.closest('.t-dot') || e.target.closest('.terminal-minimize-btn')) return;
      terminal.classList.toggle('minimized');
      if (terminal.classList.contains('minimized')) {
        minimizeBtn.innerHTML = '&#9652;';
      } else {
        minimizeBtn.innerHTML = '&#9662;';
      }
    });
    
    // Minimize button explicit click
    if (minimizeBtn) {
      minimizeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        terminal.classList.toggle('minimized');
        minimizeBtn.innerHTML = terminal.classList.contains('minimized') ? '&#9652;' : '&#9662;';
      });
    }
  }

  // Click on small CLI to swap it with the main large CLI with macOS transition
  if (terminal) {
    terminal.addEventListener('click', (e) => {
      // Don't trigger if user clicked minimize button directly
      if (e.target.closest('.terminal-minimize-btn')) return;
      
      const isAlreadyAtTop = window.scrollY < 20;

      function runFlightTransition() {
        // Get bounding boxes for the macOS-style grow animation after viewport settles
        const smallRect = terminal.getBoundingClientRect();
        const largeRect = heroMainCli.getBoundingClientRect();
        
        // Create a temporary visual helper element that matches the small CLI appearance
        const helper = document.createElement('div');
        helper.style.cssText = `
          position: fixed;
          top: ${smallRect.top}px;
          left: ${smallRect.left}px;
          width: ${smallRect.width}px;
          height: ${smallRect.height}px;
          background: rgba(3, 5, 16, 0.85);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          border: 1px solid rgba(0, 245, 255, 0.35);
          box-shadow: 0 15px 50px rgba(0,0,0,0.8), 0 0 25px rgba(0, 245, 255, 0.3), var(--specular);
          border-radius: 16px;
          z-index: 99999;
          pointer-events: none;
          transform-origin: center center;
          opacity: 0.9;
          overflow: hidden;
        `;
        
        // Match header look of small CLI during animation with larger legibility
        helper.innerHTML = `
          <div style="background: rgba(255,255,255,0.03); border-bottom: 1px solid var(--glass-border); padding: 10px 16px; display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; gap: 6px;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #ff5f56;"></span>
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #ffbd2e;"></span>
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #27c93f;"></span>
            </div>
            <span class="mono" style="font-size:12px; color:var(--white-secondary); font-weight:500;">/devlinkhub/hackathon/register</span>
            <span>&#9652;</span>
          </div>
          <div style="flex: 1; padding: 1.25rem;"></div>
        `;
        document.body.appendChild(helper);
        
        // Hide the actual small CLI immediately
        terminal.classList.add('hidden-by-click');
        
        // Hide main large CLI temporarily to swap elements seamlessly
        heroMainCli.style.visibility = 'hidden';
        heroMainCli.style.opacity = '0';
        
        // macOS flying morph transition using GSAP
        gsap.to(helper, {
          top: largeRect.top,
          left: largeRect.left,
          width: largeRect.width,
          height: largeRect.height,
          borderRadius: '16px',
          opacity: 1,
          transform: 'perspective(1200px) rotateY(-8deg)',
          duration: 0.85,
          ease: 'power3.inOut',
          onComplete: () => {
            // Remove flying helper
            helper.remove();
            
            // Show Hackathon CLI content in hero
            document.getElementById('hero-cli-orig-header').style.display = 'none';
            document.getElementById('hero-terminal-original-body').style.display = 'none';
            document.getElementById('hero-cli-repl-header').style.display = 'none';
            document.getElementById('hero-terminal-replaced-body').style.display = 'none';
            
            document.getElementById('hero-cli-hack-header').style.display = 'flex';
            const hackBody = document.getElementById('hero-terminal-hackathon-body');
            hackBody.style.display = 'block';
            
            // Swap v3.0.0 Stable text with Register Now button in footer
            document.getElementById('hero-cli-footer-right').style.display = 'none';
            document.getElementById('hero-footer-register-btn').style.display = 'inline-flex';

            // Make main CLI container visible again with the new state
            heroMainCli.style.visibility = 'visible';
            heroMainCli.style.opacity = '1';
            
            // Mark active for enter key capture
            isHackathonCliActive = true;
            
            // Trigger the hackathon typing sequence inside the large CLI
            initHeroTerminalHackathon();
          }
        });
      }

      if (isAlreadyAtTop) {
        runFlightTransition();
      } else {
        // Smooth scroll to top of page first to bring main CLI into full view
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Wait exactly 800ms for scroll to fully settle, then run flight transition
        setTimeout(runFlightTransition, 800);
      }
    });
  }

  // Close replaced/hackathon CLI trigger with macOS morph shrink transition back to corner
  function restoreOriginalCli() {
    isHackathonCliActive = false;
    
    // Calculate bounding boxes for the reverse macOS flying transition
    const smallRect = terminal.getBoundingClientRect();
    const largeRect = heroMainCli.getBoundingClientRect();
    
    // Create a temporary visual helper element that matches the large card look
    const helper = document.createElement('div');
    helper.style.cssText = `
      position: fixed;
      top: ${largeRect.top}px;
      left: ${largeRect.left}px;
      width: ${largeRect.width}px;
      height: ${largeRect.height}px;
      background: rgba(3, 5, 16, 0.85);
      backdrop-filter: blur(28px);
      -webkit-backdrop-filter: blur(28px);
      border: 1px solid rgba(0, 245, 255, 0.35);
      box-shadow: 0 15px 50px rgba(0,0,0,0.8), 0 0 25px rgba(0, 245, 255, 0.3), var(--specular);
      border-radius: 16px;
      z-index: 99999;
      pointer-events: none;
      transform-origin: center center;
      opacity: 1;
      transform: perspective(1200px) rotateY(-8deg);
      overflow: hidden;
    `;
    
    helper.innerHTML = `
      <div style="background: rgba(255,255,255,0.03); border-bottom: 1px solid var(--glass-border); padding: 10px 16px; display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; gap: 6px;">
          <span style="width: 8px; height: 8px; border-radius: 50%; background: #ff5f56;"></span>
          <span style="width: 8px; height: 8px; border-radius: 50%; background: #ffbd2e;"></span>
          <span style="width: 8px; height: 8px; border-radius: 50%; background: #27c93f;"></span>
        </div>
        <span class="mono" style="font-size:12px; color:var(--white-secondary); font-weight:500;">/devlinkhub/hackathon/register</span>
        <span>&#9652;</span>
      </div>
      <div style="flex: 1; padding: 1.25rem;"></div>
    `;
    document.body.appendChild(helper);
    
    // Hide main card immediately in DOM
    heroMainCli.style.visibility = 'hidden';
    heroMainCli.style.opacity = '0';
    
    // GSAP morph shrink transition back to bottom corner
    gsap.to(helper, {
      top: smallRect.top,
      left: smallRect.left,
      width: smallRect.width,
      height: smallRect.height,
      borderRadius: '16px',
      opacity: 0.8,
      transform: 'perspective(1200px) rotateY(0deg)',
      duration: 0.8,
      ease: 'power3.inOut',
      onComplete: () => {
        // Remove flying helper
        helper.remove();
        
        // Restore original headers/bodies in hero card DOM
        document.getElementById('hero-cli-repl-header').style.display = 'none';
        document.getElementById('hero-terminal-replaced-body').style.display = 'none';
        document.getElementById('hero-cli-hack-header').style.display = 'none';
        document.getElementById('hero-terminal-hackathon-body').style.display = 'none';
        
        document.getElementById('hero-cli-orig-header').style.display = 'flex';
        document.getElementById('hero-terminal-original-body').style.display = 'block';
        
        // Restore footer elements (hide Register Now button, show v3.0.0 Stable text)
        document.getElementById('hero-cli-footer-right').style.display = 'inline-block';
        document.getElementById('hero-footer-register-btn').style.display = 'none';

        // Re-reveal main large CLI in original state
        heroMainCli.style.visibility = 'visible';
        heroMainCli.style.opacity = '1';
        
        // Re-reveal small CLI overlay in bottom corner
        terminal.classList.remove('hidden-by-click');
      }
    });
  }

  const closeDot = document.getElementById('hero-cli-close-dot');
  const closeBtn = document.getElementById('hero-cli-close-btn');
  const hackCloseDot = document.getElementById('hero-cli-hack-close-dot');
  const hackCloseBtn = document.getElementById('hero-cli-hack-close-btn');
  
  if (closeDot) closeDot.addEventListener('click', (e) => { e.stopPropagation(); restoreOriginalCli(); });
  if (closeBtn) closeBtn.addEventListener('click', (e) => { e.stopPropagation(); restoreOriginalCli(); });
  if (hackCloseDot) hackCloseDot.addEventListener('click', (e) => { e.stopPropagation(); restoreOriginalCli(); });
  if (hackCloseBtn) hackCloseBtn.addEventListener('click', (e) => { e.stopPropagation(); restoreOriginalCli(); });

  // Escape key also closes the swapped view if active
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const replHeader = document.getElementById('hero-cli-repl-header');
      const hackHeader = document.getElementById('hero-cli-hack-header');
      if (
        (replHeader && replHeader.style.display === 'flex') || 
        (hackHeader && hackHeader.style.display === 'flex') ||
        isHackathonCliActive ||
        terminal.classList.contains('hidden-by-click')
      ) {
        restoreOriginalCli();
      }
    }
  });

  if (!consoleDisplay) return;

  const logs = [
    "connecting to devlinkhub network...",
    "[████████░░] 80% loading community nodes...",
    "node_modules installed: 47 developers online",
    "git commit -m \"new hackathon registered\"",
    "ping community.devlinkhub.io — response: 2ms",
    "checking active compiler guilds...",
    "successfully synched staged repositories.",
    "connection stable. Awaiting dispatches...",
    "dev_node: 0x7c3aed active",
    "member_joined: pawan_k has entered hub",
    "compiler_guild: compiling WebAssembly build...",
    "stage_ops: dynamic routes initialized successfully"
  ];

  let logIndex = 0;

  function appendLog() {
    if (logIndex >= logs.length) {
      consoleDisplay.innerHTML = '';
      activeCommunityLogs = [];
      logIndex = 0;
    }
    const logLine = `&gt; ${logs[logIndex]}`;
    activeCommunityLogs.push(logLine);
    
    // Append to small CLI
    const div = document.createElement('div');
    div.innerHTML = logLine;
    consoleDisplay.appendChild(div);
    consoleDisplay.scrollTop = consoleDisplay.scrollHeight;
    
    // Keep blinking caret at the bottom
    const caret = document.createElement('span');
    caret.className = 'blinking-caret';
    const oldCaret = consoleDisplay.querySelector('.blinking-caret');
    if (oldCaret) oldCaret.remove();
    consoleDisplay.appendChild(caret);

    // If currently swapped into large CLI, append there too
    const replBody = document.getElementById('hero-terminal-replaced-body');
    if (replBody && replBody.style.display !== 'none') {
      renderReplacedLogs();
    }

    logIndex++;
  }

  function renderReplacedLogs() {
    const replBody = document.getElementById('hero-terminal-replaced-body');
    if (!replBody) return;
    replBody.innerHTML = activeCommunityLogs.map(log => `<div>${log}</div>`).join('') + '<span class="blinking-caret"></span>';
    replBody.scrollTop = replBody.scrollHeight;
  }

  // Stage lines one by one every 2.5 seconds, clear and loop
  appendLog();
  setInterval(appendLog, 2500);
}

// Global enter key listener to trigger register.html redirect
window.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    if (isHackathonCliActive) {
      const footerBtn = document.getElementById('hero-footer-register-btn');
      if (footerBtn && footerBtn.style.display !== 'none') {
        footerBtn.click();
      } else {
        const btn = document.getElementById('run-registration-btn');
        if (btn) btn.click();
      }
    }
  }
});

/* --- Hero Visual Hackathon Terminal Simulator --- */
function initHeroTerminalHackathon() {
  const body = document.getElementById('hero-terminal-hackathon-body');
  if (!body) return;
  body.innerHTML = ''; // reset first

  const steps = [
    { text: "admin@devlinkhub:~ $ ./devhacks.sh --info\n", delay: 700 },
    { text: "[STAGING] Loading DevHacks hackathon registry...\n", delay: 500 },
    { text: "<span style=\"color:var(--accent-pink)\">[OK]</span> Hackathon: DevHacks 2026\n", delay: 300 },
    { text: "<span style=\"color:var(--accent-pink)\">[OK]</span> Organizer: DevLinkHub Community\n", delay: 300 },
    { text: "<span style=\"color:var(--accent-pink)\">[OK]</span> Status: ACTIVE / REGISTRATION OPEN\n", delay: 300 },
    { text: "<span style=\"color:var(--accent-pink)\">[OK]</span> Tracks: AI Agents | Web3 | FinTech | High-performance Web\n", delay: 400 },
    { text: "<span style=\"color:var(--accent-pink)\">[OK]</span> Prizes: $5,000 Pool + Incubation & Mentorship\n", delay: 300 },
    { text: "<span style=\"color:var(--accent-pink)\">[OK]</span> Mode: Multiplayer (1-4 developers per team)\n", delay: 300 },
    { text: "admin@devlinkhub:~ $ \n", delay: 500 }
  ];

  let currentStep = 0;
  let printedText = "";

  function executeStep() {
    if (currentStep >= steps.length) {
      // Append the beautiful interactive Cyber Register Button after logs finish printing
      const btnWrapper = document.createElement('div');
      btnWrapper.innerHTML = `
        <button class="cyber-register-btn" id="run-registration-btn">
          Run Registration <span>⏎</span>
        </button>
      `;
      body.appendChild(btnWrapper);
      
      const btn = document.getElementById('run-registration-btn');
      if (btn) {
        btn.addEventListener('click', () => {
          window.location.href = 'register.html';
        });
      }
      return;
    }

    const step = steps[currentStep];
    printedText += step.text;
    body.innerHTML = printedText + '<span class="blinking-caret"></span>';
    body.scrollTop = body.scrollHeight;

    currentStep++;
    setTimeout(executeStep, step.delay);
  }

  executeStep();
}

/* --- Hero Visual Dynamic Linux npm / compiler loop --- */
function initHeroTerminalOriginal() {
  const body = document.getElementById('hero-terminal-original-body');
  if (!body) return;

  const steps = [
    { text: "admin@devlinkhub:~ $ npm install @devlinkhub/core\n", delay: 800 },
    { text: "[░░░░░░░░░░░░░░░░░░░░] 0% - fetching package...\n", delay: 500, overwriteLast: true },
    { text: "[████░░░░░░░░░░░░░░░░] 20% - connecting staging nodes...\n", delay: 500, overwriteLast: true },
    { text: "[████████████░░░░░░░░] 60% - installing community assets...\n", delay: 500, overwriteLast: true },
    { text: "[████████████████████] 100% - done!\n", delay: 400, overwriteLast: true },
    { text: "+ @devlinkhub/core@3.0.0\nadded 47 packages, and audited 48 packages in 2.3s\n\n", delay: 700 },
    { text: "admin@devlinkhub:~ $ npm run dev\n", delay: 800 },
    { text: "> devlinkhub@3.0.0 dev\n> vite\n\n", delay: 500 },
    { text: "  VITE v5.4.1  ready in 234 ms\n", delay: 400 },
    { text: "  ➜  Local:   <span style=\"color:var(--accent-cyan)\">http://localhost:5173/</span>\n", delay: 300 },
    { text: "  ➜  Network: use --host to expose\n", delay: 300 },
    { text: "  ➜  press h + enter to show help\n\n", delay: 4500, clearAfter: true }
  ];

  let currentStep = 0;
  let printedLines = [];

  function executeStep() {
    if (currentStep >= steps.length) {
      currentStep = 0;
    }
    const step = steps[currentStep];

    if (step.clearAfter) {
      setTimeout(() => {
        body.innerHTML = '';
        printedLines = [];
        currentStep++;
        executeStep();
      }, step.delay);
      return;
    }

    if (step.overwriteLast && printedLines.length > 0) {
      printedLines.pop();
    }

    printedLines.push(step.text);
    body.innerHTML = printedLines.join('') + '<span class="blinking-caret"></span>';
    body.scrollTop = body.scrollHeight;

    currentStep++;
    setTimeout(executeStep, step.delay);
  }

  executeStep();
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
