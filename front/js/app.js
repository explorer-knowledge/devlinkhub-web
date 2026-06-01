/* 
=========================================
  DEVLINKHUB — INTERACTIVE CORE CONTROLLER
  PATH: front/js/app.js
=========================================
*/

// Wait until DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  initGlobalUtilities();
  initTiltCards();
  initStatsIntersectionObserver();
  initGSAPAnimations();
  initLiquidDisplacement();
  initInteractiveJSONForm();
  initParticlesBackground();
});

/* --- tsParticles Dependency Graph Network --- */
function initParticlesBackground() {
  if (typeof tsParticles === 'undefined') return;
  tsParticles.load("particles-js", {
    fpsLimit: 60,
    particles: {
      number: { value: 65, limit: 120 },
      color: { value: "#00f5ff" },
      shape: { type: "circle" },
      opacity: {
        value: 0.35,
        random: true,
        anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false }
      },
      size: {
        value: 3,
        random: true,
        anim: { enable: true, speed: 2, size_min: 1, sync: false }
      },
      links: {
        enable: true,
        distance: 140,
        color: "#7c3aed",
        opacity: 0.22,
        width: 1
      },
      move: {
        enable: true,
        speed: 1.2,
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
        grab: { distance: 160, links: { opacity: 0.45 } },
        push: { quantity: 3 }
      }
    },
    retina_detect: true
  });
}


/* --- Navbar Scroll Behavior & Navigation Links --- */
function initGlobalUtilities() {
  const nav = document.querySelector('nav.frosted-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // Mobile navigation drawer toggles
  const ham = document.querySelector('.hamburger');
  const panel = document.querySelector('.mobile-nav-panel');
  const close = document.querySelector('.close-mobile');
  
  if (ham && panel) {
    ham.addEventListener('click', () => panel.classList.add('open'));
    if (close) close.addEventListener('click', () => panel.classList.remove('open'));
    panel.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => panel.classList.remove('open'));
    });
  }
}

/* --- 3D Depth Card Tilt Effect --- */
function initTiltCards() {
  document.querySelectorAll('.glass-panel').forEach(card => {
    // Generate spotlight container element inside card
    const radial = document.createElement('div');
    radial.className = 'spotlight-radial';
    card.appendChild(radial);

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate tilt percentages
      const tiltX = -((y - rect.height / 2) / (rect.height / 2)) * 6; // max 6 degrees
      const tiltY = ((x - rect.width / 2) / (rect.width / 2)) * 6;

      // Update transform matrix
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-5px)`;
      
      // Update spotlight radial glow
      radial.style.background = `radial-gradient(400px circle at ${x}px ${y}px, rgba(0, 245, 255, 0.08) 0%, rgba(255, 255, 255, 0.01) 70%, transparent 100%)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
      radial.style.background = '';
    });
  });
}

/* --- Staggered Counters Count-Up on Scroll --- */
function initStatsIntersectionObserver() {
  const elements = document.querySelectorAll('.stat-num');
  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        animateValue(el, 0, target, 2000);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => obs.observe(el));
}

function animateValue(obj, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    obj.innerHTML = Math.floor(progress * (end - start) + start) + '+';
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

/* --- Liquid/Water Flow Animation Displacement Maps --- */
function initLiquidDisplacement() {
  // We'll target our feTurbulence values inside SVG filters to morph parameters
  const turb = document.querySelector('#liquid-turbulence');
  const turbRes = document.querySelector('#liquid-turbulence-res');
  
  if (turb) {
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(turb, {
      duration: 15,
      attr: { baseFrequency: '0.01 0.09' },
      ease: 'sine.inOut'
    }).to(turb, {
      duration: 15,
      attr: { baseFrequency: '0.03 0.04' },
      ease: 'sine.inOut'
    });
  }

  if (turbRes) {
    const tlRes = gsap.timeline({ repeat: -1, yoyo: true });
    tlRes.to(turbRes, {
      duration: 12,
      attr: { baseFrequency: '0.02 0.08' },
      ease: 'sine.inOut'
    }).to(turbRes, {
      duration: 12,
      attr: { baseFrequency: '0.04 0.03' },
      ease: 'sine.inOut'
    });
  }
}

/* --- High Performance GSAP Timelines & Staggers --- */
function initGSAPAnimations() {
  if (typeof gsap === 'undefined') return;

  // Staggered Entrance of Hero Titles
  const heroTL = gsap.timeline();
  heroTL.from('.hero-badge', { opacity: 0, y: -20, duration: 0.8, ease: 'power3.out' })
        .from('.hero-title span', { opacity: 0, y: 50, stagger: 0.15, duration: 1, ease: 'power4.out' }, '-=0.5')
        .from('.hero-sub', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }, '-=0.6')
        .from('.hero-btns', { opacity: 0, y: 15, duration: 0.8, ease: 'power3.out' }, '-=0.6')
        .from('.notif-card', { opacity: 0, scale: 0.9, stagger: 0.12, duration: 0.8, ease: 'back.out(1.7)' }, '-=0.4');

  // Sticky Split Screen Steps Observer and Terminal Panel Triggers
  const steps = document.querySelectorAll('.split-step');
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.6
  };

  const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const index = entry.target.getAttribute('data-step');
        // Reset all steps active status
        document.querySelectorAll('.split-step-num').forEach(el => el.style.color = 'rgba(255,255,255,0.08)');
        // Active number highlight in electric cyan
        entry.target.querySelector('.split-step-num').style.color = 'var(--cyan)';
        
        // Stagger terminal panels display
        document.querySelectorAll('.split-terminal').forEach(panel => panel.style.opacity = '0.3');
        const activePanel = document.querySelector(`.split-terminal[data-step="${index}"]`);
        if (activePanel) activePanel.style.opacity = '1';
      }
    });
  }, observerOptions);

  steps.forEach(step => stepObserver.observe(step));

  // Stagger reveal of cards on scroll
  gsap.utils.toArray('.bento-pillars-grid .glass-panel').forEach(card => {
    gsap.from(card, {
      opacity: 0, y: 40, duration: 0.8, ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  gsap.utils.toArray('.events-masonry .glass-panel').forEach(card => {
    gsap.from(card, {
      opacity: 0, y: 50, scale: 0.96, duration: 0.9, ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    });
  });

  gsap.utils.toArray('.scattered-hub-grid .glass-panel').forEach(card => {
    gsap.from(card, {
      opacity: 0, y: 60, scale: 0.92, duration: 0.8, ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    });
  });
}

/* --- Interactive JSON Registration Form Compiler Mock --- */
function initInteractiveJSONForm() {
  const nameInput = document.getElementById('reg-name');
  const emailInput = document.getElementById('reg-email');
  const stackInput = document.getElementById('reg-stack');
  const formTrigger = document.getElementById('reg-submit-btn');

  if (formTrigger) {
    formTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      
      const payload = {
        name: nameInput.value.trim() || 'Anonymous Developer',
        email: emailInput.value.trim() || 'email@devlinkhub.org',
        stack: stackInput.value.trim() || 'Fullstack'
      };

      // Interactive feedback
      formTrigger.disabled = true;
      formTrigger.innerHTML = '⚡ Initiating Compiler...';
      
      setTimeout(() => {
        formTrigger.innerHTML = '🧪 Matching Profiles...';
        setTimeout(() => {
          formTrigger.innerHTML = '✓ Successfully Staged!';
          formTrigger.style.background = 'rgba(57, 255, 20, 0.1)';
          formTrigger.style.borderColor = 'var(--neon-green)';
          formTrigger.style.color = 'var(--neon-green)';
          formTrigger.style.boxShadow = '0 0 20px rgba(57, 255, 20, 0.3)';
          
          alert(`Payload Verified!\n\nWelcome to DevLinkHub, ${payload.name}. Your details have been staged on our local server.`);
        }, 1200);
      }, 1000);
    });
  }
}

/* --- Interactive Modals & Centralized Code Viewers --- */
function openCodeModal(resourceTitle, codeContent) {
  const modal = document.getElementById('central-modal');
  const title = document.getElementById('modal-title-span');
  const display = document.getElementById('modal-code-display');
  
  if (modal && title && display) {
    title.textContent = resourceTitle;
    display.textContent = codeContent;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeCodeModal() {
  const modal = document.getElementById('central-modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* --- Typewriter Code Tab Changer --- */
function selectCodeLanguage(lang) {
  const tabs = document.querySelectorAll('.code-tab-trigger');
  tabs.forEach(tab => tab.classList.remove('active'));
  
  const selectedTab = document.querySelector(`.code-tab-trigger[data-lang="${lang}"]`);
  if (selectedTab) selectedTab.classList.add('active');

  const contentBox = document.getElementById('playground-code-render');
  if (!contentBox) return;

  const codes = {
    js: `// DevLinkHub SDK setup\nimport { DevLinkHub } from '@devlinkhub/core';\n\nconst hub = new DevLinkHub({\n  token: process.env.DLH_SECRET,\n  guild: 'FrontendArchitects'\n});\n\nhub.on('ship', (project) => {\n  console.log(\`🚀 Project shipped: \${project.name}\`);\n});`,
    python: `# DevLinkHub Python SDK\nfrom devlinkhub import DevLinkHub\n\nhub = DevLinkHub(\n    token="DLH_SECRET",\n    guild_id="systems_rust"\n)\n\n@hub.on_event("pr_merge")\ndef handle_merge(pr):\n    print(f"🔥 Code merged by {pr.author}")`,
    rust: `// DevLinkHub Rust Integration\nuse devlinkhub::Client;\n\n#[tokio::main]\nasync fn main() -> Result<(), Box<dyn std::error::Error>> {\n    let client = Client::new("DLH_SECRET")?;\n    let stats = client.get_guild_stats("genai_agents").await?;\n    println!("Active Builders: {}", stats.active);\n    Ok(())\n}`,
    go: `// DevLinkHub Go REST client\npackage main\n\nimport (\n\t"fmt"\n\t"github.com/devlinkhub/go-sdk"\n)\n\nfunc main() {\n\tclient := sdk.NewClient("DLH_SECRET")\n\tproject, _ := client.GetLatestProject("devops_cloud")\n\tfmt.Printf("✓ Latest release: %s\\n", project.Version)\n}`
  };

  contentBox.textContent = codes[lang] || codes['js'];
}
