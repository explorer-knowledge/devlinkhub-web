"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useMotionTemplate, useMotionValue, Variants } from "framer-motion";
import { 
  Terminal, Users, Zap, Rocket, ArrowRight, ArrowUpRight,
  Network, Github, GitFork, Star, GitCommit, Code2, Globe,
  Blocks, Trophy, MessageSquare, Sparkles,
  Laptop, Shield, Fingerprint, Activity,
  X, CheckCircle2, GitMerge, LayoutTemplate, Cpu, Database, Timer
} from "lucide-react";

// ─── DATA ────────────────────────────────────────────────────────

const STATS = [
  { label: "Elite Builders", value: "15.4k", icon: Users, color: "#00F0FF" },
  { label: "Code Commits", value: "1.2M+", icon: GitCommit, color: "#FF1CF7" },
  { label: "Live Startups", value: "320+", icon: Rocket, color: "#00FFA3" },
  { label: "Global Nodes", value: "48", icon: Globe, color: "#7B61FF" }
];

const LIVE_EVENTS = [
  "🔥 @rishi just merged a PR into NexusAuth",
  "🚀 Team 'SyntaxWeavers' just launched their MVP",
  "⚡ @elena joined the Frontend Guild",
  "🏆 @alex_j won 1st place in the Global Sprint",
  "💻 4 new builders joined the open-source lobby"
];

const PROJECTS = [
  { title: "QuantumStore", desc: "Decentralized state management for React.", tech: ["Rust", "Wasm"], stars: 1240, forks: 342, author: "alex_j", color: "#00F0FF" },
  { title: "NexusAuth", desc: "Zero-config OAuth 2.0 microservice.", tech: ["Next.js", "OAuth"], stars: 890, forks: 156, author: "sarah_ux", color: "#7B61FF" },
  { title: "EtherFlow", desc: "Visual smart contract builder.", tech: ["Solidity", "Web3"], stars: 560, forks: 89, author: "0xPawan", color: "#FF1CF7" }
];

const TESTIMONIALS = [
  { name: "Rahul S.", role: "Full-Stack Engineer", quote: "I found my co-founder here in 48 hours. We just closed our pre-seed round. The talent density is insane.", handle: "@rahul_codes" },
  { name: "Priya M.", role: "UI/UX Designer", quote: "Instead of building fake portfolio projects, I'm designing actual products that get shipped to thousands of users.", handle: "@priya_designs" },
  { name: "Amit K.", role: "Startup Founder", quote: "We bypassed traditional hiring entirely. Our whole founding engineering team was sourced from active contributors here.", handle: "@amit_builds" }
];

// ─── MICRO-COMPONENTS ────────────────────────────────────────────

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
      className={`relative group overflow-hidden bg-[#030303] border border-white/5 rounded-3xl transition-all duration-500 hover:border-white/10 shadow-2xl ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-500 group-hover:opacity-100 z-0"
        style={{ background: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, ${accent}15, transparent 40%)` }}
      />
      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

function SectionLabel({ text, icon: Icon, color = "#00F0FF" }: { text: string, icon: any, color?: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 shadow-sm backdrop-blur-md mb-6 w-fit">
      <Icon size={14} style={{ color }} />
      <span className="text-[11px] font-bold tracking-widest text-zinc-300 uppercase">{text}</span>
    </div>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parallax tracking
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -450]);

  const fadeUp: Variants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };
  const stagger: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };

  return (
    <div ref={containerRef} style={{ position: 'relative' }} className="relative w-full bg-[#000000] text-zinc-100 font-sans overflow-hidden selection:bg-[#FF1CF7]/30">
      
      {/* ─── GLOBAL AMBIENCE ─── */}
      {/* ─── GLOBAL AMBIENCE ─── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_10%,transparent_100%)]" />
      </div>

      {/* ─── 1. HERO SECTION (Tight 3D Cluster) ─── */}
      <section className="relative z-10 w-full min-h-[100svh] pt-32 pb-20 flex items-center perspective-[1200px]">
        {/* Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[500px] bg-[#00F0FF]/[0.08] blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
        <div className="absolute top-[20%] right-[-10%] w-[60vw] h-[600px] bg-[#FF1CF7]/[0.08] blur-[150px] rounded-full mix-blend-screen pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />

        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full relative z-10">
          
          {/* ─── LEFT: TEXT COPY ─── */}
          <motion.div initial="hidden" animate="visible" variants={stagger} className="lg:col-span-5 max-w-xl z-20">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[#00FFA3]/20 bg-[#00FFA3]/5 backdrop-blur-md mb-8 shadow-[0_0_20px_rgba(0,255,163,0.1)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FFA3] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FFA3]" />
              </span>
              <span className="text-xs font-bold text-[#00FFA3] tracking-wide">1,204 Builders Online</span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-6xl sm:text-7xl lg:text-[5.5rem] font-extrabold tracking-tighter leading-[1.02] text-white mb-6 drop-shadow-2xl">
              The Multiplayer<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#FF1CF7] to-[#7B61FF]">
                Developers Ecosystem.
              </span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed mb-8 max-w-[480px]">
             Build products with ambitious developers, startup founders, AI builders, and creators — all inside one execution-focused ecosystem.
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-6">
              <button suppressHydrationWarning className="w-full sm:w-auto h-14 px-8 rounded-full bg-white text-black font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 group">
                <Github size={18} /> Join with GitHub
              </button>
              
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {["bg-cyan-500", "bg-purple-500", "bg-pink-500", "bg-orange-500"].map((color, i) => (
                    <div key={i} className={`w-10 h-10 rounded-full border-2 border-[#000] ${color} shadow-lg`} />
                  ))}
                </div>
                <div className="text-xs text-zinc-400 font-medium leading-tight">
                  Join <span className="text-white font-bold">15k+</span><br/>makers
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* ─── RIGHT: TIGHT 3D CLUSTER ─── */}
          <div className="lg:col-span-7 relative h-[600px] w-full hidden lg:block z-10">
            <div className="absolute inset-0 flex items-center justify-center transform-gpu preserve-3d" style={{ transform: "rotateX(20deg) rotateY(-15deg) scale(1.05)" }}>
              
              {/* 1. CENTRAL MASSIVE HUB */}
              <motion.div style={{ y: y1 }} className="absolute z-30 flex flex-col items-center justify-center">
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} className="relative">
                  <div className="absolute top-6 left-6 w-48 h-48 bg-zinc-900/30 border border-white/5 rounded-[2rem] transform -translate-z-16 blur-[6px]" />
                  <div className="absolute top-3 left-3 w-48 h-48 bg-zinc-900/50 border border-white/5 rounded-[2rem] transform -translate-z-8 blur-[2px]" />
                  
                  <div className="relative w-48 h-48 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] flex flex-col items-center justify-center shadow-[0_0_60px_rgba(255,28,247,0.2)] group overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                    <Sparkles size={40} className="text-[#FF1CF7] mb-3 drop-shadow-[0_0_15px_rgba(255,28,247,0.8)] relative z-10" />
                    <span className="text-white font-bold text-sm relative z-10">Global Core</span>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-widest mt-1 border border-white/10 px-2 py-0.5 rounded-full relative z-10 bg-white/5">Network Active</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* 2. LEFT NODES (Pulled in tight) */}
              <motion.div style={{ y: y2 }} className="absolute -left-8 top-16 z-40 flex flex-col gap-4">
                {[
                  { name: "Live Workspaces", icon: Laptop, color: "text-[#00F0FF]" },
                  { name: "AI Hackathon", icon: Terminal, color: "text-[#FF1CF7]" }
                ].map((item, i) => (
                  <motion.div 
                    key={item.name} 
                    animate={{ x: [0, -8, 0] }} 
                    transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: i }}
                    className="flex items-center gap-3 bg-zinc-950/90 border border-white/10 backdrop-blur-xl px-5 py-3 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.6)] relative"
                  >
                    <div className="absolute -right-12 top-1/2 w-12 border-t border-dashed border-white/20 -z-10" />
                    <div className="p-2 bg-white/5 rounded-lg"><item.icon size={16} className={item.color} /></div>
                    <div>
                      <div className="text-sm font-bold text-zinc-200">{item.name}</div>
                      <div className="text-[9px] text-[#00FFA3] flex items-center gap-1 mt-0.5"><Users size={10}/> Syncing Teams</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* 3. RIGHT TOP NODES (Pulled in tight) */}
              <motion.div style={{ y: y3 }} className="absolute -right-4 -top-8 z-20 flex flex-col gap-4">
                {[
                  { text: "PR #142 Merged", author: "@alex_j", icon: GitCommit, color: "#00F0FF" },
                  { text: "Repo Forked", author: "@sarah", icon: GitFork, color: "#7B61FF" }
                ].map((event, i) => (
                  <motion.div 
                    key={i} 
                    animate={{ x: [0, 8, 0] }} 
                    transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: i * 1.5 }}
                    className="flex items-center gap-3 bg-[#0A0A0A] border border-white/10 px-5 py-3 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.6)] relative"
                  >
                    <div className="absolute -left-12 top-1/2 w-12 border-t border-dashed border-white/20 -z-10" />
                    <event.icon size={14} style={{ color: event.color }} />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white">{event.text}</span>
                      <span className="text-[9px] text-zinc-500 mt-0.5">{event.author}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* 4. BOTTOM RIGHT NODES (Pulled in tight) */}
              <motion.div style={{ y: y2 }} className="absolute -right-12 bottom-12 z-40 flex flex-col gap-3">
                 <motion.div 
                    animate={{ y: [0, 8, 0] }} 
                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
                    className="flex items-center gap-3 bg-zinc-900/90 border border-white/10 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-2xl relative"
                  >
                    <div className="absolute -left-16 top-1/2 w-16 border-t border-dashed border-white/20 -z-10" />
                    <Shield size={14} className="text-[#00FFA3]" />
                    <span className="text-xs font-bold text-white">OAuth Verified</span>
                 </motion.div>
                 <motion.div 
                    animate={{ y: [0, -8, 0] }} 
                    transition={{ repeat: Infinity, duration: 6.5, ease: "easeInOut", delay: 2 }}
                    className="flex items-center gap-3 bg-zinc-900/90 border border-white/10 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-2xl relative ml-6"
                  >
                    <div className="absolute -left-20 top-1/2 w-20 border-t border-dashed border-white/20 -z-10" />
                    <Activity size={14} className="text-[#00F0FF]" />
                    <span className="text-xs font-bold text-white">Telemetry Sync</span>
                 </motion.div>
              </motion.div>

              {/* TIGHT CONNECTING RINGS */}
              <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 40, ease: "linear" }} className="absolute w-[450px] h-[450px] border border-white/[0.08] rounded-full border-dashed" />
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 70, ease: "linear" }} className="absolute w-[600px] h-[600px] border border-white/[0.04] rounded-full" />
              <motion.div animate={{ rotate: 180 }} transition={{ repeat: Infinity, duration: 100, ease: "linear" }} className="absolute w-[750px] h-[750px] border border-white/[0.02] rounded-full border-dashed" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. LIVE TICKER (Sleek Glassmorphic Bar) ─── */}
      <div className="w-full relative z-30 -mt-8 mb-20 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="w-full bg-[#050505]/60 backdrop-blur-2xl border border-white/10 rounded-2xl py-3.5 overflow-hidden relative shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]">
            <div className="absolute left-0 top-0 w-24 h-full bg-gradient-to-r from-[#050505] to-transparent z-10" />
            <div className="absolute right-0 top-0 w-24 h-full bg-gradient-to-l from-[#050505] to-transparent z-10" />
            
            <div className="flex w-[200%] animate-marquee">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center justify-around w-1/4 min-w-full gap-8 px-8">
                  {LIVE_EVENTS.map((event, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00FFA3] animate-pulse shadow-[0_0_8px_#00FFA3]" />
                      <span className="text-sm font-mono text-zinc-300 whitespace-nowrap">
                        {event}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── 3. THE PROBLEM VS SOLUTION (Scroll Reveal) ─── */}
      {/* ─── THE PROBLEM VS SOLUTION ─── */}
      <section className="w-full max-w-[1400px] mx-auto px-6 py-32 relative z-20">
        <div className="text-center mb-20 relative z-10">
          <SectionLabel text="The Paradigm Shift" icon={Shield} color="#FF5F56" />
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-white mt-4">
            Why traditional networking is <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5F56] to-[#FF9066]">broken.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative">
          
          {/* "VS" Divider Badge (Hidden on mobile) */}
          <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-[#050505] border border-white/10 rounded-full items-center justify-center z-30 shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-xl">
            <span className="text-zinc-600 font-mono text-xs font-bold uppercase tracking-widest">VS</span>
          </div>

          {/* 🔴 THE PROBLEM CARD */}
          <SpotlightCard accent="#FF5F56" className="p-2 sm:p-4 rounded-[2.5rem]">
            <div className="bg-[#0A0A0A] rounded-[2rem] p-8 sm:p-10 h-full border border-white/[0.02]">
              
              {/* Abstract Visual Header: Isolation */}
              <div className="h-48 w-full bg-black/50 rounded-2xl border border-white/5 mb-10 relative overflow-hidden flex flex-col items-center justify-center shadow-inner group-hover:border-[#FF5F56]/20 transition-colors duration-500">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px]" />
                
                {/* Disconnected Node UI */}
                <div className="relative z-10 flex items-center gap-4">
                   <div className="w-16 h-16 rounded-xl border-2 border-dashed border-[#FF5F56]/30 flex items-center justify-center bg-[#FF5F56]/5">
                     <Users size={24} className="text-[#FF5F56]/50" />
                   </div>
                   <div className="w-12 border-t-2 border-dashed border-zinc-800" />
                   <div className="w-16 h-16 rounded-xl border border-zinc-800 flex items-center justify-center bg-zinc-950 opacity-50">
                     <X size={24} className="text-zinc-700" />
                   </div>
                </div>
                <div className="absolute bottom-4 text-[10px] font-mono text-[#FF5F56]/50 uppercase tracking-widest">
                  Status: Isolated
                </div>
              </div>

              <h3 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                Building in Isolation
              </h3>
              
              <motion.ul 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }}
                className="space-y-6"
              >
                {[
                  "Endless tutorial hell with zero real-world users.",
                  "Struggling to find reliable, verified co-founders.",
                  "Polishing resumes that don't prove actual skill.",
                  "Zero experience with large-scale collaboration."
                ].map((text, i) => (
                  <motion.li 
                    key={i} 
                    variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                    className="flex items-start gap-4 text-zinc-400 font-light text-lg group/item cursor-default"
                  >
                    <div className="mt-1 min-w-[24px] h-6 rounded-full bg-[#FF5F56]/10 flex items-center justify-center border border-[#FF5F56]/20 group-hover/item:bg-[#FF5F56]/20 transition-colors">
                      <X size={12} className="text-[#FF5F56]" />
                    </div>
                    <span className="group-hover/item:text-zinc-200 transition-colors">{text}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </SpotlightCard>

          {/* 🟢 THE SOLUTION CARD */}
          <SpotlightCard accent="#00FFA3" className="p-2 sm:p-4 rounded-[2.5rem]">
            <div className="bg-gradient-to-b from-[#0A0A0A] to-[#00FFA3]/[0.02] rounded-[2rem] p-8 sm:p-10 h-full border border-white/[0.02] relative overflow-hidden">
              
              {/* Abstract Visual Header: The Network */}
              <div className="h-48 w-full bg-black/50 rounded-2xl border border-white/5 mb-10 relative overflow-hidden flex flex-col items-center justify-center shadow-inner group-hover:border-[#00FFA3]/30 transition-colors duration-500">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,163,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,163,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />
                
                {/* Connected Nodes UI */}
                <div className="relative z-10 flex items-center gap-4">
                   <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="w-12 h-12 rounded-xl border border-[#00FFA3]/40 flex items-center justify-center bg-[#00FFA3]/10 shadow-[0_0_20px_rgba(0,255,163,0.2)]">
                     <Globe size={20} className="text-[#00FFA3]" />
                   </motion.div>
                   
                   <div className="w-12 border-t-2 border-[#00FFA3]/40 relative">
                     <motion.div animate={{ left: ["0%", "100%"] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="absolute -top-1 w-2 h-2 rounded-full bg-[#00FFA3] shadow-[0_0_10px_#00FFA3]" />
                   </div>
                   
                   <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 4, delay: 1 }} className="w-16 h-16 rounded-xl border border-[#00F0FF]/40 flex items-center justify-center bg-[#00F0FF]/10 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
                     <GitMerge size={24} className="text-[#00F0FF]" />
                   </motion.div>
                   
                   <div className="w-12 border-t-2 border-[#00F0FF]/40 relative">
                     <motion.div animate={{ left: ["0%", "100%"] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.5 }} className="absolute -top-1 w-2 h-2 rounded-full bg-[#00F0FF] shadow-[0_0_10px_#00F0FF]" />
                   </div>
                   
                   <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 4, delay: 2 }} className="w-12 h-12 rounded-xl border border-[#7B61FF]/40 flex items-center justify-center bg-[#7B61FF]/10 shadow-[0_0_20px_rgba(123,97,255,0.2)]">
                     <Rocket size={20} className="text-[#7B61FF]" />
                   </motion.div>
                </div>
                <div className="absolute bottom-4 text-[10px] font-mono text-[#00FFA3] uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00FFA3] animate-pulse" /> Network Synced
                </div>
              </div>

              <h3 className="text-3xl font-bold text-white mb-8">The Network Effect</h3>
              
              <motion.ul 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }}
                className="space-y-6 relative z-10"
              >
                {[
                  "Build real MVPs with verified engineers globally.",
                  "Match with founders based on actual git history.",
                  "Ship products that entirely replace your resume.",
                  "Contribute directly to thriving open ecosystems."
                ].map((text, i) => (
                  <motion.li 
                    key={i} 
                    variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                    className="flex items-start gap-4 text-zinc-300 font-light text-lg group/item cursor-default"
                  >
                    <div className="mt-1 min-w-[24px] h-6 rounded-full bg-[#00FFA3]/10 flex items-center justify-center border border-[#00FFA3]/30 group-hover/item:bg-[#00FFA3]/20 transition-colors group-hover/item:scale-110">
                      <CheckCircle2 size={12} className="text-[#00FFA3]" />
                    </div>
                    <span className="group-hover/item:text-white transition-colors">{text}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </SpotlightCard>

        </div>
      </section>

     {/* ─── 4. BENTO GRID (Platform Arsenal) ─── */}
      <section className="w-full bg-[#030303] py-32 border-y border-white/5 relative z-20">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="mb-16">
            <SectionLabel text="Platform Arsenal" icon={Blocks} color="#FF1CF7" />
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-white mt-4">
              Everything you need to <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF1CF7] via-[#7B61FF] to-[#00F0FF]">scale your ambition.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
            
            {/* ─── CARD 1: SPECIALIZED GUILDS (Tall, Left) ─── */}
            <SpotlightCard accent="#7B61FF" className="md:col-span-1 md:row-span-2 p-8 flex flex-col group rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#7B61FF]/10 blur-[60px] rounded-full pointer-events-none" />
              
              {/* Visual: Floating Guild Stack */}
              <div className="h-56 w-full mb-6 relative flex flex-col items-center justify-center">
                {[
                  { name: "Frontend Guild", icon: LayoutTemplate, offset: -20, delay: 0, z: 30, scale: 1 },
                  { name: "AI / ML Guild", icon: Cpu, offset: 0, delay: 1, z: 20, scale: 0.9 },
                  { name: "Systems Guild", icon: Terminal, offset: 20, delay: 2, z: 10, scale: 0.8 }
                ].map((guild, i) => (
                  <motion.div 
                    key={i}
                    animate={{ y: [guild.offset, guild.offset - 8, guild.offset] }}
                    transition={{ repeat: Infinity, duration: 4, delay: guild.delay, ease: "easeInOut" }}
                    style={{ zIndex: guild.z, scale: guild.scale, top: `${50 + (i * 15)}%` }}
                    className="absolute w-full max-w-[200px] -translate-y-1/2 bg-[#0A0A0A] border border-white/10 p-3 rounded-xl shadow-xl flex items-center gap-3 backdrop-blur-md"
                  >
                    <div className="p-2 bg-[#7B61FF]/10 rounded-lg"><guild.icon size={16} className="text-[#7B61FF]" /></div>
                    <span className="text-sm font-bold text-white">{guild.name}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto relative z-10">
                <h3 className="text-2xl font-bold text-white mb-2">Specialized Guilds</h3>
                <p className="text-zinc-400 font-light text-sm">Join elite micro-communities based on your tech stack. Learn, share architectures, and draft teammates directly from your guild.</p>
              </div>
            </SpotlightCard>

            {/* ─── CARD 2: ALGORITHMIC MATCHMAKING (Wide, Top Right) ─── */}
            <SpotlightCard accent="#00F0FF" className="md:col-span-2 md:row-span-1 group rounded-3xl relative overflow-hidden p-0">
              <div className="absolute bottom-0 right-10 w-48 h-48 bg-[#00F0FF]/10 blur-[60px] rounded-full pointer-events-none" />
              
              {/* Text Content (Pinned to Left) */}
              <div className="p-8 relative z-20 md:w-3/5 h-full flex flex-col justify-center">
                <Network size={32} className="text-[#00F0FF] mb-6 drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]" />
                <h3 className="text-2xl font-bold text-white mb-3">Algorithmic Matchmaking</h3>
                <p className="text-zinc-400 font-light text-sm max-w-sm">Stop swiping on co-founders. We route you to the perfect teammates based on your tech stack, timezone, and verified GitHub commit history.</p>
              </div>

              {/* Visual: Node Connections (Pinned to Right absolutely) */}
              <div className="absolute right-0 bottom-0 top-0 w-full md:w-1/2 flex items-center justify-end pr-4 md:pr-12 z-10 opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                 <div className="relative w-56 h-56 flex items-center justify-center translate-x-12 translate-y-12 md:translate-x-0 md:translate-y-0">
                    {/* Center Node */}
                    <div className="w-14 h-14 bg-zinc-950 border border-[#00F0FF]/50 rounded-2xl flex items-center justify-center z-20 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
                      <Code2 size={24} className="text-[#00F0FF]" />
                    </div>
                    
                    {/* Connecting Lines */}
                    <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 10 }}>
                      <motion.line x1="15%" y1="20%" x2="50%" y2="50%" stroke="#00F0FF" strokeOpacity="0.4" strokeWidth="2" strokeDasharray="4 4" animate={{ strokeDashoffset: [0, -20] }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} />
                      <motion.line x1="85%" y1="15%" x2="50%" y2="50%" stroke="#00F0FF" strokeOpacity="0.4" strokeWidth="2" strokeDasharray="4 4" animate={{ strokeDashoffset: [0, -20] }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} />
                      <motion.line x1="25%" y1="85%" x2="50%" y2="50%" stroke="#00F0FF" strokeOpacity="0.4" strokeWidth="2" strokeDasharray="4 4" animate={{ strokeDashoffset: [0, -20] }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} />
                    </svg>
                    
                    {/* Outer Nodes */}
                    <div className="absolute top-[10%] left-[5%] w-10 h-10 bg-zinc-900 border border-white/10 rounded-full flex items-center justify-center z-20 shadow-lg"><Users size={14} className="text-zinc-300"/></div>
                    <div className="absolute top-[5%] right-[5%] w-10 h-10 bg-zinc-900 border border-white/10 rounded-full flex items-center justify-center z-20 shadow-lg"><Database size={14} className="text-zinc-300"/></div>
                    <div className="absolute bottom-[5%] left-[15%] w-10 h-10 bg-zinc-900 border border-white/10 rounded-full flex items-center justify-center z-20 shadow-lg"><Terminal size={14} className="text-zinc-300"/></div>
                 </div>
              </div>
            </SpotlightCard>

            {/* ─── CARD 3: 48H HACKATHONS (Square, Bottom Middle) ─── */}
            <SpotlightCard accent="#FF1CF7" className="md:col-span-1 md:row-span-1 p-8 flex flex-col group rounded-3xl relative overflow-hidden">
              {/* Visual: Glowing Timer */}
              <div className="absolute top-8 right-8 font-mono text-2xl font-bold text-[#FF1CF7]/20 group-hover:text-[#FF1CF7]/80 transition-colors duration-500">
                47:59:59
              </div>
              <div className="w-12 h-12 bg-[#FF1CF7]/10 border border-[#FF1CF7]/30 rounded-xl flex items-center justify-center mb-auto shadow-[0_0_20px_rgba(255,28,247,0.2)]">
                <Timer size={20} className="text-[#FF1CF7]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Global Sprints</h3>
                <p className="text-sm text-zinc-400 font-light">Compete in high-stakes 48-hour global hackathons to force yourself to ship MVPs.</p>
              </div>
            </SpotlightCard>

            {/* ─── CARD 4: LIVE TELEMETRY (Square, Bottom Right) ─── */}
            <SpotlightCard accent="#00FFA3" className="md:col-span-1 md:row-span-1 p-8 flex flex-col group rounded-3xl relative overflow-hidden">
               {/* Visual: Pulsing Activity Bars */}
              <div className="absolute top-8 right-8 flex items-end gap-1.5 h-8 opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                {[40, 70, 45, 90, 60].map((height, i) => (
                  <motion.div 
                    key={i}
                    animate={{ height: [`${height}%`, `${height / 2}%`, `${height}%`] }}
                    transition={{ repeat: Infinity, duration: 1.5 + (i * 0.2), ease: "easeInOut" }}
                    className="w-1.5 bg-[#00FFA3] rounded-t-sm"
                  />
                ))}
              </div>

              <div className="w-12 h-12 bg-[#00FFA3]/10 border border-[#00FFA3]/30 rounded-xl flex items-center justify-center mb-auto shadow-[0_0_20px_rgba(0,255,163,0.2)]">
                <Activity size={20} className="text-[#00FFA3]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Live Telemetry</h3>
                <p className="text-sm text-zinc-400 font-light">Watch the ecosystem build in real-time. PRs, commits, and live deployments.</p>
              </div>
            </SpotlightCard>

          </div>
        </div>
      </section>

      {/* ─── 5. PROJECT SHOWCASE (Proof of Work) ─── */}
      <section className="w-full max-w-[1400px] mx-auto px-6 py-32 relative z-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <SectionLabel text="Proof of Work" icon={Trophy} color="#F59E0B" />
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-white mt-4">Born in the Network.</h2>
          </div>
          <button suppressHydrationWarning className="h-12 px-6 rounded-full border border-white/10 bg-white/5 text-white font-medium text-sm hover:bg-white/10 transition-all flex items-center gap-2 group">
            View All Startups <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PROJECTS.map((proj, i) => (
            <SpotlightCard 
              key={i} 
              accent={proj.color} 
              className="group flex flex-col rounded-[2rem] bg-[#050505] overflow-hidden cursor-pointer border border-white/5"
            >
              
              {/* ─── VISUAL: Mini IDE / Code Snippet Mockup ─── */}
              <div className="h-52 relative overflow-hidden bg-[#0A0A0A] border-b border-white/5 p-6 flex flex-col">
                <div className="absolute -top-12 -right-12 w-40 h-40 blur-[60px] rounded-full opacity-10 group-hover:opacity-30 transition-opacity duration-700" style={{ backgroundColor: proj.color }} />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
                
                {/* Window Controls & Live Badge */}
                <div className="flex items-center justify-between mb-5 relative z-10">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 group-hover:bg-[#FF5F56] transition-colors duration-300" />
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 group-hover:bg-[#FFBD2E] transition-colors duration-300 delay-75" />
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 group-hover:bg-[#27C93F] transition-colors duration-300 delay-150" />
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full shadow-lg backdrop-blur-md">
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: proj.color }} />
                    <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest">Live</span>
                  </div>
                </div>

                {/* Syntax Highlighted Code UI */}
                <div className="font-mono text-[11px] leading-loose relative z-10">
                  <div className="text-zinc-600 mb-1">{"// devlink-os / deploy.ts"}</div>
                  <div><span className="text-[#FF1CF7]">export const</span> <span className="text-white">{proj.title.toLowerCase()}</span> <span className="text-[#00F0FF]">=</span> {`{`}</div>
                  <div className="pl-4">
                    <span className="text-zinc-400">founder:</span> <span className="text-[#00FFA3]">"@{proj.author}"</span>,
                  </div>
                  <div className="pl-4">
                    <span className="text-zinc-400">stack:</span> [{proj.tech.map((t, index) => (
                      <span key={t}><span className="text-[#F59E0B]">'{t}'</span>{index < proj.tech.length - 1 ? <span className="text-zinc-500">, </span> : ''}</span>
                    ))}],
                  </div>
                  <div className="pl-4 flex items-center gap-2">
                    <span className="text-zinc-400">status:</span> 
                    <span className="flex items-center gap-1" style={{ color: proj.color }}>
                      "Building"<motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>...</motion.span>
                    </span>
                  </div>
                  <div>{`}`}</div>
                </div>
              </div>

              {/* ─── DETAILS & METADATA ─── */}
              <div className="p-8 flex flex-col flex-1 relative z-10 bg-gradient-to-b from-[#050505] to-black">
                <div className="flex items-center justify-between mb-3">
                  
                  {/* BUG FIX: Added absolute bg-clip-text to correctly clip the gradient */}
                  <h3 
                    className="text-2xl font-bold bg-clip-text text-white group-hover:text-transparent transition-colors duration-300 w-fit" 
                    style={{ backgroundImage: `linear-gradient(to right, #FFFFFF, ${proj.color})` }}
                  >
                    {proj.title}
                  </h3>
                  
                  <ArrowUpRight size={20} className="text-zinc-600 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </div>
                
                <p className="text-zinc-400 text-sm font-light mb-8 flex-1 leading-relaxed">{proj.desc}</p>
                
                {/* Tech Pills */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {proj.tech.map(t => (
                    <span key={t} className="text-[10px] font-mono text-zinc-300 bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-md group-hover:border-white/20 transition-colors">
                      {t}
                    </span>
                  ))}
                </div>
                
                {/* Stats Footer */}
                <div className="flex justify-between items-center pt-5 border-t border-white/5 text-zinc-500 text-sm">
                  <div className="flex items-center gap-5">
                    <span className="flex items-center gap-1.5 hover:text-[#F59E0B] transition-colors"><Star size={14} /> <span className="font-bold text-zinc-300">{proj.stars}</span></span>
                    <span className="flex items-center gap-1.5 hover:text-white transition-colors"><GitFork size={14} /> <span className="font-bold text-zinc-300">{proj.forks}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[8px] text-white font-bold border border-white/10">
                      {proj.author[0].toUpperCase()}
                    </div>
                    <span className="font-mono text-[10px] text-zinc-400 group-hover:text-white transition-colors">@{proj.author}</span>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* ─── 6. LIVE NETWORK METRICS (Floating Stats) ─── */}
      <section className="w-full py-24 relative z-20 border-y border-white/5 bg-[#050505] overflow-hidden">
        
        {/* Ambient Multi-Color Backglow */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1200px] h-[200px] flex justify-between blur-[120px] opacity-20 pointer-events-none">
          <div className="w-1/4 h-full bg-[#00F0FF]" />
          <div className="w-1/4 h-full bg-[#FF1CF7]" />
          <div className="w-1/4 h-full bg-[#00FFA3]" />
          <div className="w-1/4 h-full bg-[#7B61FF]" />
        </div>

        {/* Top/Bottom Edge Highlights */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-[1000px] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] max-w-[1000px] h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-0">
            {STATS.map((stat, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                key={i} 
                className={`flex flex-col items-center text-center px-4 relative group ${i !== 3 ? 'md:border-r border-white/5' : ''}`}
              >
                {/* Individual Hover Glow */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 blur-2xl rounded-full pointer-events-none" 
                  style={{ backgroundColor: stat.color }}
                />
                
                <div className="w-14 h-14 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-white/20 transition-all duration-500 shadow-xl backdrop-blur-md relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity" style={{ backgroundColor: stat.color }} />
                  <stat.icon size={22} style={{ color: stat.color }} className="relative z-10 drop-shadow-lg" />
                </div>
                
                <p 
                  className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tighter mb-3 transition-all duration-500"
                >
                  <span className="bg-clip-text group-hover:text-transparent transition-all duration-500" style={{ backgroundImage: `linear-gradient(to bottom right, #FFFFFF, ${stat.color})` }}>
                    {stat.value}
                  </span>
                </p>
                
                <div className="flex items-center gap-2 mt-1 bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: stat.color, boxShadow: `0 0 10px ${stat.color}` }} />
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. TESTIMONIALS (Social Proof) ─── */}
      <section className="w-full max-w-[1400px] mx-auto px-6 py-32 relative z-20">
        <div className="text-center mb-16 relative z-10">
          <SectionLabel text="Community Voices" icon={MessageSquare} color="#7B61FF" />
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-white mt-4">
            Don't take our word for it.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((item, i) => (
            <SpotlightCard 
              key={i} 
              className="p-8 flex flex-col h-full rounded-[2rem] border border-white/10 bg-black/40 backdrop-blur-md" 
              accent={i === 0 ? "#7B61FF" : i === 1 ? "#00F0FF" : "#FF1CF7"}
            >
              {/* Quote Mark Overlay */}
              <div className="absolute top-6 right-6 opacity-5">
                <MessageSquare size={64} />
              </div>

              <p className="text-base text-zinc-300 leading-relaxed flex-1 mb-8 font-light italic">
                "{item.quote}"
              </p>
              
              <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                {/* Author Avatar with Glow Ring */}
                <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-[#7B61FF] to-[#00F0FF] shadow-lg">
                   <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-sm font-bold text-white uppercase">
                      {item.name[0]}
                   </div>
                </div>
                
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-white">{item.name}</p>
                    {/* Verification Badge */}
                    <div className="bg-[#00FFA3]/10 border border-[#00FFA3]/20 px-1.5 py-0.5 rounded">
                      <CheckCircle2 size={8} className="text-[#00FFA3]" />
                    </div>
                  </div>
                  <p className="text-[10px] text-[#7B61FF] font-mono mt-0.5">{item.handle}</p>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </section>

     {/* ─── 8. FINAL MASSIVE CTA ─── */}
<section className="py-32 md:py-48 px-6 relative overflow-hidden border-t border-white/10 bg-[#000] w-full z-20">
  {/* Massive Animated Background Orbs */}
  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
    <motion.div 
      animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }} 
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className="absolute w-[150vw] sm:w-[800px] h-[500px] bg-[#FF1CF7] blur-[120px] sm:blur-[180px] rounded-full mix-blend-screen" 
    />
    <motion.div 
      animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.12, 0.08] }} 
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      className="absolute w-[120vw] sm:w-[600px] h-[400px] bg-[#00F0FF] blur-[100px] sm:blur-[150px] rounded-full sm:translate-x-32 mix-blend-screen" 
    />
  </div>

  {/* Content (Animated on Scroll) */}
  <motion.div 
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.7, ease: "easeOut" }}
    className="relative z-10 max-w-4xl mx-auto text-center space-y-8"
  >
    <div className="w-20 h-20 mx-auto rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl shadow-[0_0_50px_rgba(255,255,255,0.05)]">
      <Network size={36} className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
    </div>

    <h2 className="text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tighter text-white leading-[1.05]">
      Enter the <br/>
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#FF1CF7] to-[#7B61FF]">
        Builder Matrix.
      </span>
    </h2>
    
    <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
      Your next startup, your co-founder, and your biggest career leap are waiting on the other side.
    </p>

    <div className="pt-8 sm:pt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
      <button suppressHydrationWarning className="w-full sm:w-auto h-16 px-10 sm:px-12 rounded-full bg-white text-black font-bold text-lg hover:scale-[1.03] active:scale-[0.98] transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] flex items-center justify-center gap-3 group">
        <Github size={22} className="text-black" /> 
        Claim Your Profile
        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform text-black" />
      </button>
    </div>
    
    <p className="text-xs text-zinc-500 font-mono mt-6 uppercase tracking-wider">
      Open source ecosystem. Connect via GitHub to verify commits.
    </p>
  </motion.div>
</section>

    </div>
  );
}