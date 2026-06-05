import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import "../styles/style.css";

const ParticleBg = lazy(() => import("../components/ParticleBg"));

/* --- Tracks Data --- */
const tracks = [
  { icon: "🤖", title: "Artificial Intelligence & ML", desc: "Build intelligent systems that solve real-world challenges using cognitive nodes, vector embeddings, and LLM orchestration." },
  { icon: "🌐", title: "Web & Software Development", desc: "Create modern, highly-responsive, performance-optimized, and secure digital products and platforms." },
  { icon: "🏥", title: "HealthTech", desc: "Develop solutions that improve healthcare accessibility, diagnostic systems, patient management, and efficiency." },
  { icon: "📚", title: "EdTech", desc: "Transform educational journeys, classroom learning, and shared resource archives through engaging tech." },
  { icon: "💰", title: "FinTech", desc: "Build tools that simplify transactions, secure payment gateways, and improve regional financial accessibility." },
  { icon: "💡", title: "Open Innovation", desc: "Got a unique idea? Bring any impactful, high-performance technology concept to life on our open stage." }
];

/* --- Schedule Data --- */
const day1Schedule = [
  { time: "09:00 AM", title: "Opening Session", desc: "Welcome briefing, Ignite launch keynotes, and community onboarding." },
  { time: "10:30 AM", title: "Speaker Talks", desc: "Gain insights from experienced speakers, mentors, and developers." },
  { time: "11:30 AM", title: "Technology Insights", desc: "Deep dive into modern developer tools, workflows, and production frameworks." },
  { time: "12:30 PM", title: "AI & Development Discussions", desc: "Interactive discussions covering AI tools, vector embeddings, and API integrations." },
  { time: "02:00 PM", title: "Product Building Sessions", desc: "Hands-on coding workshop building production-ready projects." },
  { time: "04:30 PM", title: "Networking Opportunities", desc: "Connect with fellow developers, professionals, and future founders." },
  { time: "05:30 PM", title: "Community Activities", desc: "Fun, community-driven interactive events and developer guilds sync." },
  { time: "06:30 PM", title: "Refreshments", desc: "Unwind with food, beverages, and casual conversations." }
];

const day2Schedule = [
  { time: "08:00 AM", title: "Hackathon Kickoff", desc: "Kickstart Day 2, prepare workspaces, and welcome the developers." },
  { time: "08:30 AM", title: "Team Building & Collaboration", desc: "Help solo participants form teams (1-4 members) and align skills." },
  { time: "09:00 AM", title: "Challenge Reveal", desc: "Release of the Auraxis Hackathon challenge themes and rules." },
  { time: "09:30 AM", title: "Building Phase", desc: "Start of the intensive building sprint. Hackathon execution commences." },
  { time: "02:00 PM", title: "Mentor Interactions", desc: "One-on-one reviews and technical guidance from industry experts." },
  { time: "04:30 PM", title: "Project Presentations", desc: "Pitch and demonstrate working solutions directly to the judges panel." },
  { time: "06:30 PM", title: "Results & Recognition", desc: "Prize announcements, participation certificates, and closing ceremony." }
];

/* --- Pricing Plans --- */
const pricingPlans = [
  {
    key: "ignite_pass",
    badge: "Official Entry Pass",
    title: "⚡ IGNITE Pass",
    price: "₹349",
    features: [
      "Access to BuildX Workshop",
      "Access to Auraxis Hackathon",
      "Official Participation Certificate",
      "Community Access Perks",
      "Networking Opportunities",
      "Mentor Interactions",
      "Refreshments & Food"
    ]
  },
  {
    key: "early_bird",
    badge: "Stay Tuned",
    title: "🚀 Early Bird Promo",
    price: "Campaigns",
    featured: true,
    features: [
      "Access to BuildX Workshop",
      "Access to Auraxis Hackathon",
      "Official Participation Certificate",
      "Community Access Perks",
      "Special Promo Benefits",
      "Food & Refreshments"
    ]
  }
];

/* --- FAQ Data --- */
const faqs = [
  { q: "Is the workshop free?", a: "Yes, full access to the BuildX workshop is included with the IGNITE registration pass." },
  { q: "Can I participate alone?", a: "Yes. Solo participation is allowed, and we support solo builders looking to form cohorts." },
  { q: "Can I create a team later?", a: "Yes. Teams can be formed or modified before the hackathon begins on Day 2." },
  { q: "What is the team size?", a: "Teams can consist of 1 to 4 members. The pass covers the entire team." },
  { q: "When will the venue be announced?", a: "The venue details will be shared soon through official DevLinkHub channels and via email." },
  { q: "When will prizes be announced?", a: "Prize pool details and challenge themes will be revealed during the kickoff on Day 2." }
];

/* --- Organizers Data --- */
const organizers = [
  { name: "Pawan Kushwaha", role: "Founder", init: "PK" },
  { name: "Prince Kumar", role: "Operation Head", init: "PR" },
  { name: "Kartik Raj", role: "Community Manager", init: "KR" },
  { name: "Ayush Kumar", role: "Community Relations Head", init: "AK" }
];

/* --- Interactive Card Spotlight Hover Tilt Wrapper --- */
function TiltGlassCard({
  children,
  className = "",
  style = {},
  onClick
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [glowStyle, setGlowStyle] = useState<React.CSSProperties>({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 768) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = -((y - rect.height / 2) / (rect.height / 2)) * 4;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 6;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    setGlowStyle({
      background: `radial-gradient(350px circle at ${x}px ${y}px, rgba(0, 245, 255, 0.09) 0%, rgba(255, 255, 255, 0.01) 75%, transparent 100%)`,
      opacity: 1
    });
  };

  const handleMouseLeave = () => {
    if (window.innerWidth < 768) return;
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
    setGlowStyle({ opacity: 0 });
  };

  return (
    <div
      ref={cardRef}
      className={`glass-card ${className}`}
      style={{ ...style, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <div className="spotlight-glow" style={glowStyle}></div>
      {children}
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();

  /* --- States --- */
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeTab, setActiveTab] = useState<"day1" | "day2">("day1");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isTerminalSwapped, setIsTerminalSwapped] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Hero Original CLI text lines state
  const [cliText, setCliText] = useState("");
  // Swapped Hackathon CLI printing steps
  const [hackathonCliText, setHackathonCliText] = useState("");
  const [hackathonCliDone, setHackathonCliDone] = useState(false);

  /* --- Canvases --- */
  const heroCanvasRef = useRef<HTMLCanvasElement>(null);

  /* --- 1. Water Canvas Sine Mesh Animations --- */
  useEffect(() => {
    if (isMobile) return; // Completely abort heavy canvas render on mobile
    const canvas = heroCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let w = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let h = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const handleResize = () => {
      if (window.innerWidth < 768) return;
      w = canvas.width = canvas.parentElement?.clientWidth || 500;
      h = canvas.height = canvas.parentElement?.clientHeight || 400;
    };
    window.addEventListener("resize", handleResize);

    const spacing = 70;
    const amplitude = 12;
    const frequency = 0.007;
    let frame = 0;
    let animId: number;

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(0, 245, 255, 0.12)";
      ctx.lineWidth = 1;

      // Horizontal lines
      for (let y = spacing; y < h; y += spacing) {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 25) {
          const disp = Math.sin(x * frequency + y * 0.01 + frame * 0.02) * amplitude;
          if (x === 0) ctx.moveTo(x, y + disp);
          else ctx.lineTo(x, y + disp);
        }
        ctx.stroke();
      }

      // Vertical lines
      for (let x = spacing; x < w; x += spacing) {
        ctx.beginPath();
        for (let y = 0; y <= h; y += 25) {
          const disp = Math.sin(x * 0.01 + y * frequency + frame * 0.02) * amplitude;
          if (y === 0) ctx.moveTo(x + disp, y);
          else ctx.lineTo(x + disp, y);
        }
        ctx.stroke();
      }

      frame++;
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  /* --- 2. Hero Original CLI (npm install loop) --- */
  useEffect(() => {
    if (isTerminalSwapped) return;

    const steps = [
      { type: "type", text: "npm install devlinkhub" },
      { type: "wait", delay: 400 },
      { type: "print", text: "\n<span style='color:var(--accent-green)'>✔</span> Building community...\n" },
      { type: "wait", delay: 300 },
      { type: "print", text: "<span style='color:var(--accent-green)'>✔</span> Connecting developers...\n" },
      { type: "wait", delay: 300 },
      { type: "print", text: "<span style='color:var(--accent-green)'>✔</span> Launching IGNITE 2026...\n" },
      { type: "wait", delay: 350 },
      { type: "print", text: "<span style='color:var(--accent-green)'>✔</span> Loading opportunities...\n" },
      { type: "wait", delay: 300 },
      { type: "print", text: "<span style='color:var(--accent-green)'>✔</span> Ready.\n\n" },
      { type: "wait", delay: 500 },
      { type: "print", text: "+ devlinkhub-ignite@2026.1.0\nadded 142 packages, and audited 143 packages in 1.8s\n\n" },
      { type: "wait", delay: 1000 },
      { type: "type", text: "npm run dev" },
      { type: "wait", delay: 400 },
      { type: "print", text: "\n\n  VITE v5.4.1  ready in 124 ms\n" },
      { type: "print", text: "  ➜  Local:   <span style='color:var(--accent-cyan)'>http://localhost:5173/</span>\n" },
      { type: "print", text: "  ➜  Network: use --host to expose\n" },
      { type: "print", text: "  ➜  press h + enter to show help\n\n" },
      { type: "wait", delay: 1500 },
      { type: "print", text: "<span style='color:var(--white-secondary)'>[Click terminal card to query details]</span>\n" },
      { type: "wait", delay: 6000 },
      { type: "clear" }
    ];

    let currentText = "admin@devlinkhub:~ $ ";
    setCliText(currentText);

    let stepIdx = 0;
    let charIdx = 0;
    let timeoutId: any;



    const execute = () => {
      if (stepIdx >= steps.length) {
        stepIdx = 0;
        charIdx = 0;
        currentText = "admin@devlinkhub:~ $ ";
        setCliText(currentText);
      }

      const step = steps[stepIdx];

      if (step.type === "type") {
        const text = step.text || "";
        if (charIdx < text.length) {
          currentText += text[charIdx];
          setCliText(currentText);
          charIdx++;
          timeoutId = setTimeout(execute, 50);
        } else {
          stepIdx++;
          charIdx = 0;
          timeoutId = setTimeout(execute, 100);
        }
      } else if (step.type === "print") {
        currentText += step.text || "";
        setCliText(currentText);
        stepIdx++;
        timeoutId = setTimeout(execute, 40);
      } else if (step.type === "wait") {
        stepIdx++;
        timeoutId = setTimeout(execute, step.delay || 0);
      } else if (step.type === "clear") {
        currentText = "admin@devlinkhub:~ $ ";
        setCliText(currentText);
        stepIdx = 0;
        charIdx = 0;
        timeoutId = setTimeout(execute, 300);
      }
    };

    timeoutId = setTimeout(execute, 500);
    return () => clearTimeout(timeoutId);
  }, [isTerminalSwapped, isMobile]);

  /* --- 3. Swapped CLI (Hackathon sequence) --- */
  useEffect(() => {
    if (!isTerminalSwapped) {
      setHackathonCliText("");
      setHackathonCliDone(false);
      return;
    }

    const steps = [
      { type: "type", text: "./ignite2026.sh --info" },
      { type: "wait", delay: 500 },
      { type: "print", text: "\n[STAGING] Loading DevLinkHub Ignite registry...\n" },
      { type: "wait", delay: 400 },
      { type: "print", text: "<span style='color:var(--accent-cyan)'>[OK]</span> Event: DevLinkHub Ignite 2026\n" },
      { type: "wait", delay: 200 },
      { type: "print", text: "<span style='color:var(--accent-cyan)'>[OK]</span> Venue: Bhopal, Madhya Pradesh (TBA)\n" },
      { type: "wait", delay: 200 },
      { type: "print", text: "<span style='color:var(--accent-cyan)'>[OK]</span> Status: REGISTRATION ACTIVE\n" },
      { type: "wait", delay: 200 },
      { type: "print", text: "<span style='color:var(--accent-cyan)'>[OK]</span> Modules: BuildX Workshop + Auraxis Hackathon\n" },
      { type: "wait", delay: 200 },
      { type: "print", text: "<span style='color:var(--accent-cyan)'>[OK]</span> Entry Model: Solo or Teams (1-4 members)\n" },
      { type: "wait", delay: 200 },
      { type: "print", text: "<span style='color:var(--accent-cyan)'>[OK]</span> Perks: Certificate | Refreshments | Mentorship\n" },
      { type: "wait", delay: 200 },
      { type: "print", text: "<span style='color:var(--accent-cyan)'>[OK]</span> Community: 500+ developers synced\n\n" },
      { type: "print", text: "admin@devlinkhub:~ $ \n" }
    ];

    let currentText = "admin@devlinkhub:~ $ ";
    setHackathonCliText(currentText);
    setHackathonCliDone(false);

    let stepIdx = 0;
    let charIdx = 0;
    let timeoutId: any;



    const execute = () => {
      if (stepIdx >= steps.length) {
        setHackathonCliDone(true);
        return;
      }

      const step = steps[stepIdx];

      if (step.type === "type") {
        const text = step.text || "";
        if (charIdx < text.length) {
          currentText += text[charIdx];
          setHackathonCliText(currentText);
          charIdx++;
          timeoutId = setTimeout(execute, 50);
        } else {
          stepIdx++;
          charIdx = 0;
          timeoutId = setTimeout(execute, 100);
        }
      } else if (step.type === "print") {
        currentText += step.text || "";
        setHackathonCliText(currentText);
        stepIdx++;
        timeoutId = setTimeout(execute, 40);
      } else if (step.type === "wait") {
        stepIdx++;
        timeoutId = setTimeout(execute, step.delay || 0);
      }
    };

    timeoutId = setTimeout(execute, 400);
    return () => clearTimeout(timeoutId);
  }, [isTerminalSwapped, isMobile]);

  /* --- 4. Global Escape key listener --- */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isTerminalSwapped) {
        setIsTerminalSwapped(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTerminalSwapped]);

  return (
    <MotionConfig reducedMotion={isMobile ? "always" : "user"}>
      {/* GLOBAL EFFECTS LAYERS (Depth Layer 0) */}
      <div className="noise-texture" aria-hidden="true"></div>
      <div className="dot-pattern" aria-hidden="true"></div>

      <div className="ambient-blob blob-cyan" style={{ top: "-10%", left: "-10%" }} aria-hidden="true"></div>
      <div className="ambient-blob blob-violet" style={{ top: "40%", right: "-10%" }} aria-hidden="true"></div>
      <div className="ambient-blob blob-green" style={{ bottom: "-10%", left: "20%" }} aria-hidden="true"></div>

      {/* SECTION 1: HERO SECTION */}
      <section className="hero-wrapper" id="home">
        {!isMobile && (
          <Suspense fallback={null}>
            <div className="hero-particles-bg" aria-hidden="true">
              <ParticleBg />
            </div>
          </Suspense>
        )}
        {!isMobile && <canvas ref={heroCanvasRef} className="hero-water-bg" aria-hidden="true"></canvas>}

        <div className="hero-inner-grid">
          <motion.div
            className="hero-text-block"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="hero-eyebrow">&gt; ignite.launch_event() ✓</span>
            <h1 className="hero-headline">
              <span>BUILD.</span>
              <span>CONNECT.</span>
              <span>GROW.</span>
            </h1>
            <p className="hero-subtitle">
              <strong>DEVLINKHUB IGNITE 2026</strong> is the first flagship developer launch event of DevLinkHub.
              Join a thriving developer community in Bhopal for two days of hands-on learning, networking, and intense innovation.
            </p>
            <div className="hero-btns" style={{ marginTop: "1rem" }}>
              <a
                href="#tracks"
                className="btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#tracks")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Explore Tracks &rarr;
              </a>
              <a
                href="#pricing"
                className="btn-secondary"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#pricing")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Register Pass
              </a>
            </div>
            <div className="hero-date-grid">
              <div>📅 20-21 June 2026</div>
              <div>👥 Team Size: 1-4 Members</div>
              <div>🎓 Open for Students &amp; Developers</div>
              <div>📍 Venue To Be Announced Soon</div>
            </div>
          </motion.div>

          {/* CLI Terminal */}
          <div className="hero-visual-block" aria-hidden="true">
            <svg style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "100%", height: "100%", zIndex: 0, opacity: 0.18, mixBlendMode: "screen", filter: "blur(20px)", pointerEvents: "none" }}>
              <defs>
                <radialGradient id="hero-blob-grad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="var(--accent-cyan)" />
                  <stop offset="65%" stopColor="var(--accent-violet)" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>
              <circle cx="50" cy="50" r="45" fill="url(#hero-blob-grad)">
                <animate attributeName="r" values="40;45;40" dur="8s" repeatCount="indefinite" />
              </circle>
            </svg>

            <motion.div
              layoutId="cli-terminal"
              transition={{ type: "spring", stiffness: 180, damping: 25 }}
              className="glass-card hero-visual-card"
              onClick={() => setIsTerminalSwapped(!isTerminalSwapped)}
              style={{
                zIndex: 10,
                cursor: "pointer",
                transform: isTerminalSwapped ? "perspective(1200px) rotateY(0deg) scale(1.02)" : "perspective(1200px) rotateY(-8deg)"
              }}
            >
              <AnimatePresence mode="wait">
                {!isTerminalSwapped ? (
                  <motion.div
                    key="original-cli"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                    style={{ display: "flex", flexDirection: "column", height: "100%", flex: 1, width: "100%" }}
                  >
                    {/* Original CLI */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--glass-border)", paddingBottom: "12px", marginBottom: "16px" }}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <span className="pulsing-dot" style={{ background: "#ff5f56", boxShadow: "none" }}></span>
                        <span className="pulsing-dot" style={{ background: "#ffbd2e", boxShadow: "none" }}></span>
                        <span className="pulsing-dot" style={{ background: "#27c93f", boxShadow: "none" }}></span>
                      </div>
                      <span className="mono" style={{ fontSize: "13px", fontWeight: 500, color: "rgba(255,255,255,0.6)" }}>
                        bash - devlinkhub.sh
                      </span>
                    </div>

                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "13.5px",
                        lineHeight: 1.7,
                        color: "var(--accent-green)",
                        overflow: "hidden",
                        flex: 1,
                        textAlign: "left",
                        whiteSpace: "pre-wrap"
                      }}
                    >
                      <span dangerouslySetInnerHTML={{ __html: cliText }}></span>
                      <span className="blinking-caret"></span>
                    </div>

                    {/* Terminal Footer */}
                    <div style={{ borderTop: "1px solid var(--glass-border)", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--accent-green)", marginTop: "16px" }}>
                      <span>// status: active</span>
                      <span>v2026.1.0 Stable</span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="swapped-cli"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                    style={{ display: "flex", flexDirection: "column", height: "100%", flex: 1, width: "100%" }}
                  >
                    {/* Hackathon CLI Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--glass-border)", paddingBottom: "12px", marginBottom: "16px" }}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <span
                          onClick={(e) => { e.stopPropagation(); setIsTerminalSwapped(false); }}
                          className="pulsing-dot"
                          style={{ background: "#ff5f56", boxShadow: "none", cursor: "pointer" }}
                          title="Close and Restore"
                        ></span>
                        <span className="pulsing-dot" style={{ background: "#ffbd2e", boxShadow: "none" }}></span>
                        <span className="pulsing-dot" style={{ background: "#27c93f", boxShadow: "none" }}></span>
                      </div>
                      <span className="mono" style={{ fontSize: "13px", fontWeight: 500, color: "var(--accent-cyan)" }}>
                        /devlinkhub/ignite/info
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setIsTerminalSwapped(false); }}
                        style={{ background: "transparent", border: "none", color: "var(--white-secondary)", cursor: "pointer", fontSize: "12px", fontFamily: "var(--font-mono)" }}
                      >
                        [ESC] X
                      </button>
                    </div>

                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "13.5px",
                        lineHeight: 1.7,
                        color: "var(--accent-green)",
                        overflow: "hidden",
                        flex: 1,
                        textAlign: "left",
                        whiteSpace: "pre-wrap"
                      }}
                    >
                      <span dangerouslySetInnerHTML={{ __html: hackathonCliText }}></span>
                      {hackathonCliDone && (
                        <div style={{ marginTop: "1rem" }}>
                          <button
                            className="cyber-register-btn"
                            style={{ border: "none", cursor: "pointer" }}
                            onClick={(e) => { e.stopPropagation(); navigate("/register"); }}
                          >
                            Launch Registration <span>⏎</span>
                          </button>
                        </div>
                      )}
                      {!hackathonCliDone && <span className="blinking-caret"></span>}
                    </div>

                    {/* Terminal Footer */}
                    <div style={{ borderTop: "1px solid var(--glass-border)", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--accent-green)", marginTop: "16px" }}>
                      <span>// status: active</span>
                      <span
                        onClick={(e) => { e.stopPropagation(); navigate("/register"); }}
                        className="cyber-register-btn"
                        style={{ padding: "8px 16px", fontSize: "11px", marginTop: 0, textDecoration: "none", color: "inherit", cursor: "pointer" }}
                      >
                        Register Spot ⏎
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        <div className="hero-scroll-indicator">
          <span>&gt; scroll to explore</span>
          <div className="scroll-chevron"></div>
        </div>
      </section>

      {/* SECTION 2: LIVE TERMINAL STRIP */}
      <div className="live-strip-wrap" aria-hidden="true">
        <motion.div
          className="live-strip-track"
          animate={{ x: "-50%" }}
          transition={{ duration: 35, ease: "linear", repeat: Infinity }}
        >
          <div className="strip-item">&gt; ignite_2026.init()</div>
          <div className="strip-separator">——</div>
          <div className="strip-item">&gt; Bhopal, MP hosting central india's builders</div>
          <div className="strip-separator">——</div>
          <div className="strip-item">&gt; BuildX Workshop Day 1</div>
          <div className="strip-separator">——</div>
          <div className="strip-item">&gt; Auraxis Hackathon Day 2</div>
          <div className="strip-separator">——</div>
          <div className="strip-item">&gt; ignite_pass.price: ₹349</div>
          <div className="strip-separator">——</div>
          <div className="strip-item">&gt; team_nodes: 1–4 members</div>
          <div className="strip-separator">——</div>
          <div className="strip-item">&gt; git checkout -b ignite-2026 ✓</div>
          <div className="strip-separator">——</div>
          {/* Loop duplicates */}
          <div className="strip-item">&gt; ignite_2026.init()</div>
          <div className="strip-separator">——</div>
          <div className="strip-item">&gt; Bhopal, MP hosting central india's builders</div>
          <div className="strip-separator">——</div>
          <div className="strip-item">&gt; BuildX Workshop Day 1</div>
          <div className="strip-separator">——</div>
          <div className="strip-item">&gt; Auraxis Hackathon Day 2</div>
          <div className="strip-separator">——</div>
          <div className="strip-item">&gt; ignite_pass.price: ₹349</div>
          <div className="strip-separator">——</div>
          <div className="strip-item">&gt; team_nodes: 1–4 members</div>
          <div className="strip-separator">——</div>
          <div className="strip-item">&gt; git checkout -b ignite-2026 ✓</div>
        </motion.div>
      </div>

      {/* SECTION 2.5: ABOUT & WHY JOIN IGNITE 2026 */}
      <section className="about-ignite-section" id="about" style={{ padding: "8rem 2rem", position: "relative", zIndex: 10 }}>
        <div className="section-wrapper">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="section-head-mono">&gt; ignite.initialize_overview()</span>
            <h2 className="section-title-display">The Beginning of Something Bigger</h2>
          </motion.div>

          <div className="about-2col-grid" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "3rem", marginBottom: "4rem", alignItems: "center" }}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", marginBottom: "1.5rem", color: "var(--accent-cyan)" }}>
                What is IGNITE 2026?
              </h3>
              <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "rgba(255,255,255,0.8)", marginBottom: "1.5rem" }}>
                <strong>IGNITE 2026</strong> is the official flagship launch event of <strong>DevLinkHub</strong>.
              </p>
              <p style={{ fontSize: "1.05rem", lineHeight: "1.8", color: "var(--white-secondary)" }}>
                For two exciting days, participants will learn, network, collaborate, and compete through carefully designed experiences focused on growth and innovation. Whether you're taking your first step into tech or already building projects, IGNITE 2026 is your opportunity to learn from industry experts, connect with ambitious builders, and experience the energy of a thriving developer community.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
            >
              <TiltGlassCard style={{ padding: "2rem", borderLeft: "4px solid var(--accent-cyan)" }}>
                <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "#fff", marginBottom: "0.5rem" }}>
                  Day 1 • BuildX Workshop
                </h4>
                <p style={{ fontSize: "0.95rem", color: "var(--white-secondary)", lineHeight: "1.6" }}>
                  A practical, hands-on workshop designed to help participants understand modern technologies, development workflows, AI tools, product thinking, and industry trends. Learn directly from experienced speakers.
                </p>
              </TiltGlassCard>

              <TiltGlassCard style={{ padding: "2rem", borderLeft: "4px solid var(--accent-violet)" }}>
                <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "#fff", marginBottom: "0.5rem" }}>
                  Day 2 • Auraxis Hackathon
                </h4>
                <p style={{ fontSize: "0.95rem", color: "var(--white-secondary)", lineHeight: "1.6" }}>
                  An innovation challenge where participants collaborate, build, and present creative solutions to real-world problems. Designed for developers, designers, AI enthusiasts, and problem solvers.
                </p>
              </TiltGlassCard>
            </motion.div>
          </div>

          {/* Why Join IGNITE 2026 */}
          <div style={{ marginTop: "6rem" }}>
            <span className="section-head-mono" style={{ color: "var(--accent-green)" }}>&gt; ignite.perks_and_value()</span>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: "900", marginBottom: "3rem" }}>
              Why Join IGNITE 2026?
            </h3>

            <div className="perks-auto-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <TiltGlassCard style={{ padding: "2.5rem", minHeight: "220px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>👨‍🏫</div>
                    <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "#fff", marginBottom: "0.75rem" }}>
                      Learn From Industry Professionals
                    </h4>
                    <p style={{ fontSize: "0.95rem", color: "var(--white-secondary)", lineHeight: "1.6" }}>
                      Gain insights from experienced speakers and mentors who are actively building in the industry.
                    </p>
                  </div>
                </TiltGlassCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <TiltGlassCard style={{ padding: "2.5rem", minHeight: "220px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🤝</div>
                    <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "#fff", marginBottom: "0.75rem" }}>
                      Meet Like-Minded Builders
                    </h4>
                    <p style={{ fontSize: "0.95rem", color: "var(--white-secondary)", lineHeight: "1.6" }}>
                      Connect with students, developers, designers, and innovators who share your passion for tech.
                    </p>
                  </div>
                </TiltGlassCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <TiltGlassCard style={{ padding: "2.5rem", minHeight: "220px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⚡</div>
                    <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "#fff", marginBottom: "0.75rem" }}>
                      Build Meaningful Connections
                    </h4>
                    <p style={{ fontSize: "0.95rem", color: "var(--white-secondary)", lineHeight: "1.6" }}>
                      Expand your developer network, find potential co-founders, and discover future collaborators.
                    </p>
                  </div>
                </TiltGlassCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <TiltGlassCard style={{ padding: "2.5rem", minHeight: "220px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>💻</div>
                    <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "#fff", marginBottom: "0.75rem" }}>
                      Real Hackathon Environment
                    </h4>
                    <p style={{ fontSize: "0.95rem", color: "var(--white-secondary)", lineHeight: "1.6" }}>
                      Work on exciting real-world challenges, pitch to judges, and showcase your building skills.
                    </p>
                  </div>
                </TiltGlassCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                style={{ gridColumn: "span 1" }}
              >
                <TiltGlassCard style={{ padding: "2.5rem", minHeight: "220px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🚀</div>
                    <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "#fff", marginBottom: "0.75rem" }}>
                      Become Part of DevLinkHub
                    </h4>
                    <p style={{ fontSize: "0.95rem", color: "var(--white-secondary)", lineHeight: "1.6" }}>
                      Join a growing developer community focused on learning together and building together.
                    </p>
                  </div>
                </TiltGlassCard>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: HACKATHON TRACKS */}
      <section className="tracks-section" id="tracks">
        <div className="section-wrapper">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="section-head-mono">&gt; ignite.tracks_mapping()</span>
            <h2 className="section-title-display">Hackathon Tracks</h2>
          </motion.div>

          <div className="tracks-grid">
            {tracks.map((track, i) => (
              <motion.div
                key={track.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <TiltGlassCard className="track-card">
                  <div className="track-icon">{track.icon}</div>
                  <h3 className="track-title">{track.title}</h3>
                  <p className="track-desc">{track.desc}</p>
                </TiltGlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3.5: WHO CAN PARTICIPATE */}
      <section className="eligibility-section" style={{ padding: "6rem 2rem", background: "var(--bg-secondary)", position: "relative", zIndex: 10 }}>
        <div className="section-wrapper">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="section-head-mono">&gt; ignite.target_audience()</span>
            <h2 className="section-title-display">Who Can Participate?</h2>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "3rem" }}>
            {[
              { role: "Students", icon: "🎓", desc: "College students looking to learn, network, and build projects." },
              { role: "Developers", icon: "💻", desc: "Software engineers, backend, frontend, and fullstack builders." },
              { role: "Designers", icon: "🎨", desc: "UI/UX designers creating intuitive and premium interfaces." },
              { role: "AI Enthusiasts", icon: "🤖", desc: "Builders leveraging models, embeddings, and cognitive pipelines." },
              { role: "Entrepreneurs", icon: "💡", desc: "Future founders looking to build a proof of concept or MVP." },
              { role: "Tech Communities", icon: "🌐", desc: "Active community members wishing to collaborate on stage." },
              { role: "Beginners & Pros", icon: "⚡", desc: "Both first-time hackathon attendees and seasoned developers." }
            ].map((item, idx) => (
              <motion.div
                key={item.role}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <TiltGlassCard style={{ padding: "2rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{item.icon}</div>
                  <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "#fff", marginBottom: "0.5rem" }}>
                    {item.role}
                  </h4>
                  <p style={{ fontSize: "0.85rem", color: "var(--white-secondary)", lineHeight: "1.5" }}>
                    {item.desc}
                  </p>
                </TiltGlassCard>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", fontFamily: "var(--font-mono)", fontSize: "14px", color: "var(--accent-green)" }}
          >
            <span>&gt; Everyone with a passion for learning and building is welcome. 🚀</span>
          </motion.div>
        </div>
      </section>

      {/* SECTION 4: INTERACTIVE SCHEDULE TIMELINE */}
      <section className="schedule-section" id="schedule">
        <div className="section-wrapper">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="section-head-mono">&gt; event.get_schedule()</span>
            <h2 className="section-title-display">Ignite Event Journey</h2>
          </motion.div>

          <div className="schedule-tabs-container">
            <button
              className={`schedule-tab-btn ${activeTab === "day1" ? "active" : ""}`}
              onClick={() => setActiveTab("day1")}
            >
              Day 1 — BuildX Workshop
            </button>
            <button
              className={`schedule-tab-btn ${activeTab === "day2" ? "active" : ""}`}
              onClick={() => setActiveTab("day2")}
            >
              Day 2 — Auraxis Hackathon
            </button>
          </div>

          <div className="schedule-timeline">
            <AnimatePresence mode="wait">
              {activeTab === "day1" ? (
                <motion.div
                  key="day1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  {day1Schedule.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: idx * 0.05 }}
                      className={`timeline-item ${idx === 0 ? "active" : ""}`}
                    >
                      <div className="timeline-time">{item.time}</div>
                      <h3 className="timeline-title">{item.title}</h3>
                      <p className="timeline-desc">{item.desc}</p>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="day2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  {day2Schedule.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: idx * 0.05 }}
                      className={`timeline-item ${idx === 0 ? "active" : ""}`}
                    >
                      <div className="timeline-time">{item.time}</div>
                      <h3 className="timeline-title">{item.title}</h3>
                      <p className="timeline-desc">{item.desc}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* SECTION 5: PRICING COMPARISON TABLE */}
      <section className="pricing-section" id="pricing">
        <div className="section-wrapper">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="section-head-mono">&gt; tickets.allocate_pricing()</span>
            <h2 className="section-title-display">Registration Passes</h2>
          </motion.div>

          <div className="pricing-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)", maxWidth: "800px" }}>
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <TiltGlassCard className={`pricing-card ${plan.featured ? "featured" : ""}`}>
                  <span className="pricing-card-badge">{plan.badge}</span>
                  <h3 className="pricing-plan-title" style={{ marginTop: "1.5rem" }}>{plan.title}</h3>
                  <div className="pricing-price">{plan.price}</div>
                  <div className="pricing-price-period">per team configuration</div>

                  <ul className="pricing-features-list">
                    {plan.features.map((f) => (
                      <li key={f}>
                        <span>✓</span> {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => navigate(plan.key === "ignite_pass" ? `/register?plan=ignite_pass` : "#pricing")}
                    className={plan.featured ? "btn-primary" : "btn-secondary"}
                    style={{ width: "100%", justifyContent: "center", cursor: "pointer" }}
                  >
                    {plan.key === "ignite_pass" ? "Select Pass ➔" : "Unlock Promo Benefits"}
                  </button>
                </TiltGlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: JUDGING & AWARDS */}
      <section className="pillars-section" id="judging" style={{ background: "var(--bg-secondary)" }}>
        <div className="section-wrapper">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="section-head-mono">&gt; matrix.evaluation_weights()</span>
            <h2 className="section-title-display">Judging Criteria &amp; Awards</h2>
          </motion.div>

          <div className="bento-pillars-grid">
            <TiltGlassCard className="pillar-card pillar-card--large">
              <div>
                <h3 className="pillar-title cyan" style={{ fontSize: "42px" }}>Evaluation Criteria</h3>
                <p className="pillar-body" style={{ fontSize: "15px" }}>
                  Solutions will be evaluated by an esteemed panel of technology professionals and founders based on:
                </p>
                <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--glass-border)", paddingBottom: "8px" }}>
                    <span>💡 Innovation (Uniqueness, Creativity)</span>
                    <strong style={{ color: "var(--accent-cyan)" }}>30%</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--glass-border)", paddingBottom: "8px" }}>
                    <span>🛠️ Technical Implementation (Robust code, scalability)</span>
                    <strong style={{ color: "var(--accent-violet)" }}>25%</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--glass-border)", paddingBottom: "8px" }}>
                    <span>🎯 Problem Solving (Real-world applicability)</span>
                    <strong style={{ color: "var(--accent-green)" }}>20%</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--glass-border)", paddingBottom: "8px" }}>
                    <span>🎨 User Experience (Design, clean flow)</span>
                    <strong style={{ color: "var(--accent-pink)" }}>15%</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--glass-border)", paddingBottom: "8px" }}>
                    <span>📢 Presentation (Pitch clarity, server demo)</span>
                    <strong style={{ color: "#fff" }}>10%</strong>
                  </div>
                </div>
              </div>
            </TiltGlassCard>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <TiltGlassCard className="pillar-card" style={{ minHeight: "180px" }}>
                <div>
                  <h3 className="pillar-title violet" style={{ fontSize: "28px" }}>Podium Awards</h3>
                  <p className="pillar-body" style={{ fontSize: "14px", marginTop: "8px" }}>
                    🏆 <strong>Winner</strong>: Cash Prize + Trophy + Certificate<br />
                    🥈 <strong>Runner-Up</strong>: Cash Prize + Certificate<br />
                    🥉 <strong>Second Runner-Up</strong>: Cash Prize + Certificate
                  </p>
                </div>
              </TiltGlassCard>
              <TiltGlassCard className="pillar-card" style={{ minHeight: "220px" }}>
                <div>
                  <h3 className="pillar-title green" style={{ fontSize: "28px" }}>Special Awards</h3>
                  <p className="pillar-body" style={{ fontSize: "14px", marginTop: "8px" }}>
                    🏅 Best AI Project<br />
                    🏅 Best Design / UX<br />
                    🏅 Best Beginner Team<br />
                    🏅 Community Choice Award<br />
                    🏅 Most Innovative Solution
                  </p>
                </div>
              </TiltGlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: FAQ ACCORDION */}
      <section className="faq-section" id="faq">
        <div className="section-wrapper">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="section-head-mono">&gt; support.fetch_faq()</span>
            <h2 className="section-title-display">Frequently Asked Questions</h2>
          </motion.div>

          <div className="faq-list">
            {faqs.map((faq, idx) => (
              <div key={idx} className="faq-accordion-item">
                <div
                  className="faq-accordion-header"
                  onClick={() => setActiveFaq((prev) => (prev === idx ? null : idx))}
                >
                  <h3>{faq.q}</h3>
                  <motion.span
                    className="faq-accordion-icon"
                    animate={{ rotate: activeFaq === idx ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    ▼
                  </motion.span>
                </div>
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: activeFaq === idx ? "auto" : 0,
                    opacity: activeFaq === idx ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{ overflow: "hidden" }}
                >
                  <div className="faq-accordion-body">{faq.a}</div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7.5: ABOUT DEVLINKHUB */}
      <section className="about-devlinkhub-section">
        <div className="section-wrapper">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="section-head-mono">&gt; devlinkhub.profile()</span>
            <h2 className="section-title-display">About DevLinkHub</h2>
          </motion.div>

          <div className="glass-card about-devlink-card">
            <div className="dot-pattern" style={{ position: "absolute", opacity: 0.5 }} aria-hidden="true"></div>
            <div className="about-devlink-grid">
              <div>
                <p className="about-devlink-text">
                  DevLinkHub is a community built for students, developers, creators, and innovators who believe in learning together and building together.
                </p>
                <p className="about-devlink-subtext">
                  Our mission is simple: <strong>Build. Connect. Grow.</strong> Through hands-on workshops, innovation hackathons, networking meetups, and community-driven collaborative initiatives, we aim to create opportunities that help individuals grow both personally and professionally.
                </p>
              </div>

              <div style={{ textAlign: "center", width: "100%" }}>
                <div className="about-devlink-slogan">
                  <span style={{ color: "var(--accent-cyan)" }}>BUILD.</span><br />
                  <span style={{ color: "#fff" }}>CONNECT.</span><br />
                  <span style={{ color: "var(--accent-green)" }}>GROW.</span>
                </div>
                <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center", width: "100%" }}>
                  <a
                    href="https://discord.gg/cXFCaPsePs"
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary"
                  >
                    Join DevLinkHub Discord
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: ORGANIZERS */}
      <section className="organizers-section" id="organizers">
        <div className="section-wrapper">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="section-head-mono">&gt; nodes.get_leadership()</span>
            <h2 className="section-title-display">Organized By</h2>
          </motion.div>

          <div className="organizer-grid">
            {organizers.map((org, i) => (
              <motion.div
                key={org.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <TiltGlassCard className="organizer-card">
                  <div className="organizer-avatar-placeholder">{org.init}</div>
                  <div>
                    <h4 className="organizer-name">{org.name}</h4>
                    <span className="organizer-role">{org.role}</span>
                  </div>
                </TiltGlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </MotionConfig>
  );
}
