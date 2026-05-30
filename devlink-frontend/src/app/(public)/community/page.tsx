"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { 
  Terminal, Users, Zap, Rocket, Cpu, ArrowRight, ArrowUpRight,
  Network, Github, GitFork, Star, GitCommit, Globe, Code2,
  Blocks, MessageSquare, LayoutTemplate, Sparkles, Plus,
  Activity, CheckCircle2, Calendar, MapPin, ChevronDown, 
  BookOpen, Map, Linkedin, Instagram, ExternalLink, Shield, Laptop,
  Trophy, Search, UserPlus
} from "lucide-react";

// ─── DATA PAYLOADS ──────────────────────────────────────────────────

const METRICS = [
  { label: "Elite Builders", value: "15.4k", icon: Users, color: "#00F0FF", pulse: true },
  { label: "Code Commits", value: "1.2M+", icon: GitCommit, color: "#FF1CF7", pulse: false },
  { label: "Live Startups", value: "320+", icon: Rocket, color: "#00FFA3", pulse: false },
  { label: "Global Nodes", value: "48", icon: Globe, color: "#7B61FF", pulse: false }
];

const GUILDS = [
  { name: "Frontend / UI Guild", icon: LayoutTemplate, members: "4.2k", online: 342, color: "#00F0FF", desc: "React, Next.js, Framer Motion, and scalable UI architectures." },
  { name: "Backend & Systems", icon: Terminal, members: "3.8k", online: 512, color: "#00FFA3", desc: "Python, Rust, PostgreSQL, Go, and high-performance microservices." },
  { name: "AI & ML Builders", icon: Cpu, members: "2.1k", online: 189, color: "#FF1CF7", desc: "LLMs, Agentic Workflows, PyTorch, and AI model integrations." },
  { name: "Founders Network", icon: Rocket, members: "1.9k", online: 145, color: "#F59E0B", desc: "Product strategy, MVP execution, and early-stage fundraising." },
  { name: "Open Source Core", icon: GitFork, members: "5.4k", online: 420, color: "#7B61FF", desc: "Contributing to massively adopted community repositories." },
  { name: "Design / UX", icon: Sparkles, members: "1.2k", online: 94, color: "#FF5F56", desc: "Figma, design systems, and user experience research." }
];

const FEED = [
  { id: 1, type: "merge", user: "@alex_j", action: "merged PR #241 into devlinkhub-core", time: "2 min ago", icon: GitCommit, color: "#7B61FF", details: "+1,204 lines, -34 lines. Core components refactored." },
  { id: 2, type: "team", user: "Syntax Weavers", action: "formed a hackathon team", time: "15 min ago", icon: Users, color: "#F59E0B", details: "Roles filled: 2x Frontend, 1x AI. Looking for UX Designer." },
  { id: 3, type: "deploy", user: "@sarah_ux", action: "deployed CampusFlow to production", time: "1 hour ago", icon: Rocket, color: "#00FFA3", details: "Vercel edge network synced successfully." },
  { id: 4, type: "join", user: "@rishi_dev", action: "joined the AI Builders Guild", time: "2 hours ago", icon: Plus, color: "#FF1CF7", details: "Joined via invite link from @vikram." }
];

const PROJECTS = [
  { title: "Vaitra", desc: "Next-generation healthcare platform featuring intelligent doctor listings and real-time medicine tracking.", tech: ["Next.js", "FastAPI"], contributors: ["@pawan", "@sarah"], status: "Active", color: "#FF5F56" },
  { title: "Fasal Sathi", desc: "AI-driven precision agriculture system providing data-backed insights for Indian farmers.", tech: ["Python", "React"], contributors: ["SyntaxWeavers"], status: "Beta", color: "#00FFA3" },
  { title: "DevLinkHub Hub", desc: "The core open-source infrastructure powering the DevLinkHub developer ecosystem and matchmaking.", tech: ["Next.js", "Prisma"], contributors: ["@alex", "@pawan"], status: "Live", color: "#00F0FF" }
];

const EVENTS = [
  { title: "Syntax Weavers Sprint", date: "Oct 22", location: "Bhopal Node", type: "Hackathon", color: "#FF1CF7" },
  { title: "AI Agriculture Summit", date: "Nov 05", location: "Virtual Stage", type: "Workshop", color: "#00FFA3" },
  { title: "Open Source Contrib Night", date: "Nov 12", location: "Discord", type: "Meetup", color: "#00F0FF" },
  { title: "Founders Pitch Session", date: "Nov 20", location: "Virtual Stage", type: "Startup", color: "#F59E0B" }
];

const BUILDERS = [
  { 
    name: "Rohit K.", 
    role: "AI Engineer", 
    avatar: "RK", 
    bio: "Building autonomous agents for finance. Need frontend developer to ship MVP.", 
    skills: ["Python", "LangChain", "FastAPI"], 
    status: "Active",
    matchScore: 98,
    projectSpecs: { title: "FinAgent AI", equity: "2.5% - 5%", commitment: "20 hrs/wk" },
    techRadar: [
      { label: "PyTorch", value: 92 },
      { label: "LangChain", value: 95 },
      { label: "FastAPI", value: 88 }
    ],
    socials: { github: "https://github.com", linkedin: "https://linkedin.com" }
  },
  { 
    name: "Aanya S.", 
    role: "UI/UX Designer", 
    avatar: "AS", 
    bio: "Designing rich SaaS tools & interactive dashboards. Looking for Next.js builders.", 
    skills: ["Figma", "Design Systems", "Web3"], 
    status: "Hiring",
    matchScore: 94,
    projectSpecs: { title: "Nexus Dashboard", equity: "1.0% - 3%", commitment: "15 hrs/wk" },
    techRadar: [
      { label: "Figma", value: 96 },
      { label: "Design Systems", value: 90 },
      { label: "TailwindCSS", value: 85 }
    ],
    socials: { github: "https://github.com", linkedin: "https://linkedin.com" }
  },
  { 
    name: "Nikhil P.", 
    role: "Fullstack Developer", 
    avatar: "NP", 
    bio: "Ex-stripe engineer building P2P file sharing system. Looking for Rust engineers.", 
    skills: ["TypeScript", "Next.js", "Postgres"], 
    status: "Active",
    matchScore: 89,
    projectSpecs: { title: "BitSync P2P", equity: "3.0% - 6%", commitment: "Full Time" },
    techRadar: [
      { label: "Next.js", value: 94 },
      { label: "TypeScript", value: 92 },
      { label: "Postgres", value: 85 }
    ],
    socials: { github: "https://github.com", linkedin: "https://linkedin.com" }
  },
  { 
    name: "Meera R.", 
    role: "Systems Engineer", 
    avatar: "MR", 
    bio: "Rustacean optimizing database queries and high-performance WebAssembly APIs.", 
    skills: ["Rust", "Wasm", "Go"], 
    status: "Available",
    matchScore: 92,
    projectSpecs: { title: "AuraDB Engine", equity: "Co-Founder (20%)", commitment: "Full Time" },
    techRadar: [
      { label: "Rust", value: 95 },
      { label: "WebAssembly", value: 90 },
      { label: "Go", value: 88 }
    ],
    socials: { github: "https://github.com", linkedin: "https://linkedin.com" }
  }
];

const RESOURCES = [
  { title: "Ecosystem API Docs", desc: "Access DevLinkHub REST and WebSocket APIs for building integrations.", icon: Code2, category: "API" },
  { title: "Startup Boilerplate", desc: "A pre-configured Next.js, Tailwind, and Prisma template.", icon: Rocket, category: "Code" },
  { title: "Guild Handbook", desc: "Learn how guilds operate, earn rewards, and schedule workshops.", icon: BookOpen, category: "Docs" },
  { title: "Brand Kit & Assets", desc: "Download logos, svg badges, and official style guidelines.", icon: LayoutTemplate, category: "Design" }
];

const FAQS = [
  { q: "What exactly is the DevLinkHub Community?", a: "It's a multiplayer developer network where founders, engineers, and designers collaborate on real startups, open-source projects, and hackathons instead of learning in isolation." },
  { q: "How do guilds work?", a: "Guilds are specialized micro-communities within DevLinkHub. Joining a guild connects you with peers in your specific tech stack for knowledge sharing, architecture reviews, and team formation." },
  { q: "Can beginners join the ecosystem?", a: "Absolutely. We have dedicated learning paths, mentorship programs, and 'good first issue' tags on our open-source repositories to help you get started." },
  { q: "Are there any membership fees?", a: "No, joining the DevLinkHub Community and participating in open-source development is completely free. Some premium accelerators, localized node offices, and co-working resources may have separate applications or pricing." },
  { q: "How can I find a technical co-founder?", a: "You can use our 'Co-Founder Matcher' board, search for developers looking for teams, filter by expertise, and send them a pitch deck directly through the platform." },
  { q: "How do I host a local Node event?", a: "Active members can apply to become Node Leads. Once approved, you can host local meetups, sprints, and startup pitch sessions in your city with support from the global DevLinkHub network." }
];

// ─── 3D & MICRO-COMPONENTS ──────────────────────────────────────────────

function SpotlightCard({ children, className = "", accent = "#00F0FF" }: { children: React.ReactNode, className?: string, accent?: string }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div 
      onMouseMove={handleMouseMove} 
      className={`relative group overflow-hidden bg-[#050505] border border-white/5 rounded-[2rem] transition-colors duration-500 hover:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05)] ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition duration-500 group-hover:opacity-100 z-0"
        style={{ background: useMotionTemplate`radial-gradient(500px circle at ${mouseX}px ${mouseY}px, ${accent}15, transparent 40%)` }}
      />
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

function IsometricCard({ children, accent }: { children: React.ReactNode, accent: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0); y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative group cursor-pointer perspective-[2000px] w-full h-full"
    >
      <SpotlightCard accent={accent} className="h-full flex flex-col shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
        {children}
      </SpotlightCard>
    </motion.div>
  );
}

function SectionHeading({ title, subtitle, icon: Icon, color = "#00F0FF" }: { title: string, subtitle?: string, icon: any, color?: string }) {
  return (
    <div className="mb-16">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-widest uppercase mb-4 text-zinc-300 shadow-sm backdrop-blur-md">
        <Icon size={12} style={{ color }} /> {title}
      </div>
      {subtitle && <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tighter leading-tight max-w-3xl">{subtitle}</h2>}
    </div>
  );
}

// ─── DYNAMIC SUB-COMPONENT: REDESIGNED BUILDER CARD ──────────────────
function BuilderCard({ 
  builder, 
  pitchSent, 
  onSendPitch 
}: { 
  builder: typeof BUILDERS[0], 
  pitchSent: boolean, 
  onSendPitch: () => void 
}) {
  const [activeTab, setActiveTab] = useState<'about' | 'specs' | 'radar'>('about');
  
  const getAccentColor = (role: string) => {
    switch (role) {
      case "AI Engineer": return "#FF1CF7"; // Pink glow
      case "UI/UX Designer": return "#00FFA3"; // Green glow
      case "Fullstack Developer": return "#00F0FF"; // Cyan glow
      default: return "#7B61FF"; // Purple glow
    }
  };

  const getCodeOverlay = (role: string) => {
    switch (role) {
      case "AI Engineer":
        return `import torch\nimport langchain\n\nclass Agent:\n  def __init__(self, llm):\n    self.brain = llm\n    self.memory = []\n\n  def forward(self, state):\n    action = self.brain(state)\n    return action`;
      case "UI/UX Designer":
        return `<svg width="100" height="100">\n  <circle cx="50" cy="50" r="40" />\n  <line x1="10" y1="50" x2="90" y2="50" />\n  <rect x="20" y="20" width="60" height="60" />\n  <path d="M10,10 L90,90" />\n</svg>`;
      case "Fullstack Developer":
        return `import React from 'react';\n\nexport default function App() {\n  const [state, setState] = useState(null);\n  return (\n    <div className="flex h-screen">\n      <Sidebar />\n      <Dashboard />\n    </div>\n  );\n}`;
      case "Systems Engineer":
        return `fn main() -> Result<(), Error> {\n  let mut buffer = Vec::new();\n  unsafe {\n    let ptr = allocate(1024)?;\n    ptr.write(0xAA);\n  }\n  Ok(())\n}`;
      default:
        return `const devlinkhub = {\n  status: "available",\n  commitment: "fulltime",\n  role: "co-founder"\n};`;
    }
  };
  
  const accent = getAccentColor(builder.role);
  
  return (
    <SpotlightCard accent={accent} className="p-6 flex flex-col justify-between min-h-[420px] transition-all duration-300 relative group overflow-hidden bg-zinc-950/70 backdrop-blur-xl border-white/5 hover:border-white/10 hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
      {/* Visual Text/Code Overlays in background */}
      <pre 
        className="absolute inset-0 text-[7px] font-mono leading-[9px] text-zinc-700 opacity-[0.06] select-none pointer-events-none p-4 overflow-hidden z-0"
        style={{ 
          maskImage: "linear-gradient(to bottom, black, transparent)", 
          WebkitMaskImage: "linear-gradient(to bottom, black, transparent)" 
        }}
      >
        {getCodeOverlay(builder.role)}
      </pre>

      <div className="relative z-10 flex-1 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-lg relative border overflow-hidden"
                style={{ 
                  backgroundImage: `linear-gradient(135deg, ${accent}15, ${accent}30)`,
                  borderColor: `${accent}25`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent animate-pulse" />
                <span className="relative z-10 font-mono tracking-wider">{builder.avatar}</span>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#00FFA3] border-2 border-[#09090b] animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white leading-tight tracking-tight">{builder.name}</h4>
                <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{builder.role}</p>
              </div>
            </div>
            
            {/* Match Score */}
            <div className="flex flex-col items-end">
              <span 
                className="text-xs font-bold font-mono px-2 py-0.5 rounded-md border shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                style={{ 
                  color: accent,
                  borderColor: `${accent}30`,
                  backgroundColor: `${accent}10`
                }}
              >
                {builder.matchScore || 85}% Match
              </span>
              <span className="text-[7px] text-zinc-500 font-mono mt-1 uppercase tracking-widest">AI Score</span>
            </div>
          </div>
          
          {/* Card Tabs - Styled like code file tabs in IDE */}
          <div className="flex items-center bg-black/40 border border-white/5 p-0.5 rounded-lg mb-4 text-[9px] font-mono">
            <button 
              suppressHydrationWarning
              type="button"
              onClick={() => setActiveTab('about')}
              className={`flex-1 py-1.5 px-2 rounded-md transition-all cursor-pointer border-none flex items-center justify-center gap-1 ${activeTab === 'about' ? 'bg-white/5 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300 bg-transparent'}`}
            >
              <span style={{ color: activeTab === 'about' ? accent : '#52525b' }}>#</span> about.md
            </button>
            <button 
              suppressHydrationWarning
              type="button"
              onClick={() => setActiveTab('specs')}
              className={`flex-1 py-1.5 px-2 rounded-md transition-all cursor-pointer border-none flex items-center justify-center gap-1 ${activeTab === 'specs' ? 'bg-white/5 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300 bg-transparent'}`}
            >
              <span style={{ color: activeTab === 'specs' ? accent : '#52525b' }}>{'{ }'}</span> specs.json
            </button>
            <button 
              suppressHydrationWarning
              type="button"
              onClick={() => setActiveTab('radar')}
              className={`flex-1 py-1.5 px-2 rounded-md transition-all cursor-pointer border-none flex items-center justify-center gap-1 ${activeTab === 'radar' ? 'bg-white/5 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300 bg-transparent'}`}
            >
              <span style={{ color: activeTab === 'radar' ? accent : '#52525b' }}>$</span> radar.sh
            </button>
          </div>
          
          {/* Tab content */}
          <div className="min-h-[125px] flex flex-col justify-start">
            <AnimatePresence mode="wait">
              {activeTab === 'about' && (
                <motion.div
                  key="about"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                >
                  <p className="text-xs text-zinc-400 font-light leading-relaxed mb-4 min-h-[50px]">
                    {builder.bio}
                  </p>
                  
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {builder.skills.map((skill) => (
                      <span key={skill} className="text-[9px] font-mono text-zinc-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {activeTab === 'specs' && (
                <motion.div
                  key="specs"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-2 text-[11px] font-mono"
                >
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-zinc-500">PROJECT</span>
                    <span className="text-white font-bold">{builder.projectSpecs?.title || "Classified"}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-zinc-500">EQUITY RANGE</span>
                    <span className="text-white font-bold">{builder.projectSpecs?.equity || "Negotiable"}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-zinc-500">COMMITMENT</span>
                    <span className="text-white font-bold">{builder.projectSpecs?.commitment || "Flexible"}</span>
                  </div>
                </motion.div>
              )}
              
              {activeTab === 'radar' && (
                <motion.div
                  key="radar"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-3"
                >
                  {builder.techRadar?.map((radar, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-zinc-400 font-bold">{radar.label}</span>
                        <span className="text-zinc-500">{radar.value}%</span>
                      </div>
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full rounded-full" 
                          style={{ backgroundColor: accent }}
                          initial={{ width: 0 }}
                          animate={{ width: `${radar.value}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  )) || (
                    <div className="text-xs text-zinc-500 font-mono">Radar stats pending.</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/5">
          {builder.socials?.github && (
            <a 
              href={builder.socials.github} 
              target="_blank" 
              rel="noreferrer"
              className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <Github size={16} />
            </a>
          )}
          
          <button
            suppressHydrationWarning
            onClick={pitchSent ? undefined : onSendPitch}
            className={`flex-1 h-10 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 cursor-pointer ${
              pitchSent
                ? "bg-transparent border-[#00FFA3]/40 text-[#00FFA3] cursor-default"
                : "bg-white text-black border-white hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            }`}
          >
            {pitchSent ? (
              <>
                <CheckCircle2 size={13} className="text-[#00FFA3]" />
                Pitch Sent!
              </>
            ) : (
              "Send Pitch"
            )}
          </button>
        </div>
      </div>
    </SpotlightCard>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────

export default function CommunityEcosystemPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Interactive states
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("All");
  const [sentPitches, setSentPitches] = useState<string[]>([]);
  
  // Custom interactive states for Co-Founder Matcher
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [customBuilders, setCustomBuilders] = useState<typeof BUILDERS>([]);
  const [user, setUser] = useState<{ name: string; username: string; email: string } | null>(null);

  // Load initial states from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEvents = localStorage.getItem("devlinkhub_registered_events");
      if (storedEvents) setRegisteredEvents(JSON.parse(storedEvents));
      
      const storedPitches = localStorage.getItem("devlinkhub_sent_pitches");
      if (storedPitches) setSentPitches(JSON.parse(storedPitches));
      
      const storedBuilders = localStorage.getItem("devlinkhub_custom_builders");
      if (storedBuilders) setCustomBuilders(JSON.parse(storedBuilders));

      const storedUser = localStorage.getItem("devlinkhub_auth_user");
      if (storedUser) setUser(JSON.parse(storedUser));
    }
  }, []);

  // Save states to localStorage when they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("devlinkhub_registered_events", JSON.stringify(registeredEvents));
    }
  }, [registeredEvents]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("devlinkhub_sent_pitches", JSON.stringify(sentPitches));
    }
  }, [sentPitches]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("devlinkhub_custom_builders", JSON.stringify(customBuilders));
    }
  }, [customBuilders]);

  const handleLogout = () => {
    localStorage.removeItem("devlinkhub_auth_user");
    setUser(null);
  };

  const handleEventAction = (index: number) => {
    const storedUser = localStorage.getItem("devlinkhub_auth_user");
    if (!storedUser) {
      window.location.href = `/signin?redirect=${encodeURIComponent(`/community/register?type=event&id=${index}`)}`;
    } else {
      window.location.href = `/community/register?type=event&id=${index}`;
    }
  };

  const handlePitchAction = (builder: typeof BUILDERS[0]) => {
    const storedUser = localStorage.getItem("devlinkhub_auth_user");
    if (!storedUser) {
      window.location.href = `/signin?redirect=${encodeURIComponent(`/community/register?type=pitch&id=${encodeURIComponent(builder.name)}`)}`;
    } else {
      window.location.href = `/community/register?type=pitch&id=${encodeURIComponent(builder.name)}`;
    }
  };

  const handleProfileClick = () => {
    const storedUser = localStorage.getItem("devlinkhub_auth_user");
    if (!storedUser) {
      window.location.href = `/signin?redirect=${encodeURIComponent(`/onboarding`)}`;
    } else {
      window.location.href = `/onboarding`;
    }
  };

  const allBuilders = [...BUILDERS, ...customBuilders];
  const [showAllBuilders, setShowAllBuilders] = useState<boolean>(false);

  const filteredBuilders = allBuilders.filter(b => {
    const matchesRole = selectedRole === "All" || b.role === selectedRole;
    const matchesSearch = searchQuery === "" || 
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  const visibleBuilders = showAllBuilders ? filteredBuilders : filteredBuilders.slice(0, 3);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -300]);

  const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } } as const;
  const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } } as const;

  return (
    <div ref={containerRef} className="min-h-screen bg-[#000000] text-zinc-300 font-sans selection:bg-[#7B61FF]/30 relative overflow-hidden">
      
      {/* ─── GLOBAL AMBIENT LAYER ─── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-overlay" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_20%,transparent_100%)]" />
      </div>

      <main className="relative z-10 w-full">
        
        {/* ─── 1. HERO SECTION (Massive 3D Floating Ecosystem) ─── */}
        <section className="relative z-10 w-full min-h-screen pt-32 pb-24 flex items-center perspective-[2000px]">
          {/* Deep Background Glows */}
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[500px] bg-[#00F0FF]/[0.08] blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
          <div className="absolute top-[20%] right-[-10%] w-[60vw] h-[600px] bg-[#FF1CF7]/[0.08] blur-[150px] rounded-full mix-blend-screen pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />

          <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center w-full relative z-10">
            
            {/* ─── LEFT: COPY & CTA ─── */}
            <motion.div initial="hidden" animate="visible" variants={stagger} className="lg:col-span-5 max-w-xl z-20">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[#00FFA3]/20 bg-[#00FFA3]/5 backdrop-blur-md mb-8 shadow-[0_0_20px_rgba(0,255,163,0.1)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FFA3] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FFA3]" />
                </span>
                <span className="text-xs font-bold text-[#00FFA3] tracking-wide">1,204 Builders Online</span>
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-6xl sm:text-7xl lg:text-[5.5rem] font-extrabold tracking-tighter leading-[1.02] text-white mb-6 drop-shadow-2xl">
                The Community<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#FF1CF7] to-[#7B61FF]">
                  Ecosystem.
                </span>
              </motion.h1>
              
              <motion.p variants={fadeUp} className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed mb-10 max-w-[480px]">
                Stop coding in isolation. Join an elite network of developers, find technical co-founders, and ship massive startups together.
              </motion.p>
              
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-6">
                {user ? (
                  <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-5 py-3.5 rounded-full backdrop-blur-md shadow-2xl">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#00F0FF] to-[#7B61FF] flex items-center justify-center text-white font-bold font-mono text-xs">
                      {user.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs text-white font-bold leading-tight">{user.name}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">@{user.username}</span>
                    </div>
                    <button 
                      suppressHydrationWarning
                      onClick={handleLogout}
                      className="ml-2 px-3 py-1.5 rounded-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-mono text-[9px] font-bold cursor-pointer transition-all"
                    >
                      Log Out
                    </button>
                  </div>
                ) : (
                  <button 
                    suppressHydrationWarning
                    onClick={() => { window.location.href = "/join" }}
                    className="w-full sm:w-auto h-14 px-8 rounded-full bg-white text-black font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <Github size={18} /> Join & Sign In
                  </button>
                )}
                <button 
                  suppressHydrationWarning
                  onClick={() => {
                    const el = document.getElementById("guilds-section");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full sm:w-auto h-14 px-8 rounded-full border border-white/10 bg-black/50 backdrop-blur-xl text-white font-medium text-sm hover:bg-white/5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Explore Guilds
                </button>
              </motion.div>

              {/* Futuristic Mini-Terminal Telemetry widget */}
              <motion.div variants={fadeUp} className="mt-12 bg-black/60 border border-white/10 rounded-2xl p-5 font-mono text-xs text-[#00FFA3] max-w-md shadow-2xl relative group overflow-hidden">
                <div className="absolute inset-0 bg-[#00FFA3]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="flex items-center gap-1.5 mb-3 border-b border-white/5 pb-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                  <span className="text-[10px] text-zinc-500 ml-2">devlinkhub-agent v1.0.4</span>
                </div>
                <div className="space-y-1.5">
                  <p className="text-zinc-500">&gt; devlinkhub --version</p>
                  <p className="text-zinc-400">DevLinkHub Core CLI v2.4.0-beta</p>
                  <p className="text-zinc-500">&gt; status --nodes</p>
                  <p className="text-[#00F0FF]">✔ Bengaluru, Mumbai, SF, London nodes active</p>
                  <p className="text-[#FF1CF7]">⚡ Upcoming Sprint: Syntax Weavers Hackathon starts in 2 days</p>
                </div>
              </motion.div>
            </motion.div>

            {/* ─── RIGHT: MASSIVE 3D FLOATING ARCHITECTURE ─── */}
            <div className="lg:col-span-7 relative h-[700px] w-full hidden lg:block z-10">
              <div className="absolute inset-0 flex items-center justify-center transform-gpu preserve-3d" style={{ transform: "rotateX(20deg) rotateY(-20deg) scale(1.1)" }}>
                
                {/* 1. CENTRAL AI/ECOSYSTEM CORE */}
                <motion.div style={{ y: y1 }} className="absolute z-30 flex flex-col items-center justify-center">
                  <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} className="relative">
                    <div className="absolute top-8 left-8 w-56 h-56 bg-zinc-900/30 border border-white/5 rounded-[2rem] transform -translate-z-24 blur-[8px]" />
                    <div className="absolute top-4 left-4 w-56 h-56 bg-zinc-900/50 border border-white/5 rounded-[2rem] transform -translate-z-12 blur-[2px]" />
                    
                    <div className="relative w-56 h-56 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] flex flex-col items-center justify-center shadow-[0_0_80px_rgba(255,28,247,0.2)] group overflow-hidden">
                      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                      <Sparkles size={48} className="text-[#FF1CF7] mb-4 drop-shadow-[0_0_15px_rgba(255,28,247,0.8)] relative z-10" />
                      <span className="text-white font-bold text-lg relative z-10">Global Guild Hub</span>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-widest mt-2 border border-white/10 px-3 py-1 rounded-full relative z-10 bg-white/5">Network Active</span>
                    </div>
                  </motion.div>
                </motion.div>

                {/* 2. LEFT FLOATING NODES */}
                <motion.div style={{ y: y2 }} className="absolute -left-20 top-20 z-40 flex flex-col gap-6">
                  {[
                    { name: "Frontend Sprint", icon: Laptop, color: "text-[#00F0FF]" },
                    { name: "AI Hackathon", icon: Terminal, color: "text-[#FF1CF7]" }
                  ].map((item, i) => (
                    <motion.div 
                      key={item.name} 
                      animate={{ x: [0, -10, 0] }} 
                      transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: i }}
                      className="flex items-center gap-4 bg-zinc-950/90 border border-white/10 backdrop-blur-xl px-6 py-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] relative"
                    >
                      <div className="absolute -right-20 top-1/2 w-20 border-t border-dashed border-white/20 -z-10" />
                      <div className="p-2.5 bg-white/5 rounded-xl"><item.icon size={20} className={item.color} /></div>
                      <div>
                        <div className="text-sm font-bold text-zinc-200">{item.name}</div>
                        <div className="text-[10px] text-[#00FFA3] flex items-center gap-1 mt-1"><Users size={12}/> Forming Teams</div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* 3. RIGHT FLOATING NODES */}
                <motion.div style={{ y: y3 }} className="absolute -right-12 -top-10 z-20 flex flex-col gap-5">
                  {[
                    { text: "PR #142 Merged", author: "@alex_j", icon: GitCommit, color: "#00F0FF" },
                    { text: "Repo Forked", author: "@sarah", icon: GitFork, color: "#7B61FF" }
                  ].map((event, i) => (
                    <motion.div 
                      key={i} 
                      animate={{ x: [0, 10, 0] }} 
                      transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: i * 1.5 }}
                      className="flex items-center gap-4 bg-[#0A0A0A] border border-white/10 px-6 py-3.5 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.8)] relative"
                    >
                      <div className="absolute -left-16 top-1/2 w-16 border-t border-dashed border-white/20 -z-10" />
                      <event.icon size={16} style={{ color: event.color }} />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white">{event.text}</span>
                        <span className="text-[10px] text-zinc-500 mt-0.5">{event.author}</span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* MASSIVE CONNECTING RINGS */}
                <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 60, ease: "linear" }} className="absolute w-[500px] h-[500px] border border-[#00F0FF]/20 rounded-full border-dashed shadow-[0_0_30px_rgba(0,240,255,0.1)]" />
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 90, ease: "linear" }} className="absolute w-[750px] h-[750px] border border-[#7B61FF]/10 rounded-full" />
                <motion.div animate={{ rotate: 180 }} transition={{ repeat: Infinity, duration: 120, ease: "linear" }} className="absolute w-[1000px] h-[1000px] border border-[#FF1CF7]/10 rounded-full border-dashed" />
              </div>
            </div>
          </div>
        </section>

        {/* ─── 2. FLOATING METRICS TICKER ─── */}
        <section className="relative z-30 -mt-10 mb-32 px-6">
          <div className="max-w-[1400px] mx-auto">
            <div className="w-full bg-[#0A0A0A]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] py-6 overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)]">
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
                {METRICS.map((metric, i) => (
                  <div key={i} className="flex flex-col items-center justify-center text-center px-4 group cursor-default">
                    <div className="flex items-center gap-2 mb-2">
                      <metric.icon size={18} style={{ color: metric.color }} className="opacity-80 group-hover:opacity-100 transition-opacity" />
                      {metric.pulse && <span className="w-1.5 h-1.5 rounded-full bg-[#00FFA3] animate-pulse" />}
                    </div>
                    <span className="text-3xl font-bold text-white tracking-tighter">{metric.value}</span>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── 3. ALL GUILDS (Massive 3x2 Grid) ─── */}
        <section id="guilds-section" className="py-32 px-6 max-w-[1400px] mx-auto relative z-20">
          <SectionHeading 
            title="Specialized Networks" 
            subtitle="Find your tribe. Join specialized micro-communities for your exact tech stack." 
            icon={Blocks} 
            color="#FF1CF7" 
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {GUILDS.map((guild, i) => {
              const isFounders = guild.name === "Founders Network";
              return (
                <SpotlightCard 
                  key={i} 
                  accent={guild.color} 
                  className={`p-8 flex flex-col group cursor-pointer border ${
                    isFounders 
                      ? "border-amber-500/30 bg-gradient-to-b from-amber-950/15 via-black to-black shadow-[0_10px_30px_rgba(245,158,11,0.05)]" 
                      : "border-white/5"
                  }`}
                >
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-black border border-white/10 flex items-center justify-center shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] group-hover:-translate-y-1 transition-transform duration-300">
                      <guild.icon size={28} style={{ color: guild.color }} className="drop-shadow-[0_0_15px_currentColor]" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-[10px] font-bold text-zinc-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                        {isFounders && <span className="text-amber-400">★ Accelerator Hub</span>}
                        {guild.members} Members
                      </span>
                      <span className="text-[10px] font-bold text-[#00FFA3] bg-[#00FFA3]/10 border border-[#00FFA3]/20 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00FFA3] animate-pulse"/> {guild.online} Online
                      </span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
                    {guild.name}
                  </h3>
                  <p className="text-sm text-zinc-400 font-light leading-relaxed flex-1 mb-8">{guild.desc}</p>
                  <button 
                    suppressHydrationWarning
                    onClick={() => {
                      const storedUser = localStorage.getItem("devlinkhub_auth_user");
                      if (!storedUser) {
                        window.location.href = `/signin?redirect=${encodeURIComponent(`/onboarding`)}`;
                      } else {
                        window.location.href = `/onboarding`;
                      }
                    }}
                    className="text-sm font-bold flex items-center gap-2 w-fit cursor-pointer text-white hover:opacity-85 transition-opacity"
                  >
                    <span 
                      className="text-transparent bg-clip-text"
                      style={{ backgroundImage: `linear-gradient(to right, #FFFFFF, ${guild.color})` }}
                    >
                      Join Guild
                    </span>
                    <ArrowRight size={16} className="text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </button>
                </SpotlightCard>
              );
            })}
          </div>
        </section>

        {/* ─── 4. ECOSYSTEM PULSE (Terminal Activity Feed) ─── */}
        <section className="py-32 px-6 relative z-20">
          {/* Edge-to-edge dark section */}
          <div className="absolute inset-0 bg-[#030303] border-y border-white/5 z-0" />
          <div className="max-w-[1200px] mx-auto relative z-10">
            <SectionHeading 
              title="Live Telemetry" 
              subtitle="Real-time ecosystem events: deployments, merges, and team formations." 
              icon={Activity} 
              color="#00FFA3" 
            />
            
            <div className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-[0_30px_100px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.05)]">
              {/* Terminal Header */}
              <div className="flex items-center gap-2 mb-10 border-b border-white/10 pb-6">
                <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56]/80" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E]/80" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F]/80" />
                <span className="ml-4 text-sm font-mono text-zinc-500">devlinkhub-os ~/pulse --watch</span>
              </div>

              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[23px] before:h-full before:w-px before:bg-gradient-to-b before:from-[#00FFA3]/50 before:via-white/10 before:to-transparent">
                {FEED.map((item, i) => (
                  <div key={item.id} className="relative flex items-start gap-8 group cursor-default">
                    <div className="absolute left-[-5px] w-12 h-12 rounded-xl border border-white/10 bg-black flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.6)] z-10 transition-transform duration-300 group-hover:scale-110">
                      <item.icon size={18} style={{ color: item.color }} className="drop-shadow-[0_0_10px_currentColor]" />
                    </div>
                    <div className="pl-16 w-full flex flex-col md:flex-row md:items-center justify-between bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-2xl p-5 transition-colors">
                      <div>
                        <h4 className="text-base text-zinc-300 font-light mb-1">
                          <span className="font-bold text-white">{item.user}</span> {item.action}.
                        </h4>
                        <p className="text-xs font-mono text-zinc-500">{item.details}</p>
                      </div>
                      <span className="text-[11px] font-mono text-zinc-600 uppercase tracking-widest mt-4 md:mt-0">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── 5. PROJECT SHOWCASE (3D Isometric IDE Mockups) ─── */}
        <section className="py-32 px-6 max-w-[1400px] mx-auto relative z-20">
           <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
             <SectionHeading 
                title="Proof of Work" 
                subtitle="Explore real startups and open-source infrastructure built by members." 
                icon={Code2} 
                color="#F59E0B" 
             />
             <button 
               suppressHydrationWarning
               className="h-12 px-6 rounded-xl border border-white/10 bg-white/5 text-white text-sm font-bold hover:bg-white/10 transition-colors flex items-center gap-2 group cursor-pointer"
             >
               View Directory <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
             </button>
           </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PROJECTS.map((proj, i) => (
              <IsometricCard key={i} accent={proj.color}>
                {/* Visual: Mini IDE Top Half */}
                <div className="h-64 relative bg-gradient-to-b from-[#0A0A0A] to-[#050505] border-b border-white/10 p-8 overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-48 h-48 blur-[60px] rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-700" style={{ backgroundColor: proj.color }} />
                  
                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#FF5F56]/30 border border-[#FF5F56]/50" />
                      <div className="w-3 h-3 rounded-full bg-[#FFBD2E]/30 border border-[#FFBD2E]/50" />
                      <div className="w-3 h-3 rounded-full bg-[#27C93F]/30 border border-[#27C93F]/50" />
                    </div>
                    <div className="bg-black/80 border border-white/10 px-3 py-1.5 rounded-md shadow-lg flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: proj.color }} />
                      <span className="text-[9px] font-bold text-white uppercase tracking-widest">{proj.status}</span>
                    </div>
                  </div>

                  <div className="font-mono text-xs leading-loose relative z-10 mt-auto">
                    <div className="text-zinc-600 mb-2">{"// deploy.ts"}</div>
                    <div><span className="text-[#FF1CF7]">export const</span> <span className="text-white font-bold">{proj.title.toLowerCase()}</span> <span className="text-[#00F0FF]">=</span> {`{`}</div>
                    <div className="pl-4"><span className="text-zinc-400">repo:</span> <span className="text-[#00FFA3]">"@{proj.contributors[0]}"</span>,</div>
                    <div className="pl-4"><span className="text-zinc-400">status:</span> <span style={{ color: proj.color }}>"Active"</span></div>
                    <div>{`}`}</div>
                  </div>
                </div>

                {/* Bottom Half: Details */}
                <div className="p-8 flex flex-col flex-1 bg-[#050505]">
                  <h3 className="text-2xl font-bold bg-clip-text text-white group-hover:text-transparent transition-colors duration-300 w-fit mb-3" style={{ backgroundImage: `linear-gradient(to right, #FFFFFF, ${proj.color})` }}>
                    {proj.title}
                  </h3>
                  <p className="text-zinc-400 text-sm font-light leading-relaxed mb-8 flex-1">{proj.desc}</p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-white/10">
                    <div className="flex gap-2">
                      {proj.tech.map(t => <span key={t} className="text-[10px] font-bold text-zinc-300 bg-white/10 px-3 py-1.5 rounded-lg border border-white/5">{t}</span>)}
                    </div>
                    <Github size={20} className="text-zinc-500 group-hover:text-white transition-colors animate-none" />
                  </div>
                </div>
              </IsometricCard>
            ))}
          </div>
        </section>

        {/* ─── 6. EVENTS & HACKATHONS (Bento Grid Layout) ─── */}
        <section className="py-32 px-6 max-w-[1400px] mx-auto relative z-20">
          <SectionHeading 
            title="Events & Hackathons" 
            subtitle="Engage in live building challenges, workshops, and node pitch nights." 
            icon={Calendar} 
            color="#FF1CF7" 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[240px]">
            {/* 1. Featured Hackathon (spans 2 cols, 2 rows) */}
            <div className="md:col-span-2 md:row-span-2 h-full">
              <SpotlightCard accent="#FF1CF7" className="p-8 flex flex-col justify-between h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF1CF7]/10 blur-[100px] rounded-full pointer-events-none" />
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-[#FF1CF7]/30 bg-[#FF1CF7]/10 text-[#FF1CF7]">
                      Featured Hackathon
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">Oct 22 • Bhopal Node</span>
                    <span className="text-[10px] font-bold text-[#00FFA3] bg-[#00FFA3]/10 px-2.5 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
                      ⚡ Starts in 48h
                    </span>
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight leading-tight">
                    {EVENTS[0].title}
                  </h3>
                  <p className="text-zinc-400 text-sm font-light leading-relaxed max-w-xl mb-6">
                    Join developers, founders, and designers for a 48-hour sprint in Bhopal. Form teams, build web applications, and pitch to leading tech VCs.
                  </p>
                  
                  <div className="flex flex-wrap gap-2.5 mb-8">
                    {["$5,000+ Prize Pool", "VC Panel Pitching", "AI & Web3 Tracks", "Mentorship Sessions"].map((highlight) => (
                      <span key={highlight} className="text-xs font-medium text-zinc-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                        <Trophy size={12} className="text-[#FF1CF7]" />
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button 
                    suppressHydrationWarning
                    onClick={() => handleEventAction(0)}
                    className={`w-full sm:w-auto h-12 px-8 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                      registeredEvents.includes(0)
                        ? "bg-[#00FFA3]/10 border-[#00FFA3]/30 text-[#00FFA3]" 
                        : "bg-white text-black border-white hover:scale-[1.02] active:scale-[0.98]"
                    }`}
                  >
                    {registeredEvents.includes(0) ? (
                      <>
                        <CheckCircle2 size={14} /> Registered
                      </>
                    ) : (
                      <>
                        <Plus size={14} /> Register Now
                      </>
                    )}
                  </button>
                  <span className="text-xs text-zinc-500 font-mono">342 builders registered already</span>
                </div>
              </SpotlightCard>
            </div>

            {/* 2. AI Agriculture Summit (col-span-1, row-span-1) */}
            <div className="md:col-span-1 md:row-span-1 h-full">
              <SpotlightCard accent="#00FFA3" className="p-6 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-[#00FFA3]/30 bg-[#00FFA3]/10 text-[#00FFA3]">
                      {EVENTS[1].type}
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">{EVENTS[1].date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 leading-snug">{EVENTS[1].title}</h3>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed mb-4">
                    Exploring precision farming & agentic AI integration.
                  </p>
                </div>
                
                <button 
                  suppressHydrationWarning
                  onClick={() => handleEventAction(1)}
                  className={`w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                    registeredEvents.includes(1)
                      ? "bg-[#00FFA3]/10 border-[#00FFA3]/30 text-[#00FFA3]" 
                      : "bg-white/5 border-white/10 text-white hover:bg-white/10 active:scale-[0.98]"
                  }`}
                >
                  {registeredEvents.includes(1) ? <><CheckCircle2 size={14} /> Registered</> : <><Plus size={14} /> Join Session</>}
                </button>
              </SpotlightCard>
            </div>

            {/* 3. Open Source Contrib Night (col-span-1, row-span-1) */}
            <div className="md:col-span-1 md:row-span-1 h-full">
              <SpotlightCard accent="#00F0FF" className="p-6 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-[#00F0FF]/30 bg-[#00F0FF]/10 text-[#00F0FF]">
                      {EVENTS[2].type}
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">{EVENTS[2].date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 leading-snug">{EVENTS[2].title}</h3>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed mb-4">
                    Learn how to submit PRs to major devlinkhub open-source core modules.
                  </p>
                </div>
                
                <button 
                  suppressHydrationWarning
                  onClick={() => handleEventAction(2)}
                  className={`w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                    registeredEvents.includes(2)
                      ? "bg-[#00FFA3]/10 border-[#00FFA3]/30 text-[#00FFA3]" 
                      : "bg-white/5 border-white/10 text-white hover:bg-white/10 active:scale-[0.98]"
                  }`}
                >
                  {registeredEvents.includes(2) ? <><CheckCircle2 size={14} /> Registered</> : <><Plus size={14} /> RSVP Now</>}
                </button>
              </SpotlightCard>
            </div>

            {/* 4. Founders Pitch Session (spans 2 cols, 1 row) */}
            <div className="md:col-span-2 md:row-span-1 h-full">
              <SpotlightCard accent="#F59E0B" className="p-6 flex flex-col justify-between h-full bg-gradient-to-r from-black via-[#0E0B05] to-black">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-500">
                        {EVENTS[3].type}
                      </span>
                      <span className="text-xs text-zinc-500 font-mono">Nov 20 • Virtual Stage</span>
                      <span className="text-[9px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md flex items-center gap-1 border border-amber-400/20">
                        Live Pitch
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{EVENTS[3].title}</h3>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed max-w-xl">
                      Early-stage startup teams pitch to a panel of venture capitalists and angels. Receive live feedback and raise pre-seed capital.
                    </p>
                  </div>
                  
                  {/* Visual VC Avatar Group Mockup */}
                  <div className="flex items-center gap-3 shrink-0 bg-white/5 border border-white/10 px-4 py-3 rounded-xl">
                    <div className="flex -space-x-2">
                      {["XV", "AC", "NX"].map((initial, idx) => (
                        <div 
                          key={idx} 
                          className={`w-7 h-7 rounded-full border border-black flex items-center justify-center text-[9px] font-bold text-white shadow-md ${
                            idx === 0 ? "bg-red-500/80" : idx === 1 ? "bg-[#3861FB]" : "bg-purple-600"
                          }`}
                        >
                          {initial}
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col font-mono text-[9px]">
                      <span className="text-zinc-500 font-bold uppercase">PANEL VCS</span>
                      <span className="text-zinc-200">Peak XV • Accel • Nexus</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4">
                  <span className="text-xs text-zinc-500 font-mono">Registration closes Nov 18</span>
                  <button 
                    suppressHydrationWarning
                    onClick={() => handleEventAction(3)}
                    className={`px-6 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                      registeredEvents.includes(3)
                        ? "bg-[#00FFA3]/10 border-[#00FFA3]/30 text-[#00FFA3]" 
                        : "bg-amber-500 text-black border-amber-500 hover:scale-[1.02] active:scale-[0.98]"
                    }`}
                  >
                    {registeredEvents.includes(3) ? <><CheckCircle2 size={14} /> Registered</> : <><Plus size={14} /> Pitch Signup</>}
                  </button>
                </div>
              </SpotlightCard>
            </div>

            {/* 5. Host Local Node Card (spans 1 col, 1 row) */}
            <div className="md:col-span-1 md:row-span-1 h-full">
              <SpotlightCard accent="#7B61FF" className="p-6 flex flex-col justify-between h-full border border-dashed border-[#7B61FF]/30 bg-gradient-to-b from-[#7B61FF]/5 to-transparent">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-[#7B61FF]/30 bg-[#7B61FF]/10 text-[#7B61FF]">
                      Node Program
                    </span>
                    <Globe size={14} className="text-zinc-500" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 leading-snug">Host a Local Event</h3>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed mb-4">
                    Want to run a DevLinkHub meetup or hackathon node in your city? Become a Node Lead.
                  </p>
                </div>
                
                <button suppressHydrationWarning className="w-full py-3 rounded-xl text-xs font-bold transition-all bg-[#7B61FF]/20 hover:bg-[#7B61FF]/30 border border-[#7B61FF]/40 text-[#7B61FF] flex items-center justify-center gap-2 cursor-pointer">
                  Apply to Host <ArrowRight size={12} />
                </button>
              </SpotlightCard>
            </div>
          </div>
        </section>

        {/* ─── 7. CO-FOUNDER & TEAM MATCHER (Interactive Board) ─── */}
        <section className="py-32 px-6 relative z-20">
          <div className="absolute inset-0 bg-[#030303] border-y border-white/5 z-0" />
          
          <div className="max-w-[1400px] mx-auto relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
              <SectionHeading 
                title="Co-Founder Matcher" 
                subtitle="Connect with builders looking for teams, co-founders, or contributors." 
                icon={UserPlus} 
                color="#00F0FF" 
              />
              
              {/* Category Filter Pills & Search Input */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-4 lg:mb-0 w-full lg:w-auto">
                <div className="relative">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    suppressHydrationWarning
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name, bio, or skills..."
                    className="w-full sm:w-80 h-11 pl-11 pr-4 rounded-xl border border-white/10 bg-black/60 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#00F0FF]/50 transition-colors"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {["All", "AI Engineer", "UI/UX Designer", "Fullstack Developer", "Systems Engineer"].map((role) => (
                    <button
                      suppressHydrationWarning
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`px-4 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                        selectedRole === role
                          ? "bg-white text-black border-white"
                          : "bg-black/50 border-white/10 text-zinc-400 hover:text-white"
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {visibleBuilders.map((builder, i) => {
                const pitchSent = sentPitches.includes(builder.name);
                return (
                  <BuilderCard 
                    key={i}
                    builder={builder}
                    pitchSent={pitchSent}
                    onSendPitch={() => handlePitchAction(builder)}
                  />
                );
              })}

              {/* Add Profile Dashboard Card */}
              {searchQuery === "" && (
                <SpotlightCard accent="#7B61FF" className={`p-6 flex flex-col justify-between min-h-[420px] border border-dashed border-[#7B61FF]/30 bg-zinc-950/40 hover:bg-zinc-950/70 backdrop-blur-xl hover:border-white/10 hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-all duration-300 relative group overflow-hidden ${
                  showAllBuilders ? "md:col-span-2 lg:col-span-4" : ""
                }`}>
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(123,97,255,0.05),transparent)] pointer-events-none" />
                  
                  {showAllBuilders ? (
                    <div className="flex flex-col lg:flex-row items-center justify-between w-full h-full relative z-10 gap-6 py-6 px-4">
                      <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                        <div className="w-16 h-16 rounded-2xl border border-dashed border-[#7B61FF]/40 flex items-center justify-center text-[#7B61FF] bg-[#7B61FF]/5 shrink-0 group-hover:scale-110 group-hover:border-[#7B61FF]/60 transition-transform duration-300">
                          <Plus size={28} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white mb-1.5 tracking-tight">Join the Board</h3>
                          <p className="text-xs text-zinc-400 font-light leading-relaxed max-w-xl">
                            List your skills, project equity, and bio so co-founders can pitch outreach ideas directly. Create your profile to join DevLinkHub's verified matching pool.
                          </p>
                        </div>
                      </div>
                      <button 
                        suppressHydrationWarning
                        onClick={handleProfileClick}
                        className="w-full lg:w-56 py-3.5 rounded-xl text-xs font-bold transition-all bg-[#7B61FF]/20 hover:bg-[#7B61FF]/30 border border-[#7B61FF]/40 text-[#7B61FF] flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_0_15px_rgba(123,97,255,0.2)] shrink-0"
                      >
                        Add Your Profile
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col items-center justify-center text-center my-auto py-12 relative z-10">
                        <div className="w-16 h-16 rounded-2xl border border-dashed border-[#7B61FF]/40 flex items-center justify-center text-[#7B61FF] bg-[#7B61FF]/5 mb-6 group-hover:scale-110 group-hover:border-[#7B61FF]/60 transition-transform duration-300">
                          <Plus size={28} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2 tracking-tight">Join the Board</h3>
                        <p className="text-xs text-zinc-400 font-light leading-relaxed max-w-[210px]">
                          List your skills, project equity, and bio so co-founders can pitch outreach ideas directly.
                        </p>
                      </div>
                      
                      <button 
                        suppressHydrationWarning
                        onClick={handleProfileClick}
                        className="w-full py-3 rounded-xl text-xs font-bold transition-all bg-[#7B61FF]/20 hover:bg-[#7B61FF]/30 border border-[#7B61FF]/40 text-[#7B61FF] flex items-center justify-center gap-1.5 cursor-pointer relative z-10 hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_0_15px_rgba(123,97,255,0.2)]"
                      >
                        Add Your Profile
                      </button>
                    </>
                  )}
                </SpotlightCard>
              )}
            </div>

            {/* View More / Show Less Toggle Button */}
            {filteredBuilders.length > 3 && (
              <div className="flex justify-center mt-12 w-full">
                <button 
                  suppressHydrationWarning
                  onClick={() => setShowAllBuilders(!showAllBuilders)}
                  className="px-8 py-3.5 rounded-full border border-white/10 bg-white/5 text-white font-bold text-xs hover:bg-white/10 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                >
                  {showAllBuilders ? (
                    <>Show Less Profiles <ChevronDown size={14} className="rotate-180 transition-transform duration-300" /></>
                  ) : (
                    <>View More Profiles <ChevronDown size={14} className="transition-transform duration-300" /></>
                  )}
                </button>
              </div>
            )}
          </div>

        </section>

        {/* ─── 8. KNOWLEDGE BASE & FAQ ─── */}
        <section className="py-32 px-6 max-w-[1400px] mx-auto border-t border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Left Column: Resources */}
            <div className="lg:col-span-5">
              <SectionHeading 
                title="Resources" 
                subtitle="Everything you need to ship products and learn." 
                icon={BookOpen} 
                color="#00FFA3" 
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {RESOURCES.map((res, i) => (
                  <SpotlightCard key={i} className="p-6 flex items-start gap-4 cursor-pointer hover:-translate-y-1 transition-all" accent="#00FFA3">
                    <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <res.icon size={18} className="text-white" />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-wider">{res.category}</span>
                      <h4 className="text-sm font-bold text-white mt-1 mb-1">{res.title}</h4>
                      <p className="text-xs text-zinc-400 font-light leading-relaxed">{res.desc}</p>
                    </div>
                  </SpotlightCard>
                ))}
              </div>
            </div>

            {/* Right Column: FAQ */}
            <div className="lg:col-span-7">
              <SectionHeading 
                title="FAQ" 
                subtitle="Frequently Asked Questions" 
                icon={Shield} 
                color="#7B61FF" 
              />
              
              <div className="flex flex-col gap-4">
                {FAQS.map((faq, i) => (
                  <div key={i} className="border border-white/10 rounded-2xl bg-black/40 backdrop-blur-xl overflow-hidden shadow-xl">
                    <button 
                      suppressHydrationWarning
                      onClick={() => setOpenFaq(openFaq === i ? null : i)} 
                      className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <span className="text-base font-bold text-white">{faq.q}</span>
                      <ChevronDown size={20} className={`text-zinc-500 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }} 
                          animate={{ height: "auto", opacity: 1 }} 
                          exit={{ height: 0, opacity: 0 }} 
                          className="px-8 pb-6 text-sm text-zinc-400 font-light leading-relaxed border-t border-white/5 pt-4"
                        >
                          {faq.a}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── 9. FINAL MASSIVE CTA ─── */}
        <section className="py-40 px-6 relative overflow-hidden bg-black w-full z-20">
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
            <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.08, 0.05] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute w-[800px] h-[500px] bg-[#FF1CF7] blur-[180px] rounded-full" />
            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.03, 0.06, 0.03] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute w-[600px] h-[400px] bg-[#00F0FF] blur-[150px] rounded-full translate-x-32" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto">
            <SpotlightCard className="p-12 md:p-20 text-center relative overflow-hidden bg-zinc-950/70 backdrop-blur-xl border-white/5 hover:border-white/10" accent="#7B61FF">
              {/* Grid pattern background detail */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
              
              {/* Telemetry/Code Backdrops */}
              <pre 
                className="absolute inset-0 text-[7px] font-mono leading-[9px] text-zinc-800 opacity-[0.06] select-none pointer-events-none p-8 overflow-hidden text-left z-0"
                style={{ 
                  maskImage: "radial-gradient(circle at center, transparent 20%, black 80%)", 
                  WebkitMaskImage: "radial-gradient(circle at center, transparent 20%, black 80%)" 
                }}
              >
                {`[LOG] Initializing DevLinkHub cluster connection...\n[LOG] Synchronizing nodes: Berlin, Bhopal, Bangalore, SF...\n[LOG] Running structural compatibility model v4.2.1-prod...\n[LOG] Match rate optimization algorithm triggered.\n[LOG] Core contribution protocol: ONLINE.\n[LOG] Active builders in session: 15,482.\n[LOG] Mainnet block consensus achieved. Epoch 1042.\n[LOG] Webhooks active for: discord.gg/devlinkhub-node.\n[LOG] Security credentials: JWT-SHA256 signature verified.\n[LOG] Listening for incoming pitches on socket port 8080...\n[LOG] Compiler target: ESNext.\n[LOG] Execution telemetry metrics: SUCCESS.\n[LOG] System health check: 100% stable.`}
              </pre>

              <div className="relative z-10 flex flex-col items-center space-y-8">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                  <Network size={28} className="text-white drop-shadow-lg" />
                </div>

                <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-white leading-tight">
                  Ready to <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#FF1CF7] to-[#7B61FF]">
                    Build Together?
                  </span>
                </h2>
                
                <p className="text-sm md:text-base text-zinc-400 max-w-xl mx-auto font-light leading-relaxed">
                  Join thousands of builders creating products, accelerating startups, and engineering open source systems.
                </p>

                <div className="pt-6 w-full flex justify-center">
                  <button 
                    suppressHydrationWarning
                    onClick={handleProfileClick}
                    className="w-full sm:w-auto h-14 px-10 rounded-full bg-white text-black font-bold text-sm hover:bg-black hover:text-white hover:border-white/20 border border-transparent hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_35px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(123,97,255,0.5)] flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <Github size={18} /> Claim Your Profile
                    <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
                  </button>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </section>

      </main>
    </div>
  );
}