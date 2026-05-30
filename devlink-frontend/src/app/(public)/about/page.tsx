"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Shield, Zap, Sparkles, Award, ArrowRight, 
  GitMerge, Server, Cpu, Database, Network, ChevronDown, 
  Terminal, ShieldCheck, Heart, Code2, Play, Compass, CheckCircle2,
  Github, Twitter, Linkedin, Instagram, ExternalLink
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// --- INTERFACES & DATA ---

interface TeamMember {
  name: string;
  image: string;
  handle: string;
  role: string;
  bio: string;
  tech: string[];
  color: string;
  profileCode: string;
  socials: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}

const TEAM: TeamMember[] = [
  {
    name: "Pawan Kushwaha",
    image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=400&fit=crop",
    handle: "pawan",
    role: "Founder & Community Lead",
    bio: "Leading the vision, ecosystem strategy, and open-source direction behind DevLinkHub. Focused on building a grassroots, collaborative network for developers, hobbyists, and open-source maintainers.",
    tech: ["Community", "Open Source", "Strategy"],
    color: "#00F0FF",
    profileCode: `class DevLinkHubCommunity {\n  constructor() {\n    this.founder = "Pawan Kushwaha";\n    this.mission = "Hack the future together";\n    this.isBuilding = true;\n  }\n  async scaleNetwork() {\n    return "community_node_established";\n  }\n}`,
    socials: { github: "https://github.com", twitter: "https://twitter.com", linkedin: "https://linkedin.com", instagram: "https://instagram.com" }
  },
  {
    name: "Prince Kumar",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    handle: "prince",
    role: "Community Ops Lead",
    bio: "Driving community operations, builder engagement, and peer-to-peer collaboration systems across DevLinkHub. Working to create an active, high-signal, and welcoming environment for all skill levels.",
    tech: ["Operations", "Engagement", "Systems"],
    color: "#FF1CF7",
    profileCode: `class CommunityOperations {\n  constructor() {\n    this.lead = "Prince Kumar";\n    this.signalLevel = "high";\n  }\n  dispatchEngagement() {\n    return "peer_collaboration_active";\n  }\n}`,
    socials: { github: "https://github.com", twitter: "https://twitter.com", instagram: "https://instagram.com" }
  },
  {
    name: "Nilesh Verma",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
    handle: "nilesh",
    role: "Events & Guild Lead",
    bio: "Supporting local initiatives, builder coordination, hackathons, and growth programs within the DevLinkHub network. Focused on strengthening grassroots collaboration and hacker culture.",
    tech: ["Coordination", "Hackathons", "Culture"],
    color: "#00FFA3",
    profileCode: `class BuilderGrowth {\n  constructor() {\n    this.lead = "Nilesh Verma";\n    this.initiative = "Hackathons & Meetups";\n  }\n  syncEvents() {\n    return "culture_strengthened";\n  }\n}`,
    socials: { github: "https://github.com", linkedin: "https://linkedin.com", instagram: "https://instagram.com" }
  },
  {
    name: "Kartik Raj",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    handle: "kartik",
    role: "Tech & Infrastructure Lead",
    bio: "Leading technical systems, hardware hacking initiatives, engineering workflows, and technology exploration for DevLinkHub. Focused on open development infrastructure and core maintainer support.",
    tech: ["Hardware", "DevOps", "Infrastructure"],
    color: "#FFB000",
    profileCode: `class TechSystems {\n  constructor() {\n    this.lead = "Kartik Raj";\n    this.stack = ["Hardware", "DevOps", "Infrastructure"];\n  }\n  compileHardwareKernel() {\n    return "oss_node_online";\n  }\n}`,
    socials: { github: "https://github.com", twitter: "https://twitter.com", linkedin: "https://linkedin.com" }
  }
];

const STORY_PHASES = [
  {
    id: "phase-0",
    label: "January 2026",
    title: "The Beginning",
    subtitle: "DevLinkHub began as an early vision to create something beyond a normal coding community.",
    bullets: [
      "Not another noisy Discord server. Not another inactive group chat.",
      "A place where developers collaborate & side-projects take shape.",
      "Where open source grows & hobbyists find mentors.",
      "Where ideas become actual, shared public repositories."
    ],
    accent: "#00F0FF"
  },
  {
    id: "phase-1",
    label: "Phase 01",
    title: "Building the Foundation",
    subtitle: "The first months focused on defining the culture and creating a welcoming identity.",
    bullets: [
      "Designing the ecosystem blueprint & community guidelines.",
      "Creating open-source architecture & contributor workflows.",
      "Exploring peer-to-peer developer collaboration systems.",
      "Evolving from a simple idea to a detailed community roadmap."
    ],
    accent: "#FF1CF7"
  },
  {
    id: "phase-2",
    label: "Phase 02",
    title: "Community First",
    subtitle: "Before tools. Before scale. The people came first.",
    bullets: [
      "Create a genuine space for developers, designers, and tinkerers.",
      "Setting up decentralized, interest-based guild networks.",
      "Curating early open-source project collaboration workflows.",
      "Bridging eager learners to experienced maintainers early on."
    ],
    accent: "#00FFA3"
  },
  {
    id: "phase-3",
    label: "Phase 03",
    title: "The Hacker Network",
    subtitle: "DevLinkHub expanded into more than a forum. It became a growing environment:",
    bullets: [
      "Projects: Focus on real-world collaborative coding.",
      "Open Source: Public culture, shared ownership, and merged PRs.",
      "Hackathons: Weekend sprints built on pure enthusiasm.",
      "Mentorship: Direct growth through shared knowledge."
    ],
    accent: "#7B61FF"
  },
  {
    id: "phase-4",
    label: "Today",
    title: "The Developer Grid",
    subtitle: "Evolving into a next-generation builder network.",
    bullets: [
      "Developers finding project teams seamlessly.",
      "Creators launching open-source tools with local community support.",
      "Peers meeting collaborators through shared technical interests.",
      "Builders growing rapidly through direct peer-to-peer execution."
    ],
    accent: "#FFB000"
  }
];

const TIMELINE_EVENTS = [
  { date: "January 2026", title: "DevLinkHub idea initiated.", desc: "Observation of isolated builders stuck in tutorial purgatory." },
  { date: "February 2026", title: "Vision & culture setup.", desc: "Creating the community roadmap and visual identity specs." },
  { date: "March 2026", title: "Guild architecture.", desc: "Deploying interest-based guilds and peer matching boards." },
  { date: "April 2026", title: "Open Source integration.", desc: "Launching core contributor lists and public issues board." },
  { date: "Today", title: "Building the next-gen grid.", desc: "Evolving into a unified, grassroots network for developers." }
];

// --- ANIMATION VARIANTS ---
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function AboutPage() {
  const [activePhase, setActivePhase] = useState(0);
  const [activeMember, setActiveMember] = useState<TeamMember>(TEAM[0]);

  return (
    <div className="relative min-h-screen bg-[#030303] text-zinc-100 font-sans selection:bg-[#00F0FF]/30 flex flex-col overflow-hidden">
      <Navbar />

      <main className="flex-1 flex flex-col relative pt-32 pb-24 z-10">
        
        {/* --- Background Ambient Layers --- */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] max-w-[1200px] h-[500px] bg-[#00F0FF]/[0.03] blur-[150px] rounded-full mix-blend-screen" />
          <div className="absolute top-[800px] left-[-10%] w-[500px] h-[500px] bg-[#FF1CF7]/[0.03] blur-[150px] rounded-full mix-blend-screen" />
        </div>

        <div className="max-w-[1200px] mx-auto w-full px-6 relative z-10 space-y-32">
          
          {/* ─── HERO SECTION ─── */}
          <motion.div 
            initial="hidden" animate="visible" variants={staggerContainer}
            className="flex flex-col items-center text-center space-y-6 pt-10"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-[0_0_20px_rgba(0,240,255,0.05)]">
              <Sparkles size={16} className="text-[#00F0FF] animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-[0.2em] text-[#00F0FF] uppercase">About The Community</span>
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-white leading-[1.05] uppercase">
              About <br className="sm:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#7B61FF] to-[#FF1CF7]">
                DevLinkHub.
              </span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-sm md:text-base font-mono tracking-widest text-zinc-500 uppercase mt-4">
              The Story Behind DevLinkHub // From Idea To A Developer Network
            </motion.p>
          </motion.div>

          {/* ─── OBSERVATION INTRO ─── */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-16 border-y border-white/5 relative"
          >
            <motion.div variants={fadeUp} className="lg:col-span-5 space-y-4">
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">The Core Spark</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                DevLinkHub started with a simple, glaring observation:
              </h2>
            </motion.div>
            
            <motion.div variants={fadeUp} className="lg:col-span-7 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-[#08080A] border border-white/5 shadow-lg group hover:border-[#00F0FF]/30 transition-colors duration-500">
                  <span className="text-xs text-zinc-500 block font-mono mb-2">OBSERVATION_01</span>
                  <p className="text-lg font-bold text-[#00F0FF]">Most developers were stuck learning in isolation.</p>
                </div>
                <div className="p-6 rounded-2xl bg-[#08080A] border border-white/5 shadow-lg group hover:border-[#FF1CF7]/30 transition-colors duration-500">
                  <span className="text-xs text-zinc-500 block font-mono mb-2">OBSERVATION_02</span>
                  <p className="text-lg font-bold text-[#FF1CF7]">Very few had a team to actually build with.</p>
                </div>
              </div>

              <p className="text-sm md:text-base text-zinc-400 font-light leading-relaxed">
                Developers were stuck in tutorial purgatory, disconnected forums, random hackathon chats, and isolated side projects. Finding serious, like-minded peers to hack on open-source tools or weekend projects was incredibly difficult.
              </p>

              <div className="p-8 rounded-2xl bg-gradient-to-br from-[#0A0A0C] to-black border border-white/10 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#00FFA3] to-transparent" />
                <span className="text-xs font-mono text-[#00FFA3] tracking-widest block uppercase mb-3">The Pivot Question</span>
                <p className="text-lg md:text-xl font-bold text-white italic leading-relaxed">
                  &ldquo;What if developers had a grassroots community dedicated entirely to building and hacking together?&rdquo;
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* ─── INTERACTIVE STORY PHASES ─── */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="space-y-12">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end border-b border-white/5 pb-6 gap-6">
              <motion.div variants={fadeUp}>
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Our Community Journey</span>
                <h3 className="text-3xl font-extrabold text-white mt-2">Milestone Phases</h3>
              </motion.div>
              
              <motion.div variants={fadeUp} className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-hide">
                {STORY_PHASES.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => setActivePhase(idx)}
                    className={`relative px-5 py-3 rounded-xl text-sm font-mono font-bold whitespace-nowrap transition-all duration-300 ${
                      activePhase === idx ? "text-white" : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]"
                    }`}
                  >
                    {activePhase === idx && (
                      <motion.div layoutId="active-story-pill" className="absolute inset-0 bg-white/[0.06] border border-white/10 rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.05)]" />
                    )}
                    <span className="relative z-10">{p.label}</span>
                  </button>
                ))}
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              {/* Summary left */}
              <div className="lg:col-span-1 p-10 rounded-3xl bg-[#08080A] border border-white/5 flex flex-col justify-between relative overflow-hidden min-h-[280px]">
                <div 
                  className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-[60px] pointer-events-none opacity-20 transition-colors duration-700"
                  style={{ backgroundColor: STORY_PHASES[activePhase].accent }}
                />
                <div className="relative z-10">
                  <span className="block text-xs font-mono text-zinc-500 uppercase tracking-widest mb-3">{STORY_PHASES[activePhase].label}</span>
                  <span className="block text-3xl font-black text-white leading-tight">
                    {STORY_PHASES[activePhase].title}
                  </span>
                </div>
                <div className="border-t border-white/5 pt-6 mt-8 relative z-10">
                  <span className="block text-sm text-zinc-400 font-light leading-relaxed">
                    {STORY_PHASES[activePhase].subtitle}
                  </span>
                </div>
              </div>

              {/* Bullet list right */}
              <div className="lg:col-span-2 bg-[#08080A] border border-white/5 rounded-3xl p-10 flex flex-col justify-center relative overflow-hidden shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePhase}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <span className="block text-xs font-mono text-zinc-500 tracking-widest uppercase">Community Focus</span>
                    <ul className="space-y-4">
                      {STORY_PHASES[activePhase].bullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-4 text-sm md:text-base text-zinc-300 leading-relaxed font-light">
                          <CheckCircle2 size={20} className="mt-0.5 shrink-0" style={{ color: STORY_PHASES[activePhase].accent }} />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* ─── MISSION & VISION ─── */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div variants={fadeUp} className="p-10 rounded-3xl bg-[#08080A] border border-white/5 relative overflow-hidden shadow-2xl flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#7B61FF]/[0.05] blur-[80px] rounded-full pointer-events-none" />
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#7B61FF]/10 border border-[#7B61FF]/20 text-xs font-mono text-[#7B61FF] uppercase font-bold mb-6">
                  <Award size={14} /> Our Mission
                </div>
                <h3 className="text-2xl font-black text-white mb-4">Hack The Future Together.</h3>
                <p className="text-sm md:text-base text-zinc-400 font-light leading-relaxed">
                  Create a grassroots community where developers do more than learn. They build. They share code. They mentor peers. They grow together.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="p-10 rounded-3xl bg-[#08080A] border border-white/5 relative overflow-hidden shadow-2xl flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#00F0FF]/[0.05] blur-[80px] rounded-full pointer-events-none" />
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/20 text-xs font-mono text-[#00F0FF] uppercase font-bold mb-6">
                  <Compass size={14} /> Our Vision
                </div>
                <h3 className="text-2xl font-black text-white mb-4">The Global Hacker Space.</h3>
                <p className="text-sm md:text-base text-zinc-400 font-light leading-relaxed">
                  To become the connective tissue for modern coders, uniting hobbyists, open-source maintainers, designers, and hackers into one collaborative network.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* ─── CHRONOLOGICAL TIMELINE ─── */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="space-y-12">
            <div className="text-center">
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Visual Timeline</span>
              <h2 className="text-3xl font-extrabold text-white mt-2">Community Milestones</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {TIMELINE_EVENTS.map((evt, idx) => (
                <motion.div key={idx} variants={fadeUp} className="bg-black border border-white/5 rounded-2xl p-6 flex flex-col justify-between min-h-[160px] relative shadow-lg group hover:border-white/10 hover:bg-white/[0.02] transition-colors">
                  <div className="absolute top-4 right-4 text-xs font-mono text-zinc-700 font-bold">0{idx + 1}</div>
                  <div>
                    <span className="text-xs font-mono font-bold text-[#00F0FF] block mb-2">{evt.date}</span>
                    <span className="text-sm md:text-base font-bold text-white block leading-tight">{evt.title}</span>
                  </div>
                  <p className="text-xs text-zinc-500 font-light mt-4 leading-relaxed group-hover:text-zinc-400 transition-colors">
                    {evt.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ─── TEAM SHOWCASE WIDGET (UPDATED) ─── */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="space-y-12 pb-20">
            <div>
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Leadership & Core Maintainers</span>
              <h2 className="text-3xl font-extrabold text-white mt-2 mb-3">Meet The Builders</h2>
              <p className="text-sm md:text-base text-zinc-400 font-light max-w-2xl">The core maintainers constructing the DevLinkHub ecosystem, building the open tools, and supporting the future builder network.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Left Column: Team selection list */}
              <div className="lg:col-span-4 space-y-3">
                {TEAM.map((member) => (
                  <button
                    key={member.handle}
                    onClick={() => setActiveMember(member)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all duration-300 ${
                      activeMember.handle === member.handle 
                        ? "bg-white/5 border-white/10 shadow-lg" 
                        : "bg-transparent border-transparent hover:bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Mini Avatar for List Navigation */}
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-12 h-12 rounded-xl object-cover border transition-all duration-300"
                        style={{ 
                          borderColor: activeMember.handle === member.handle ? `${member.color}40` : "rgba(255,255,255,0.05)",
                          boxShadow: activeMember.handle === member.handle ? `0 0 15px ${member.color}15` : "none"
                        }}
                      />
                      <div>
                        <span className="block text-sm font-bold text-white">{member.name}</span>
                        <span className="block text-xs font-mono text-zinc-500">{member.role}</span>
                      </div>
                    </div>
                    <ArrowRight 
                      size={16} 
                      className={`transition-transform duration-300 ${activeMember.handle === member.handle ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"}`}
                      style={{ color: member.color }}
                    />
                  </button>
                ))}
              </div>

              {/* Right Column: Detailed Profile Card */}
              <div className="lg:col-span-8 bg-[#08080A] border border-white/5 rounded-3xl p-8 relative overflow-hidden shadow-2xl min-h-[420px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeMember.handle}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full"
                  >
                    {/* Ambient glow behind right column */}
                    <div 
                      className="absolute -top-32 -right-32 w-64 h-64 rounded-full blur-[100px] opacity-15 pointer-events-none"
                      style={{ backgroundColor: activeMember.color }}
                    />
                    
                    {/* Left Half of Card: Rich Profile Header & Bio */}
                    <div className="space-y-6 flex flex-col justify-center relative z-10">
                      
                      {/* Profile Image, Name & Socials */}
                      <div className="flex items-center gap-5">
                        <div className="relative shrink-0">
                          <img 
                            src={activeMember.image} 
                            alt={activeMember.name}
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 shadow-xl"
                            style={{ borderColor: `${activeMember.color}50`, boxShadow: `0 0 25px ${activeMember.color}25` }}
                          />
                          <div className="absolute -bottom-2 -right-2 w-5 h-5 rounded-full border-2 border-[#08080A] flex items-center justify-center bg-black">
                             <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: activeMember.color }}/>
                          </div>
                        </div>
                        
                        <div>
                          <span 
                            className="inline-block px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider mb-2"
                            style={{ backgroundColor: `${activeMember.color}15`, border: `1px solid ${activeMember.color}30`, color: activeMember.color }}
                          >
                            {activeMember.role}
                          </span>
                          <h3 className="text-2xl sm:text-3xl font-black text-white leading-none tracking-tight">{activeMember.name}</h3>
                          
                          <div className="flex items-center gap-3 mt-3">
                            <span className="text-xs font-mono text-zinc-500">@{activeMember.handle}</span>
                            <div className="w-1 h-1 rounded-full bg-zinc-700" />
                            <div className="flex items-center gap-3">
                              {activeMember.socials.github && (
                                <a href={activeMember.socials.github} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors" aria-label="GitHub">
                                  <Github size={15} />
                                </a>
                              )}
                              {activeMember.socials.twitter && (
                                <a href={activeMember.socials.twitter} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-[#1DA1F2] transition-colors" aria-label="Twitter">
                                  <Twitter size={15} />
                                </a>
                              )}
                              {activeMember.socials.linkedin && (
                                <a href={activeMember.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-[#0A66C2] transition-colors" aria-label="LinkedIn">
                                  <Linkedin size={15} />
                                </a>
                              )}
                              {activeMember.socials.instagram && (
                                <a href={activeMember.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-[#E1306C] transition-colors" aria-label="Instagram">
                                  <Instagram size={15} />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-zinc-400 font-light leading-relaxed">
                        {activeMember.bio}
                      </p>

                      {/* Focus Areas Badges */}
                      <div>
                        <span className="block text-xs font-mono text-zinc-500 uppercase tracking-widest mb-3">Focus Areas</span>
                        <div className="flex flex-wrap gap-2">
                          {activeMember.tech.map(t => (
                            <span key={t} className="px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs font-mono text-zinc-300 shadow-inner">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Half of Card: Code Emulator */}
                    <div className="bg-[#030303] border border-white/10 rounded-2xl p-5 font-mono text-xs select-none overflow-hidden relative shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] flex flex-col h-full mt-6 md:mt-0">
                      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                      
                      {/* Editor top tabs */}
                      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 relative z-10">
                        <span className="text-zinc-500 text-[10px] tracking-wider">// profile.config.ts</span>
                        <div className="flex gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                          <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                        </div>
                      </div>

                      {/* Code Area */}
                      <div className="flex-1 overflow-x-auto relative z-10">
                         <pre className="text-zinc-300 leading-loose">
                           <code dangerouslySetInnerHTML={{ 
                             __html: activeMember.profileCode
                               .replace(/class/g, '<span class="text-[#FF1CF7]">class</span>')
                               .replace(/constructor/g, '<span class="text-[#00F0FF]">constructor</span>')
                               .replace(/this/g, '<span class="text-[#FFB000]">this</span>')
                               .replace(/async/g, '<span class="text-[#FF1CF7]">async</span>')
                               .replace(/return/g, '<span class="text-[#FF1CF7]">return</span>')
                               .replace(/("[^"]*")/g, '<span class="text-[#00FFA3]">$1</span>')
                           }} />
                         </pre>
                      </div>

                      {/* Editor Footer */}
                      <div className="text-[10px] text-zinc-500 border-t border-white/10 pt-3 flex items-center justify-between mt-auto relative z-10">
                        <span className="flex items-center gap-2"><Terminal size={12}/> {activeMember.handle}.profile</span>
                        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#00FFA3] animate-pulse"/> SYSTEM SYNCED</span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
}