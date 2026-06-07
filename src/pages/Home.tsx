import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import "../styles/style.css";

const ParticleBg = lazy(() => import("../components/ParticleBg"));

/* --- Tracks Data --- */
const tracks = [
  { icon: "ai", title: "Artificial Intelligence & ML", desc: "Build intelligent systems that solve real-world challenges using cognitive nodes, vector embeddings, and LLM orchestration." },
  { icon: "web", title: "Web & Software Development", desc: "Create modern, highly-responsive, performance-optimized, and secure digital products and platforms." },
  { icon: "health", title: "HealthTech", desc: "Develop solutions that improve healthcare accessibility, diagnostic systems, patient management, and efficiency." },
  { icon: "education", title: "EdTech", desc: "Transform educational journeys, classroom learning, and shared resource archives through engaging tech." },
  { icon: "finance", title: "FinTech", desc: "Build tools that simplify transactions, secure payment gateways, and improve regional financial accessibility." },
  { icon: "open", title: "Open Innovation", desc: "Got a unique idea? Bring any impactful, high-performance technology concept to life on our open stage." }
];

const renderTrackIcon = (iconId: string) => {
  switch (iconId) {
    case "ai":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <rect x="9" y="9" width="6" height="6" />
          <line x1="9" y1="1" x2="9" y2="4" />
          <line x1="15" y1="1" x2="15" y2="4" />
          <line x1="9" y1="20" x2="9" y2="23" />
          <line x1="15" y1="20" x2="15" y2="23" />
          <line x1="20" y1="9" x2="23" y2="9" />
          <line x1="20" y1="15" x2="23" y2="15" />
          <line x1="1" y1="9" x2="4" y2="9" />
          <line x1="1" y1="15" x2="4" y2="15" />
        </svg>
      );
    case "web":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
    case "health":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      );
    case "education":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      );
    case "finance":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
          <rect x="6" y="14" width="4" height="2" />
        </svg>
      );
    case "open":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5" />
          <line x1="9" y1="18" x2="15" y2="18" />
          <line x1="10" y1="22" x2="14" y2="22" />
        </svg>
      );
    default:
      return null;
  }
};

const renderRoleIcon = (roleId: string) => {
  switch (roleId) {
    case "students":
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-cyan)", filter: "drop-shadow(0 0 6px rgba(0, 242, 254, 0.2))" }}>
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
        </svg>
      );
    case "developers":
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-green)", filter: "drop-shadow(0 0 6px rgba(0, 255, 135, 0.2))" }}>
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      );
    case "designers":
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-pink)", filter: "drop-shadow(0 0 6px rgba(255, 0, 127, 0.2))" }}>
          <path d="M12 22C17.52 22 22 17.52 22 12S17.52 2 12 2 2 6.48 2 12a10 10 0 0 0 10 10zm0-16a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-4 4.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm8 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" />
        </svg>
      );
    case "ai":
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-cyan)", filter: "drop-shadow(0 0 6px rgba(0, 242, 254, 0.2))" }}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <rect x="9" y="9" width="6" height="6" />
          <line x1="9" y1="1" x2="9" y2="4" />
          <line x1="15" y1="1" x2="15" y2="4" />
          <line x1="9" y1="20" x2="9" y2="23" />
          <line x1="15" y1="20" x2="15" y2="23" />
          <line x1="20" y1="9" x2="23" y2="9" />
          <line x1="20" y1="15" x2="23" y2="15" />
          <line x1="1" y1="9" x2="4" y2="9" />
          <line x1="1" y1="15" x2="4" y2="15" />
        </svg>
      );
    case "entrepreneurs":
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-violet)", filter: "drop-shadow(0 0 6px rgba(139, 92, 246, 0.2))" }}>
          <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5" />
          <line x1="9" y1="18" x2="15" y2="18" />
          <line x1="10" y1="22" x2="14" y2="22" />
        </svg>
      );
    case "communities":
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-cyan)", filter: "drop-shadow(0 0 6px rgba(0, 242, 254, 0.2))" }}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
      );
    case "beginners":
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-green)", filter: "drop-shadow(0 0 6px rgba(0, 255, 135, 0.2))" }}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    default:
      return null;
  }
};

const renderPlanIcon = (iconId: string) => {
  switch (iconId) {
    case "zap":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-cyan)", verticalAlign: "middle" }}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case "rocket":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-pink)", verticalAlign: "middle" }}>
          <path d="M4.5 16.5c-1.5 1.25-2.5 3.5-2.5 3.5s2.25-1 3.5-2.5M14 2c.004.008.008.016.012.024A10.15 10.15 0 0 1 15 6v3h3a10.15 10.15 0 0 1 3.976.988c.008.004.016.008.024.012L22 2l-8 8z" />
          <path d="M9 15l-3 3v3h3l3-3H9z" />
        </svg>
      );
    default:
      return null;
  }
};

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
    title: "IGNITE Pass",
    icon: "zap",
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
    title: "Early Bird Promo",
    icon: "rocket",
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
  { q: "Can I create a team later?", a: "No. Teams must be finalized during registration. Once a team is registered, members cannot be added, removed, or replaced." },
  { q: "What is the team size?", a: "Teams can consist of 1 to 4 members. The pass covers the entire team." },
  { q: "When will the venue be announced?", a: "The venue details will be shared soon through official DevLinkHub channels and via email." },
  { q: "When will prizes be announced?", a: "Prize pool details and challenge themes will be revealed during the kickoff on Day 2." }
];

/* --- Organizers Data --- */
const organizers = [
  {
    name: "Pawan Kushwaha",
    role: "Founder & Community Head",
    init: "PK",
    image: "/static/founder-image.svg",
    bio: "Visionary behind DevLinkHub — building a developer community that empowers students and creators across India through collaboration, learning, and innovation.",
    badge: "FOUNDER",
    badgeColor: "var(--accent-cyan)",
    skills: ["Community Building", "Leadership", "Event Management", "Startup Ecosystem"]
  },
  {
    name: "Prince Kumar",
    role: "Operations Head",
    init: "PR",
    image: "/static/operation-head.jpeg",
    bio: "Drives the operational backbone of DevLinkHub IGNITE, ensuring everything runs smoothly — from logistics and coordination to participant experience.",
    badge: "OPERATIONS",
    badgeColor: "var(--accent-green)",
    skills: ["Logistics", "Team Coordination", "Project Planning", "Execution"]
  },
  {
    name: "Ayush Kumar",
    role: "Community Relations Head",
    init: "AK",
    image: "/static/community-realations-head.png",
    bio: "Bridges the gap between the community and the event — managing outreach, partnerships, and ensuring every participant feels welcomed and valued.",
    badge: "COMMUNITY",
    badgeColor: "var(--accent-violet)",
    skills: ["Outreach", "Partnership Building", "Communication", "Brand Relations"]
  },
  {
    name: "Kartik Raj",
    role: "Community Manager",
    init: "KR",
    image: "/static/community-manager.jpg",
    bio: "Keeps the community active and engaged — organizing discussions, facilitating collaborations, and nurturing the developer ecosystem at DevLinkHub.",
    badge: "COMMUNITY",
    badgeColor: "var(--accent-violet)",
    skills: ["Engagement", "Content Strategy", "Community Growth", "Moderation"]
  },
  {
    name: "Nilesh Verma",
    role: "Management Lead",
    init: "NI",
    image: "/static/management-lead.jpeg",
    bio: "Oversees planning and project management for the event, making sure every moving part aligns toward a successful and impactful experience.",
    badge: "MANAGEMENT",
    badgeColor: "var(--accent-orange)",
    skills: ["Project Management", "Strategic Planning", "Resource Allocation", "Risk Management"]
  },
  {
    name: "Akshat Agrawal",
    role: "Technical Lead",
    init: "AA",
    bio: "Leads the technical vision of DevLinkHub — architecting platforms, guiding technical decisions, and mentoring developers within the community.",
    badge: "TECH",
    badgeColor: "var(--accent-pink)",
    skills: ["Full Stack Dev", "System Architecture", "API Design", "Mentorship", "Cloud"]
  },
  {
    name: "Ranjan Kumar Singh",
    role: "Technical Co-Lead",
    init: "RS",
    image: "/static/co-tech-lead.jpg",
    bio: "Co-leads the technical engineering efforts, contributing to platform development and helping elevate the quality of technical projects across the team.",
    badge: "TECH",
    badgeColor: "var(--accent-pink)",
    skills: ["Frontend Dev", "React", "TypeScript", "UI Engineering", "Performance"]
  }
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
  const glowRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 768 || 'ontouchstart' in window) return;
    if (rafRef.current !== null) return;
    const clientX = e.clientX;
    const clientY = e.clientY;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const card = cardRef.current;
      const glow = glowRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const rotateX = -((y - rect.height / 2) / (rect.height / 2)) * 4;
      const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 6;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      if (glow) {
        glow.style.background = `radial-gradient(350px circle at ${x}px ${y}px, rgba(0, 245, 255, 0.09) 0%, rgba(255, 255, 255, 0.01) 75%, transparent 100%)`;
        glow.style.opacity = "1";
      }
    });
  };

  const handleMouseEnter = () => {
    // ── FIX: apply will-change ONLY when hovering, not permanently ──
    // Permanently setting will-change on 20+ cards = 20+ GPU compositor layers always allocated
    if (cardRef.current) cardRef.current.style.willChange = "transform";
  };

  const handleMouseLeave = () => {
    if (window.innerWidth < 768 || 'ontouchstart' in window) return;
    if (rafRef.current !== null) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card) return;
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
    // ── FIX: release compositor layer after hover ends ──
    card.style.willChange = "auto";
    if (glow) glow.style.opacity = "0";
  };

  return (
    <div
      ref={cardRef}
      className={`glass-card ${className}`}
      style={style}  // removed static willChange:"transform" from here
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <div ref={glowRef} className="spotlight-glow" style={{ opacity: 0, transition: "opacity 0.3s ease" }}></div>
      {children}
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();

  /* --- States --- */
  // Safe initialization: check window existence (avoids SSR crash + DOM read on every render)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  // Memoized: avoids re-computing window.innerWidth on every render
  const showBackgroundEffects = !isMobile && window.innerWidth >= 1024 && !('ontouchstart' in window);
  const [activeTab, setActiveTab] = useState<"day1" | "day2">("day1");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isTerminalSwapped, setIsTerminalSwapped] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<typeof organizers[0] | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Single merged Escape key handler (was two separate useEffects)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (selectedOrg) setSelectedOrg(null);
      if (isTerminalSwapped) setIsTerminalSwapped(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedOrg, isTerminalSwapped]);

  // Lock body scroll when organizer modal is active
  useEffect(() => {
    if (selectedOrg) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedOrg]);

  // Hero Original CLI text lines state
  const [cliText, setCliText] = useState("");
  // Swapped Hackathon CLI printing steps
  const [hackathonCliText, setHackathonCliText] = useState("");
  const [hackathonCliDone, setHackathonCliDone] = useState(false);

  /* --- Canvases --- */
  const heroCanvasRef = useRef<HTMLCanvasElement>(null);

  /* --- 1. Water Canvas Sine Mesh Animation (desktop only) --- */
  useEffect(() => {
    if (isMobile || window.innerWidth < 1024 || 'ontouchstart' in window) return;
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
    window.addEventListener("resize", handleResize, { passive: true });

    const GRID_STEP = 35;
    const spacing = 70;
    const amplitude = 10;
    const frequency = 0.007;
    let frame = 0;
    let animId: number;
    // ── FIX: pause when tab not visible ──
    let isPaused = document.hidden;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      // ── CRITICAL: skip all work when tab is in background ──
      if (isPaused) return;
      // Draw every 3rd frame (~20fps)
      if (frame % 3 !== 0) { frame++; return; }

      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(0, 245, 255, 0.10)";
      ctx.lineWidth = 1;

      for (let y = spacing; y < h; y += spacing) {
        ctx.beginPath();
        for (let x = 0; x <= w; x += GRID_STEP) {
          const disp = Math.sin(x * frequency + y * 0.01 + frame * 0.008) * amplitude;
          if (x === 0) ctx.moveTo(x, y + disp);
          else ctx.lineTo(x, y + disp);
        }
        ctx.stroke();
      }

      for (let x = spacing; x < w; x += spacing) {
        ctx.beginPath();
        for (let y = 0; y <= h; y += GRID_STEP) {
          const disp = Math.sin(x * 0.01 + y * frequency + frame * 0.008) * amplitude;
          if (y === 0) ctx.moveTo(x + disp, y);
          else ctx.lineTo(x + disp, y);
        }
        ctx.stroke();
      }
      frame++;
    };

    const onVisibilityChange = () => { isPaused = document.hidden; };
    document.addEventListener("visibilitychange", onVisibilityChange);

    animate();

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("resize", handleResize);
      canvas.width = 0; canvas.height = 0;
    };
  }, []);

  /* --- 2. Hero Original CLI (npm install loop) --- */
  useEffect(() => {
    if (!isTerminalSwapped) {
      setCliText("admin@devlinkhub:~ $ ");
      return;
    }

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
      { type: "print", text: "<span style='color:var(--white-secondary)'>[Click terminal card to query details]</span>\n" }
    ];

    let currentText = "admin@devlinkhub:~ $ ";
    setCliText(currentText);

    let stepIdx = 0;
    let charIdx = 0;
    let timeoutId: ReturnType<typeof setTimeout>;
    // ── FIX: alive flag — guarantees loop stops even if mid-chain ──
    // clearTimeout() only cancels the ONE currently scheduled callback.
    // If the effect re-runs while a callback is queued, the old callback
    // fires and schedules a new one, restarting the loop. The alive flag
    // prevents any callback from scheduling further work after cleanup.
    let alive = true;

    const execute = () => {
      // ── CRITICAL: bail out immediately if effect was cleaned up ──
      if (!alive) return;

      if (stepIdx >= steps.length) {
        return; // Stop the animation sequence permanently when finished
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
    return () => {
      // ── Kill the chain: flag stops any in-flight callback from rescheduling ──
      alive = false;
      clearTimeout(timeoutId);
    };
  }, [isTerminalSwapped]);
  // ── FIX: removed isMobile from deps — CLI animation doesn't need to restart on resize ──

  /* --- 3. Swapped CLI (Hackathon sequence) --- */
  useEffect(() => {
    if (isTerminalSwapped) {
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
      { type: "print", text: "<span style='color:var(--accent-cyan)'>[OK]</span> Community: 500+ developers synced\n\n" }
    ];

    let currentText = "admin@devlinkhub:~ $ ";
    setHackathonCliText(currentText);
    setHackathonCliDone(false);

    let stepIdx = 0;
    let charIdx = 0;
    let timeoutId: ReturnType<typeof setTimeout>;
    // ── FIX: alive flag prevents mid-chain callbacks from rescheduling ──
    let alive = true;

    const execute = () => {
      if (!alive) return;  // bail immediately if cleaned up

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
    return () => {
      alive = false;
      clearTimeout(timeoutId);
    };
  }, [isTerminalSwapped]);
  // ── FIX: removed isMobile from deps — sequence doesn't change on resize ──

  /* --- 4. Global Escape key listener --- */
  // REMOVED: merged into the single Escape handler above

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
        {showBackgroundEffects && (
          <Suspense fallback={null}>
            <div className="hero-particles-bg" aria-hidden="true">
              <ParticleBg />
            </div>
          </Suspense>
        )}
        {showBackgroundEffects && <canvas ref={heroCanvasRef} className="hero-water-bg" aria-hidden="true"></canvas>}

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
                href="/register"
                className="btn-secondary"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/register");
                }}
              >
                Register Now
              </a>
            </div>
            <div className="hero-date-grid">
              <div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>20-21 June 2026</span>
              </div>
              <div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span>Team Size: 1-4 Members</span>
              </div>
              <div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                </svg>
                <span>Open for Students &amp; Developers</span>
              </div>
              <div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>Venue To Be Announced Soon</span>
              </div>
            </div>
          </motion.div>

          {/* CLI Terminal */}
          <div className="hero-visual-block" aria-hidden="true">
            {/* Hero blob — pure CSS animation, no JS SVG <animate> */}
            <div aria-hidden="true" style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%", height: "80%", zIndex: 0,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(0,242,254,0.12) 0%, rgba(139,92,246,0.08) 50%, transparent 70%)",
              filter: "blur(20px)",
              opacity: 0.5,
              pointerEvents: "none",
              animation: "blobBreath1 16s ease-in-out infinite alternate"
            }} />

            <motion.div
              layoutId="cli-terminal"
              transition={{ type: "spring", stiffness: 180, damping: 25 }}
              className="glass-card hero-visual-card"
              style={{
                zIndex: 10,
                cursor: "default",
                transform: "perspective(1200px) rotateY(-8deg)"
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
                    {/* Hackathon CLI Header (Default view, no close button) */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--glass-border)", paddingBottom: "12px", marginBottom: "16px" }}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <span className="pulsing-dot" style={{ background: "#ff5f56", boxShadow: "none" }}></span>
                        <span className="pulsing-dot" style={{ background: "#ffbd2e", boxShadow: "none" }}></span>
                        <span className="pulsing-dot" style={{ background: "#27c93f", boxShadow: "none" }}></span>
                      </div>
                      <span className="mono" style={{ fontSize: "13px", fontWeight: 500, color: "var(--accent-cyan)" }}>
                        /devlinkhub/ignite/info
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
                      <span dangerouslySetInnerHTML={{ __html: hackathonCliText }}></span>
                      {!hackathonCliDone && <span className="blinking-caret"></span>}
                    </div>

                    {/* Terminal Footer */}
                    <div style={{ borderTop: "1px solid var(--glass-border)", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--accent-green)", marginTop: "16px" }}>
                      <span>// status: active</span>
                      <span
                        onClick={(e) => { e.stopPropagation(); navigate("/register"); }}
                        className="cyber-register-btn"
                        style={{ padding: "8px 16px", fontSize: "14px", marginTop: 0, textDecoration: "none", color: "inherit", cursor: "pointer" }}
                      >
                        Register Spot <span style={{ fontSize: "18px", fontWeight: "bold", marginLeft: "6px" }}>⏎</span>
                      </span>
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
                    {/* Original CLI Header (Swapped view, with close buttons) */}
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
                      <span className="mono" style={{ fontSize: "13px", fontWeight: 500, color: "rgba(255,255,255,0.6)" }}>
                        bash - devlinkhub.sh
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
                      <span dangerouslySetInnerHTML={{ __html: cliText }}></span>
                      <span className="blinking-caret"></span>
                    </div>

                    {/* Terminal Footer */}
                    <div style={{ borderTop: "1px solid var(--glass-border)", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--accent-green)", marginTop: "16px" }}>
                      <span>// status: active</span>
                      <span>v2026.1.0 Stable</span>
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
                    <div style={{ color: "var(--accent-cyan)", marginBottom: "1rem" }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 8px rgba(0, 242, 254, 0.3))" }}>
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M19 8l2 2 4-4" />
                      </svg>
                    </div>
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
                    <div style={{ color: "var(--accent-violet)", marginBottom: "1rem" }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 8px rgba(139, 92, 246, 0.3))" }}>
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
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
                    <div style={{ color: "var(--accent-pink)", marginBottom: "1rem" }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 8px rgba(255, 0, 127, 0.3))" }}>
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                      </svg>
                    </div>
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
                    <div style={{ color: "var(--accent-green)", marginBottom: "1rem" }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 8px rgba(0, 255, 135, 0.3))" }}>
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                      </svg>
                    </div>
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
                    <div style={{ color: "var(--accent-cyan)", marginBottom: "1rem" }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 8px rgba(0, 242, 254, 0.3))" }}>
                        <path d="M4.5 16.5c-1.5 1.25-2.5 3.5-2.5 3.5s2.25-1 3.5-2.5M14 2c.004.008.008.016.012.024A10.15 10.15 0 0 1 15 6v3h3a10.15 10.15 0 0 1 3.976.988c.008.004.016.008.024.012L22 2l-8 8z" />
                        <path d="M9 15l-3 3v3h3l3-3H9z" />
                      </svg>
                    </div>
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
                  <div className="track-icon">{renderTrackIcon(track.icon)}</div>
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
              { role: "Students", icon: "students", desc: "College students looking to learn, network, and build projects." },
              { role: "Developers", icon: "developers", desc: "Software engineers, backend, frontend, and fullstack builders." },
              { role: "Designers", icon: "designers", desc: "UI/UX designers creating intuitive and premium interfaces." },
              { role: "AI Enthusiasts", icon: "ai", desc: "Builders leveraging models, embeddings, and cognitive pipelines." },
              { role: "Beginners & Pros", icon: "beginners", desc: "Both first-time hackathon attendees and developers." }
            ].map((item, idx) => (
              <motion.div 
                key={item.role}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <TiltGlassCard style={{ padding: "2rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
                  <div style={{ marginBottom: "1rem" }}>{renderRoleIcon(item.icon)}</div>
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
            <span>&gt; Everyone with a passion for learning and building is welcome.</span>
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
                <TiltGlassCard
                  className={`pricing-card ${plan.featured ? "featured" : ""}`}
                  onClick={() => navigate("/register")}
                  style={{ cursor: "pointer" }}
                >
                  <span className="pricing-card-badge">{plan.badge}</span>
                  <h3 className="pricing-plan-title" style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    {renderPlanIcon(plan.icon)}
                    {plan.title}
                  </h3>
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
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/register");
                    }}
                    className={plan.featured ? "btn-primary" : "btn-secondary"}
                    style={{ width: "100%", justifyContent: "center", cursor: "pointer", border: "none" }}
                  >
                    {plan.key === "ignite_pass" ? "Register now ➔" : "Unlock Promo Benefits ➔"}
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
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--glass-border)", paddingBottom: "8px", alignItems: "center" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-cyan)" }}>
                        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5" />
                        <line x1="9" y1="18" x2="15" y2="18" />
                      </svg>
                      Innovation (Uniqueness, Creativity)
                    </span>
                    <strong style={{ color: "var(--accent-cyan)" }}>30%</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--glass-border)", paddingBottom: "8px", alignItems: "center" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-violet)" }}>
                        <rect x="4" y="4" width="16" height="16" rx="2" />
                        <rect x="9" y="9" width="6" height="6" />
                      </svg>
                      Technical Implementation (Robust code, scalability)
                    </span>
                    <strong style={{ color: "var(--accent-violet)" }}>25%</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--glass-border)", paddingBottom: "8px", alignItems: "center" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-green)" }}>
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="6" />
                        <circle cx="12" cy="12" r="2" />
                      </svg>
                      Problem Solving (Real-world applicability)
                    </span>
                    <strong style={{ color: "var(--accent-green)" }}>20%</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--glass-border)", paddingBottom: "8px", alignItems: "center" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-pink)" }}>
                        <path d="M12 22C17.52 22 22 17.52 22 12S17.52 2 12 2 2 6.48 2 12a10 10 0 0 0 10 10zm0-16a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" />
                      </svg>
                      User Experience (Design, clean flow)
                    </span>
                    <strong style={{ color: "var(--accent-pink)" }}>15%</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--glass-border)", paddingBottom: "8px", alignItems: "center" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#fff" }}>
                        <polygon points="23 7 16 12 23 17 23 7" />
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                      </svg>
                      Presentation (Pitch clarity, server demo)
                    </span>
                    <strong style={{ color: "#fff" }}>10%</strong>
                  </div>
                </div>
              </div>
            </TiltGlassCard>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", height: "100%" }}>
              <TiltGlassCard className="pillar-card" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "2rem" }}>
                <div>
                  <h3 className="pillar-title violet" style={{ fontSize: "32px", textAlign: "center", margin: 0 }}>Main Prizes</h3>
                  <div className="pillar-body" style={{ fontSize: "14px", marginTop: "1rem", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#ffd700", marginRight: "8px", verticalAlign: "middle" }}>
                        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                        <path d="M4 22h16" />
                        <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
                        <path d="M12 2a6 6 0 0 1 6 6v3a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8a6 6 0 0 1 6-6z" />
                      </svg>
                      <strong>Winner</strong>: Cash Prize + Trophy + Certificate
                    </div>
                    <div>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#c0c0c0", marginRight: "8px", verticalAlign: "middle" }}>
                        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                        <path d="M4 22h16" />
                        <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
                        <path d="M12 2a6 6 0 0 1 6 6v3a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8a6 6 0 0 1 6-6z" />
                      </svg>
                      <strong>Runner-Up</strong>: Cash Prize + Certificate
                    </div>
                  </div>
                </div>
              </TiltGlassCard>
              <TiltGlassCard className="pillar-card" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "2rem" }}>
                <div>
                  <h3 className="pillar-title green" style={{ fontSize: "32px", textAlign: "center", margin: 0 }}>Spotlights</h3>
                  <div className="pillar-body" style={{ fontSize: "14px", marginTop: "1rem", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-cyan)", marginRight: "8px", verticalAlign: "middle" }}>
                        <circle cx="12" cy="8" r="7" />
                        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                      </svg>
                      Best AI Project
                    </div>
                    <div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-cyan)", marginRight: "8px", verticalAlign: "middle" }}>
                        <circle cx="12" cy="8" r="7" />
                        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                      </svg>
                      Best Design / UX
                    </div>
                    <div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-cyan)", marginRight: "8px", verticalAlign: "middle" }}>
                        <circle cx="12" cy="8" r="7" />
                        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                      </svg>
                      Best Beginner Team
                    </div>
                    <div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-cyan)", marginRight: "8px", verticalAlign: "middle" }}>
                        <circle cx="12" cy="8" r="7" />
                        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                      </svg>
                      Community Choice Award
                    </div>
                    <div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-cyan)", marginRight: "8px", verticalAlign: "middle" }}>
                        <circle cx="12" cy="8" r="7" />
                        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                      </svg>
                      Most Innovative Solution
                    </div>
                  </div>
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
                <TiltGlassCard
                  className="organizer-card"
                  onClick={() => setSelectedOrg(org)}
                  style={{ cursor: "pointer" }}
                >
                  {org.image ? (
                    <img
                      src={org.image}
                      alt={org.name}
                      className="organizer-avatar"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="organizer-avatar-placeholder">{org.init}</div>
                  )}
                  <div>
                    <h4 className="organizer-name">{org.name}</h4>
                    <span className="organizer-role">{org.role}</span>
                  </div>
                  {/* View detail hint */}
                  <div className="organizer-view-hint">View Profile →</div>
                </TiltGlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ORGANIZER SPOTLIGHT MODAL */}
      <AnimatePresence>
        {selectedOrg && (
          <>
            {/* Backdrop */}
            <motion.div
              key="org-backdrop"
              className="org-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setSelectedOrg(null)}
            />

            {/* Centering wrapper — separate from animation so transform doesn't clash */}
            <div className="org-modal-center-wrap">
            <motion.div
              key="org-modal"
              className="org-spotlight-modal"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              role="dialog"
              aria-modal="true"
              aria-label={`${selectedOrg.name} profile`}
            >
              {/* Close button */}
              <button
                className="org-modal-close"
                onClick={() => setSelectedOrg(null)}
                aria-label="Close profile"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {/* ── PORTRAIT SECTION ── */}
              <div className="org-modal-portrait-zone">
                {/* Ambient glow behind image */}
                <div
                  className="org-modal-portrait-glow"
                  style={{ background: `radial-gradient(circle, ${selectedOrg.badgeColor}30 0%, transparent 70%)` }}
                />
                {/* ── Portrait frame: rings + image share the same origin ── */}
                <div className="org-modal-portrait-frame">
                  {/* Dual glow rings — absolutely centered on the frame */}
                  <div className="org-modal-ring org-modal-ring-outer" style={{ borderColor: `${selectedOrg.badgeColor}40` }} />
                  <div className="org-modal-ring org-modal-ring-inner" style={{ borderColor: `${selectedOrg.badgeColor}80` }} />

                  {/* Portrait image */}
                  {selectedOrg.image ? (
                    <img
                      src={selectedOrg.image}
                      alt={selectedOrg.name}
                      className="org-modal-portrait"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div
                      className="org-modal-portrait-placeholder"
                      style={{ background: `linear-gradient(135deg, ${selectedOrg.badgeColor}, var(--accent-violet))` }}
                    >
                      {selectedOrg.init}
                    </div>
                  )}
                </div>

                {/* Floating badge overlapping image bottom */}
                <motion.span
                  className="org-modal-floating-badge"
                  style={{
                    background: `${selectedOrg.badgeColor}18`,
                    borderColor: `${selectedOrg.badgeColor}70`,
                    color: selectedOrg.badgeColor,
                    boxShadow: `0 0 16px ${selectedOrg.badgeColor}35`
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.18, type: "spring", stiffness: 400, damping: 20 }}
                >
                  {selectedOrg.badge}
                </motion.span>
              </div>

              {/* ── DETAILS SECTION ── */}
              <div className="org-modal-details">
                {/* Event label */}
                <div className="org-modal-event-label">DevLinkHub IGNITE 2026</div>

                {/* Name */}
                <h3 className="org-modal-name">{selectedOrg.name}</h3>

                {/* Role */}
                <div className="org-modal-role" style={{ color: selectedOrg.badgeColor }}>
                  {selectedOrg.role}
                </div>

                {/* Divider */}
                <div className="org-modal-divider" style={{ background: `linear-gradient(90deg, ${selectedOrg.badgeColor}, transparent)` }} />

                {/* About */}
                <div className="org-modal-section-label">About</div>
                <p className="org-modal-bio">{selectedOrg.bio}</p>

                {/* Expertise chips */}
                {selectedOrg.skills && selectedOrg.skills.length > 0 && (
                  <>
                    <div className="org-modal-section-label" style={{ marginTop: "1.25rem" }}>Expertise</div>
                    <div className="org-modal-chips">
                      {selectedOrg.skills.map((skill, si) => (
                        <motion.span
                          key={skill}
                          className="org-modal-chip"
                          style={{
                            borderColor: `${selectedOrg.badgeColor}40`,
                            color: selectedOrg.badgeColor,
                            boxShadow: `0 0 10px ${selectedOrg.badgeColor}20`
                          }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.12 + si * 0.06, type: "spring", stiffness: 360, damping: 22 }}
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

    </MotionConfig>
  );
}
