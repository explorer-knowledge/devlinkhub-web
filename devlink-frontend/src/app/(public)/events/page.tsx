"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Calendar, Zap, MapPin, Clock, Trophy,
  Globe, ArrowRight, Ticket, ArrowUpRight,
  Terminal, Image as ImageIcon, PlayCircle, CheckCircle2,
  Network, CornerDownLeft
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { FEATURED_EVENT, UPCOMING_EVENTS, PAST_EVENTS } from "@/utils/eventsData";

// ─── UTILITY COMPONENTS ─────────────────────────────────────────────

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
      className={`relative group overflow-hidden bg-[#050505] border border-white/10 rounded-2xl transition-all duration-500 hover:border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.05)] ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-500 group-hover:opacity-100 z-0"
        style={{ background: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, ${accent}15, transparent 40%)` }}
      />
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

function SectionHeading({ title, subtitle, icon: Icon, color = "#00F0FF" }: { title: string, subtitle?: string, icon: any, color?: string }) {
  return (
    <div className="mb-12">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-widest uppercase mb-4 text-zinc-300 shadow-sm backdrop-blur-md">
        <Icon size={12} style={{ color }} /> {title}
      </div>
      {subtitle && <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight max-w-2xl">{subtitle}</h2>}
    </div>
  );
}

function TerminalUI() {
  const router = useRouter();
  const [stage, setStage] = useState<"loading" | "printing" | "ready">("loading");
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Fetching ecosystem metadata...");
  const [logs, setLogs] = useState<string[]>([]);
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [username, setUsername] = useState("guest");
  
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [logs, progress, typedText, stage]);

  // Listen for Enter key to trigger handleRun
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (stage === "ready" && e.key === "Enter" && typedText.trim() === "Register Now") {
        handleRun();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [stage, typedText]);

  // Read username from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const authUser = localStorage.getItem("devlink_auth_user");
      if (authUser) {
        try {
          const parsed = JSON.parse(authUser);
          if (parsed.username) {
            setUsername(parsed.username);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  // Simulating npm downloading packages
  useEffect(() => {
    if (stage !== "loading") return;

    const loadingTexts = [
      "Connecting to npm registry.devlink.org...",
      "Resolving dependency tree...",
      "Downloading devlink-hackathon-utils v1.4.2...",
      "Extracting tarballs...",
      "Installing peer dependencies...",
      "Compiling native packages...",
      "Finalizing registry nodes..."
    ];

    let textIdx = 0;
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 8) + 2;
        if (next >= 100) {
          clearInterval(progressInterval);
          setStage("printing");
          return 100;
        }
        
        // Randomly update text
        if (next > (textIdx + 1) * 14 && textIdx < loadingTexts.length - 1) {
          textIdx++;
          setLoadingText(loadingTexts[textIdx]);
        }
        return next;
      });
    }, 80);

    return () => clearInterval(progressInterval);
  }, [stage]);

  // Log printing stage
  useEffect(() => {
    if (stage !== "printing") return;

    const systemLogs = [
      "✔ Installed devlink-hackathon-workshop-suite successfully.",
      "✔ Linked library node configuration files.",
      "✔ Security audit passed: 0 vulnerabilities found.",
      "✔ Connected to DevLink Core nodes on cluster devlink-mainnet-4.",
      "Initializing hackathon registry environment...",
      "Starting DevLink interactive console..."
    ];

    let logIdx = 0;
    const logInterval = setInterval(() => {
      if (logIdx < systemLogs.length) {
        setLogs((prev) => [...prev, systemLogs[logIdx]]);
        logIdx++;
      } else {
        clearInterval(logInterval);
        // Short delay before showing main terminal content
        setTimeout(() => {
          setStage("ready");
        }, 400);
      }
    }, 300);

    return () => clearInterval(logInterval);
  }, [stage]);

  // Typing animation for "Register Now"
  useEffect(() => {
    if (stage !== "ready") return;

    setTypedText("");

    const command = "Register Now";
    let charIdx = 0;
    let currentText = "";
    let typeInterval: NodeJS.Timeout;
    
    // Slight delay before typing starts
    const startTimeout = setTimeout(() => {
      typeInterval = setInterval(() => {
        if (charIdx < command.length) {
          currentText += command.charAt(charIdx);
          setTypedText(currentText);
          charIdx++;
        } else {
          clearInterval(typeInterval);
        }
      }, 100);
    }, 500);

    // Blinking cursor
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => {
      clearTimeout(startTimeout);
      clearInterval(typeInterval);
      clearInterval(cursorInterval);
    };
  }, [stage]);

  const handleRun = () => {
    if (stage !== "ready" || typedText.trim() !== "Register Now") return;
    router.push("/hackathon");
  };

  return (
    <div className="w-[85%] h-[75vh] border border-white/10 rounded-2xl bg-[#09090D] flex flex-col justify-between text-zinc-300 font-mono shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden relative">
      {/* Glow highlight */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#FF1CF7]/5 via-transparent to-[#00F0FF]/5" />
      
      {/* ─── TERMINAL HEADER ─── */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0D0D15] border-b border-white/10 shrink-0">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
        </div>
        <div className="text-xs text-zinc-500 select-none">
          bash - {username}@devlink-core: ~/events
        </div>
        <div className="w-12" /> {/* spacer */}
      </div>

      {/* ─── TERMINAL BODY ─── */}
      <div ref={terminalBodyRef} className="flex-1 flex flex-col justify-between overflow-y-auto scrollbar-none">
        {/* Stage 1: Loading npm packages */}
        {stage === "loading" && (
          <div className="p-5 flex-1 flex flex-col justify-center space-y-4">
            <div className="flex items-center gap-2 text-pink-500 text-xs md:text-sm">
              <span>$</span>
              <span>npm install --global devlink-hackathon-workshop-suite</span>
            </div>
            
            <div className="space-y-2 text-zinc-400 text-xs md:text-sm">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-t-pink-500 border-white/10 animate-spin" />
                <span className="text-zinc-300 font-bold">{loadingText}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>[</span>
                <span className="text-[#FF1CF7]">
                  {"#".repeat(Math.floor(progress / 5))}
                  {".".repeat(20 - Math.floor(progress / 5))}
                </span>
                <span>] {progress}%</span>
              </div>
            </div>
            <div className="text-zinc-600 text-[10px]">
              npm WARN deprecated source-map-url@0.4.1: See https://github.com/lydell/source-map-url#deprecated
            </div>
          </div>
        )}

        {/* Stage 2: Print system initialization logs */}
        {stage === "printing" && (
          <div className="p-5 flex-1 flex flex-col justify-center space-y-4">
            <div className="flex items-center gap-2 text-pink-500 text-xs md:text-sm">
              <span>$</span>
              <span>npm install --global devlink-hackathon-workshop-suite</span>
            </div>
            <div className="text-zinc-500 text-xs md:text-sm">
              ✔ Installed devlink-hackathon-workshop-suite v1.4.2.
            </div>

            <div className="space-y-1 text-zinc-400 text-xs md:text-sm">
              {logs.map((log, idx) => (
                <div key={idx} className="flex gap-2">
                  <span className="text-[#00F0FF]">[-]</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stage 3: Ready state - Centered big heading & paragraph */}
        {stage === "ready" && (
          <div className="p-6 flex-1 flex flex-col justify-center items-center text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] via-[#FF00FF] to-[#FFFF00] drop-shadow-[0_0_20px_rgba(0,255,255,0.9)] uppercase select-none animate-pulse">
              DEVLINK HACKATHON & WORKSHOP
            </h2>
            
            <p className="text-zinc-300 font-light leading-relaxed max-w-3xl text-sm md:text-base px-4">
              DevLink Hackathon & Workshop is the premier 48-hour global sprint for builders and creators.
              Collaborate on cutting-edge MVPs, attend technical masterclasses, and pitch directly to top venture partners.
            </p>
          </div>
        )}
      </div>

      {/* ─── TERMINAL PROMPT FOOTER ─── */}
      <div className="px-4 py-3 bg-[#0D0D15] border-t border-white/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 overflow-hidden flex-1 mr-4">
          <span className="text-[#00F0FF] shrink-0">{username}@devlink-terminal:~$</span>
          {stage === "ready" ? (
            <div className="flex items-center text-white font-bold select-none truncate">
              <span>{typedText}</span>
              {showCursor && (
                <span className="ml-1 inline-block w-2 h-4 bg-[#00F0FF] animate-pulse" />
              )}
            </div>
          ) : (
            <span className="text-zinc-600 italic text-xs select-none">Executing tasks...</span>
          )}
        </div>

        <div>
          {stage === "ready" ? (
            <button
              onClick={handleRun}
              disabled={typedText.trim() !== "Register Now"}
              className="px-4 py-1.5 rounded bg-[#00F0FF] hover:bg-[#00D0EE] text-black font-bold text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CornerDownLeft size={12} className="stroke-[2.5]" />
              Run
            </button>
          ) : (
            <div className="w-5 h-5 rounded-full border border-t-white/80 border-white/10 animate-spin" />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState("All Events");
  const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } } };

  return (
    <div className="min-h-screen bg-[#000000] text-zinc-300 font-sans selection:bg-[#FF1CF7]/30 overflow-hidden flex flex-col">
      <Navbar />

      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute top-[0%] left-[50%] -translate-x-1/2 w-[100vw] sm:w-[80vw] h-[500px] bg-[#FF1CF7]/[0.05] blur-[150px] rounded-full pointer-events-none" />
      </div>

      <main className="flex-1 relative z-10 w-full max-w-[1200px] mx-auto px-6 pt-32 pb-32">

        {/* ─── 1. HERO SECTION ─── */}
        <section className="flex justify-center pb-20 border-b border-white/5 mt-[5px]">
          <TerminalUI />
        </section>

        {/* ─── 2. FEATURED EVENT — Real Ticket Design ─── */}
        <section className="py-20 border-b border-white/5 relative">

          {/* ambient glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-[#FF1CF7]/[0.04] blur-[160px] rounded-full pointer-events-none" />

          <SectionHeading title="Featured Event" subtitle="The Next Global Sprint" icon={Trophy} color="#FF1CF7" />

          {/* ── TICKET CONTAINER ── */}
          <div className="relative group">

            {/* Outer glow on hover */}
            <div className="absolute -inset-px rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{ background: "linear-gradient(135deg, #FF1CF730, transparent 50%, #7B61FF20)" }} />

            {/* THE TICKET */}
            <div className="relative flex flex-col lg:flex-row rounded-3xl overflow-hidden border border-white/10 bg-[#080808] shadow-[0_32px_80px_rgba(0,0,0,0.8)]">

              {/* ═══════════════════════════════════════════
                  LEFT MAIN TICKET BODY
              ═══════════════════════════════════════════ */}
              <div className="flex-1 relative overflow-hidden">

                {/* Background gradient wash */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF1CF7]/[0.08] via-transparent to-[#7B61FF]/[0.05] pointer-events-none" />
                <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#FF1CF7]/20 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 right-12 w-64 h-64 bg-[#7B61FF]/10 rounded-full blur-[80px] pointer-events-none" />

                {/* Top colour stripe */}
                <div className="h-1 w-full bg-gradient-to-r from-[#FF1CF7] via-[#7B61FF] to-transparent" />

                <div className="relative z-10 p-8 sm:p-10 lg:p-12">

                  {/* Row 1: badge + price badge */}
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex flex-col gap-2">
                      <span className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.25em] uppercase text-[#FF1CF7] bg-[#FF1CF7]/10 border border-[#FF1CF7]/20 px-3 py-1.5 rounded-full w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF1CF7] animate-pulse" />
                        {FEATURED_EVENT.type}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">TICKET #DL-2026-001</span>
                    </div>

                    {/* Price block */}
                    <div className="text-right">
                      <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Starting From</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-white">FREE</span>
                      </div>
                      <p className="text-[10px] text-[#FF1CF7] font-semibold mt-0.5">Early Access Open</p>
                    </div>
                  </div>

                  {/* Event Title */}
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.05] mb-4">
                    {FEATURED_EVENT.title}
                  </h3>

                  <p className="text-sm text-zinc-400 leading-relaxed mb-8 max-w-xl">
                    {FEATURED_EVENT.desc}
                  </p>

                  {/* ── TICKET INFO GRID ── */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/[0.06] rounded-2xl overflow-hidden border border-white/[0.06] mb-8">
                    {[
                      { label: "Date", value: FEATURED_EVENT.date, icon: <Calendar size={14} className="text-[#FF1CF7]" /> },
                      { label: "Time", value: FEATURED_EVENT.time ?? "10:00 AM IST", icon: <Clock size={14} className="text-[#FF1CF7]" /> },
                      { label: "Venue", value: FEATURED_EVENT.location, icon: <Globe size={14} className="text-[#FF1CF7]" /> },
                      { label: "Capacity", value: `${FEATURED_EVENT.capacity} Spots`, icon: <Zap size={14} className="text-[#FF1CF7]" /> },
                    ].map((item) => (
                      <div key={item.label} className="bg-[#0d0d0d] px-4 py-4">
                        <div className="flex items-center gap-1.5 mb-2">
                          {item.icon}
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">{item.label}</span>
                        </div>
                        <p className="text-xs font-bold text-white leading-tight">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* ── PRICE TIERS ── */}
                  <div className="flex flex-wrap gap-3 mb-8">
                    {[
                      { tier: "Community", price: "FREE", note: "Open access", color: "#00FFA3", active: true },
                      { tier: "Early Bird", price: "₹0", note: "Register before Oct 1", color: "#00F0FF", active: false },
                      { tier: "Pro Guild", price: "₹299", note: "Priority access + badge", color: "#FF1CF7", active: false },
                    ].map((t) => (
                      <div
                        key={t.tier}
                        className={`flex-1 min-w-[100px] rounded-xl p-3.5 border transition-all duration-200 ${t.active ? "border-white/20 bg-white/[0.06]" : "border-white/[0.06] bg-white/[0.02]"}`}
                      >
                        <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: t.color }}>{t.tier}</p>
                        <p className="text-xl font-black text-white mb-0.5">{t.price}</p>
                        <p className="text-[10px] text-zinc-600">{t.note}</p>
                        {t.active && (
                          <div className="mt-2 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest" style={{ color: t.color }}>
                            <span className="w-1 h-1 rounded-full animate-pulse" style={{ background: t.color }} />
                            Current
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-10">
                    {FEATURED_EVENT.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-semibold text-zinc-400 bg-white/[0.05] border border-white/[0.08] px-3 py-1 rounded-lg">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href={`/events/${FEATURED_EVENT.id}`}
                      className="flex-1 h-13 px-8 py-3.5 rounded-xl bg-[#FF1CF7] text-white text-sm font-black text-center hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(255,28,247,0.35)]"
                    >
                      <Ticket size={17} /> Claim Your Spot — Free
                    </Link>
                    <Link
                      href={`/events/${FEATURED_EVENT.id}`}
                      className="h-13 px-7 py-3.5 rounded-xl border border-white/10 bg-white/[0.04] text-white text-sm font-semibold text-center hover:bg-white/[0.08] transition-colors flex items-center justify-center gap-2"
                    >
                      View Details <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* ═══════════════════════════════════════════
                  PERFORATED DIVIDER
              ═══════════════════════════════════════════ */}
              <div className="relative hidden lg:flex flex-col items-center justify-center w-10 shrink-0 bg-[#080808]">
                {/* Circular cutouts */}
                <div className="absolute -top-4 w-8 h-8 rounded-full bg-black border border-white/10 z-20" />
                <div className="absolute -bottom-4 w-8 h-8 rounded-full bg-black border border-white/10 z-20" />
                {/* Dashed line */}
                <div className="flex flex-col gap-[5px] items-center h-full justify-center py-8">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div key={i} className="w-[2px] h-[6px] rounded-full bg-white/[0.08]" />
                  ))}
                </div>
                {/* Rotated ADMIT ONE text */}
                <span className="absolute text-[9px] font-black tracking-[0.35em] uppercase text-zinc-700 rotate-90 whitespace-nowrap select-none">
                  ADMIT ONE
                </span>
              </div>

              {/* Mobile horizontal divider */}
              <div className="lg:hidden relative flex items-center h-10 mx-8 bg-[#080808]">
                <div className="absolute -left-4 w-8 h-8 rounded-full bg-black border border-white/10 z-20" />
                <div className="absolute -right-4 w-8 h-8 rounded-full bg-black border border-white/10 z-20" />
                <div className="flex gap-[5px] items-center w-full justify-center">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <div key={i} className="h-[2px] w-[6px] rounded-full bg-white/[0.08]" />
                  ))}
                </div>
              </div>

              {/* ═══════════════════════════════════════════
                  RIGHT STUB — Ticket Tail
              ═══════════════════════════════════════════ */}
              <div className="w-full lg:w-[220px] shrink-0 bg-[#0a0a0a] relative overflow-hidden flex flex-col">

                <div className="absolute inset-0 bg-gradient-to-b from-[#FF1CF7]/[0.04] to-transparent pointer-events-none" />
                <div className="h-1 w-full bg-gradient-to-r from-[#FF1CF7] via-[#7B61FF] to-transparent lg:bg-gradient-to-b lg:w-1 lg:h-full absolute top-0 left-0 opacity-40" />

                <div className="relative z-10 p-6 flex flex-col items-center gap-6 flex-1">

                  {/* Event logo / icon */}
                  <div className="w-16 h-16 rounded-2xl bg-[#FF1CF7]/10 border border-[#FF1CF7]/20 flex items-center justify-center mt-2 group-hover:scale-105 transition-transform duration-500">
                    <Terminal size={28} className="text-[#FF1CF7]" />
                  </div>

                  {/* Seat info */}
                  <div className="w-full space-y-4">
                    {[
                      { label: "Section", value: "GLOBAL" },
                      { label: "Row", value: "OPEN" },
                      { label: "Seat", value: "Any" },
                      { label: "Door", value: "Virtual" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between border-b border-white/[0.05] pb-3">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">{item.label}</span>
                        <span className="text-xs font-black text-white">{item.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* QR Code */}
                  <div className="w-28 h-28 rounded-xl overflow-hidden border border-white/10 relative bg-[#0d0d0d] p-2 flex-shrink-0">
                    {/* QR grid */}
                    <div className="w-full h-full relative">
                      <div className="absolute inset-0 grid gap-[2px] p-1" style={{ gridTemplateColumns: "repeat(9,1fr)", gridTemplateRows: "repeat(9,1fr)" }}>
                        {Array.from({ length: 81 }).map((_, i) => {
                          const on = [0,1,2,3,4,5,6,9,15,18,24,27,33,36,37,38,39,40,41,42,54,60,63,69,72,73,74,75,76,77,78,11,13,20,22,29,31,44,46,51,53,65,67].includes(i);
                          return <div key={i} className="rounded-[1px]" style={{ background: on ? "#FF1CF7" : "transparent", opacity: on ? 0.9 : 0 }} />;
                        })}
                      </div>
                      {/* Corner squares */}
                      <div className="absolute top-1 left-1 w-7 h-7 rounded-sm border-2 border-[#FF1CF7] bg-[#FF1CF7]/10" />
                      <div className="absolute top-1 right-1 w-7 h-7 rounded-sm border-2 border-[#FF1CF7] bg-[#FF1CF7]/10" />
                      <div className="absolute bottom-1 left-1 w-7 h-7 rounded-sm border-2 border-[#FF1CF7] bg-[#FF1CF7]/10" />
                    </div>
                  </div>

                  {/* Barcode */}
                  <div className="w-full">
                    <div className="flex items-end gap-[2px] h-10 w-full justify-center">
                      {Array.from({ length: 42 }).map((_, i) => {
                        const h = [2,5,3,6,2,4,7,3,5,2,6,3,4,5,2,7,4,3,6,5,2,4,3,7,5,6,3,2,4,5,6,3,7,4,2,5,3,6,4,7,3,5][i] ?? 4;
                        return (
                          <div
                            key={i}
                            className="flex-1 rounded-[1px]"
                            style={{ height: `${h * 14}%`, background: i % 2 === 0 ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.15)" }}
                          />
                        );
                      })}
                    </div>
                    <p className="text-center text-[8px] font-mono text-zinc-600 mt-1.5 tracking-[0.3em]">DL2026-SPRINT</p>
                  </div>

                  {/* Status */}
                  <div className="w-full pt-4 border-t border-white/[0.06]">
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#00FFA3] animate-pulse shadow-[0_0_8px_rgba(0,255,163,0.7)]" />
                      <span className="text-xs font-bold text-[#00FFA3]">Registration Open</span>
                    </div>
                    <p className="text-center text-[9px] text-zinc-600 mt-1 font-mono">250 of 250 slots remaining</p>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>


        {/* ─── 3. UPCOMING EVENTS — PREMIUM BENTO GRID ─── */}

        <section className="py-24 border-b border-white/5 relative overflow-hidden">

          {/* Soft ambient glows */}
          <div className="absolute -top-10 right-0 w-[700px] h-[500px] bg-[#00F0FF]/[0.03] blur-[160px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 -left-20 w-[500px] h-[400px] bg-[#7B61FF]/[0.04] blur-[140px] rounded-full pointer-events-none" />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-12 relative z-10">
            <SectionHeading title="Upcoming" subtitle="What's on the Calendar" icon={Calendar} color="#00F0FF" />

            {/* Filter pills */}
            <div className="flex flex-wrap items-center gap-2 sm:pt-2">
              {["All Events", "Workshop", "Community Meetup", "Startup Event"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-4 py-1.5 rounded-full text-[11px] font-semibold border transition-all duration-200 whitespace-nowrap ${
                    activeFilter === tab
                      ? "bg-white text-black border-white"
                      : "text-zinc-400 border-white/10 bg-white/[0.03] hover:border-white/20 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>


          {/* ── PREMIUM BENTO GRID ── */}
          {(() => {
            const filtered = UPCOMING_EVENTS.filter((e) =>
              activeFilter === "All Events" ? true : e.type === activeFilter
            );

            if (filtered.length === 0) {
              return (
                <div className="flex flex-col items-center justify-center py-24 gap-3 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Calendar size={20} className="text-zinc-600" />
                  </div>
                  <p className="text-zinc-600 text-sm font-mono">No events match this filter.</p>
                </div>
              );
            }

            const [hero, ...rest] = filtered;

            return (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 relative z-10">

                {/* ── HERO CARD — 7 cols wide ── */}
                <Link
                  href={`/events/${hero.id}`}
                  className="lg:col-span-7 group relative flex flex-col rounded-2xl overflow-hidden border border-white/[0.09] bg-[#0a0a0a] transition-all duration-500 hover:border-white/20 hover:-translate-y-0.5"
                  style={{ minHeight: "440px" }}
                >
                  {/* Top accent stripe */}
                  <div className="h-[2px] w-full shrink-0" style={{ background: `linear-gradient(90deg, ${hero.color}, ${hero.color}55 60%, transparent)` }} />

                  {/* Glow blob */}
                  <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full blur-[100px] opacity-[0.18] group-hover:opacity-30 transition-opacity duration-700 pointer-events-none" style={{ background: hero.color }} />
                  <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full blur-[80px] opacity-[0.07] pointer-events-none" style={{ background: hero.color }} />

                  <div className="relative z-10 flex flex-col flex-1 p-8 sm:p-10">

                    {/* Status badge */}
                    <div className="flex items-center justify-between mb-10">
                      <span className="text-[10px] font-bold uppercase tracking-[0.18em] px-3 py-1.5 rounded-full border" style={{ color: hero.color, borderColor: `${hero.color}40`, background: `${hero.color}10` }}>
                        {hero.type}
                      </span>
                      <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-400/[0.08] border border-emerald-400/20 px-3 py-1.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Registrations Open
                      </span>
                    </div>

                    {/* Giant date */}
                    <div className="flex items-end gap-3 mb-6">
                      <span className="text-[72px] font-black text-white leading-none tracking-tighter" style={{ fontVariantNumeric: "tabular-nums" }}>
                        {hero.date.split(" ")[1]}
                      </span>
                      <div className="pb-2">
                        <div className="text-base font-extrabold uppercase tracking-wider" style={{ color: hero.color }}>{hero.month}</div>
                        <div className="text-xs text-zinc-600 font-mono">2026</div>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl sm:text-[28px] font-extrabold text-white tracking-tight leading-snug mb-4">
                      {hero.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3 mb-8 flex-1 max-w-lg">
                      {hero.desc}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {hero.tags.map((tag) => (
                        <span key={tag} className="text-[10px] font-semibold text-zinc-400 bg-white/[0.05] border border-white/[0.08] px-3 py-1 rounded-lg">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8 pt-5 border-t border-white/[0.07]">
                      <span className="flex items-center gap-2 text-xs text-zinc-500">
                        <Clock size={13} style={{ color: hero.color }} />
                        {hero.time}
                      </span>
                      <span className="flex items-center gap-2 text-xs text-zinc-500">
                        <MapPin size={13} style={{ color: hero.color }} />
                        {hero.location}
                      </span>
                      {hero.capacity && (
                        <span className="flex items-center gap-2 text-xs text-zinc-500">
                          <Zap size={13} style={{ color: hero.color }} />
                          {hero.capacity} spots
                        </span>
                      )}
                    </div>

                    {/* CTAs */}
                    <div className="flex items-center gap-3 mt-auto">
                      <div
                        className="flex-1 h-11 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-black transition-all duration-300 group-hover:brightness-110"
                        style={{ background: hero.color }}
                      >
                        <Ticket size={15} /> RSVP Now
                      </div>
                      <div className="h-11 px-5 rounded-xl border border-white/10 bg-white/[0.04] flex items-center gap-2 text-sm text-zinc-300 transition-colors hover:bg-white/[0.08]">
                        Details <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </Link>

                {/* ── RIGHT COLUMN — stacked compact cards ── */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  {rest.length > 0 ? rest.map((event) => (
                    <Link
                      key={event.id}
                      href={`/events/${event.id}`}
                      className="group relative flex flex-col rounded-2xl overflow-hidden border border-white/[0.09] bg-[#0a0a0a] transition-all duration-300 hover:border-white/[0.2] hover:-translate-y-0.5 flex-1"
                      style={{ minHeight: "200px" }}
                    >
                      {/* Top accent stripe */}
                      <div className="h-[2px] w-full shrink-0" style={{ background: `linear-gradient(90deg, ${event.color}, ${event.color}44 55%, transparent)` }} />

                      {/* Glow */}
                      <div className="absolute top-0 right-0 w-36 h-36 rounded-full blur-[70px] opacity-[0.12] group-hover:opacity-[0.22] transition-opacity duration-500 pointer-events-none" style={{ background: event.color }} />

                      <div className="relative z-10 flex flex-col flex-1 p-6">

                        {/* Header row */}
                        <div className="flex items-center justify-between mb-5">
                          <span className="text-[10px] font-bold uppercase tracking-[0.18em] px-2.5 py-1 rounded-full border" style={{ color: event.color, borderColor: `${event.color}35`, background: `${event.color}0d` }}>
                            {event.type}
                          </span>
                          <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-mono">
                            <Calendar size={11} style={{ color: event.color }} />
                            {event.date} {event.month}
                          </div>
                        </div>

                        {/* Title */}
                        <h4 className="text-[17px] font-bold text-white tracking-tight mb-2.5 leading-snug group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-300 transition-all duration-300">
                          {event.title}
                        </h4>

                        {/* Description */}
                        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2 flex-1 mb-5">
                          {event.desc}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                          <div className="flex items-center gap-5">
                            <span className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                              <Clock size={11} style={{ color: event.color }} />
                              {event.time}
                            </span>
                            <span className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                              <MapPin size={11} style={{ color: event.color }} />
                              {event.location}
                            </span>
                          </div>
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-300 group-hover:scale-110 group-hover:brightness-110"
                            style={{ borderColor: `${event.color}30`, background: `${event.color}10`, color: event.color }}
                          >
                            <ArrowUpRight size={14} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  )) : (
                    <div className="flex-1 rounded-2xl border border-white/[0.06] bg-white/[0.02] flex flex-col items-center justify-center gap-3 p-10 text-center min-h-[200px]">
                      <Zap size={22} className="text-zinc-700" />
                      <p className="text-zinc-600 text-xs font-mono">More sessions coming soon</p>
                    </div>
                  )}
                </div>

              </div>
            );
          })()}

        </section>


        {/* ─── 4. PAST EVENTS & GALLERY (Archive) ─── */}

        {/* ───────── PAST EVENTS & GALLERY ───────── */}
        <section className="py-24 border-b border-white/5 relative">

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

          <SectionHeading
            title="Archive"
            subtitle="Past Events & Recaps"
            icon={ImageIcon}
            color="#10B981"
          />

          <div className="space-y-12 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {PAST_EVENTS.map((event) => (

              <SpotlightCard
                key={event.id}
                accent={event.color || "#10B981"}
                className="group overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950/40 backdrop-blur-md shadow-2xl transition-all duration-500 hover:border-white/20"
              >

                <div className="flex flex-col lg:flex-row">

                  {/* ───────── LEFT CONTENT ───────── */}
                  <div className="w-full lg:w-[58%] p-8 lg:p-12 flex flex-col justify-center relative">

                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none" />

                    {/* META */}
                    <div className="flex flex-wrap items-center gap-3 mb-6 relative z-10">

                      <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">

                        <CheckCircle2 size={14} />
                        Completed

                      </span>

                      <span className="w-1.5 h-1.5 rounded-full bg-white/20" />

                      <span className="text-xs text-zinc-400 flex items-center gap-2">
                        <MapPin size={14} />
                        {event.location}
                      </span>

                      <span className="w-1.5 h-1.5 rounded-full bg-white/20" />

                      <span className="text-xs text-zinc-400">
                        {event.date}
                      </span>

                    </div>

                    {/* TITLE */}
                    <h3 className="text-3xl lg:text-5xl font-extrabold bg-gradient-to-br from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent tracking-tight mb-5">

                      {event.title}

                    </h3>

                    {/* DESCRIPTION */}
                    <p className="text-zinc-400 text-base leading-relaxed mb-10 max-w-2xl">

                      {event.desc}

                    </p>

                    {/* STATS */}
                    {event.stats && (

                      <div className="flex flex-wrap gap-8 border-y border-white/10 py-6 mb-8">

                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-zinc-500">
                            Attendees
                          </p>

                          <h4 className="text-xl font-bold text-white mt-2">
                            {event.stats.attendees}
                          </h4>
                        </div>

                        {event.stats.projectsBuilt !== undefined && (
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-zinc-500">
                              Projects
                            </p>

                            <h4 className="text-xl font-bold text-white mt-2">
                              {event.stats.projectsBuilt}
                            </h4>
                          </div>
                        )}

                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-zinc-500">
                            Volume
                          </p>

                          <h4 className="text-sm font-mono text-zinc-300 mt-2">
                            {event.stats.linesOfCode ||
                              event.stats.commitsLine}
                          </h4>
                        </div>

                      </div>
                    )}

                    {/* TAGS */}
                    <div className="flex flex-wrap gap-3 mb-10">

                      {event.tags.map((tag) => (

                        <span
                          key={tag}
                          className="text-xs text-zinc-300 bg-white/5 border border-white/10 px-3 py-2 rounded-xl hover:bg-white/10 transition"
                        >
                          {tag}
                        </span>

                      ))}

                    </div>

                    {/* BUTTONS */}
                    <div className="flex flex-wrap gap-4">

                      <Link
                        href={`/events/${event.id}`}
                        className="h-12 px-6 rounded-xl bg-white text-black font-bold text-sm flex items-center gap-2 hover:bg-zinc-200 transition"
                      >
                        Explore Nodes
                        <ArrowRight size={16} />
                      </Link>

                      <Link
                        href={`/events/${event.id}`}
                        className="h-12 px-6 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-semibold flex items-center gap-2 hover:bg-white/10 transition"
                      >
                        <ImageIcon size={16} />
                        Gallery ({event.photosCount})
                      </Link>

                    </div>

                  </div>

                  {/* ───────── RIGHT IMAGE COLLAGE ───────── */}
                  <Link
                    href={`/events/${event.id}`}
                    className="w-full lg:w-[42%] relative overflow-hidden bg-zinc-900/30 border-t lg:border-t-0 lg:border-l border-white/10 flex items-center justify-center p-10 group/collage"
                  >

                    <div className="relative w-full max-w-[400px] h-[340px] mx-auto flex items-center justify-center">

                      {/* LEFT IMAGE */}
                      <div className="absolute left-0 w-[140px] lg:w-[170px] aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 shadow-2xl -rotate-12 transition duration-500 group-hover/collage:-translate-x-5 group-hover/collage:scale-105">

                        <img
                          src={event.images?.[0]}
                          className="w-full h-full object-cover"
                          alt=""
                        />

                      </div>

                      {/* CENTER IMAGE */}
                      <div className="absolute z-20 w-[170px] lg:w-[210px] aspect-[3/4] rounded-2xl overflow-hidden border border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.5)] transition duration-500 group-hover/collage:-translate-y-4 group-hover/collage:scale-110">

                        <img
                          src={event.images?.[1]}
                          className="w-full h-full object-cover"
                          alt=""
                        />

                      </div>

                      {/* RIGHT IMAGE */}
                      <div className="absolute right-0 w-[140px] lg:w-[170px] aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 rotate-12 shadow-2xl transition duration-500 group-hover/collage:translate-x-5 group-hover/collage:scale-105">

                        <img
                          src={event.images?.[2]}
                          className="absolute inset-0 w-full h-full object-cover blur-[2px]"
                          alt=""
                        />

                        <div className="absolute inset-0 bg-black/55" />

                        <div className="absolute inset-0 flex flex-col items-center justify-center">

                          <span className="text-white text-4xl font-bold">
                            +{event.photosCount
                              ? event.photosCount - 2
                              : 0}
                          </span>

                          <span className="text-zinc-300 text-[10px] tracking-[0.3em] mt-2">
                            MORE
                          </span>

                        </div>

                      </div>

                    </div>

                  </Link>

                </div>

              </SpotlightCard>

            ))}

          </div>

        </section>
        {/* ─── 5. HOST A NODE SECTION (Full Width/Cinematic) ─── */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="w-full py-24 px-6 md:px-12 bg-[#020202] border-y border-white/5 my-20"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20">

            {/* Text Content Block */}
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00FFA3]/5 border border-[#00FFA3]/20 text-[10px] font-bold tracking-[0.2em] uppercase text-[#00FFA3]">
                <Globe size={12} /> Become a Node Host
              </div>

              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.95]">
                Lead The Charge in <br />
                <span className="text-[#00FFA3]">Your City.</span>
              </h2>

              <p className="text-lg text-zinc-400 font-light leading-relaxed max-w-lg">
                We are seeking passionate student ambassadors and community leaders to steward local DevLink Nodes. Host hackathons, lead workshops, and build the builder culture in your local ecosystem.
              </p>

              {/* Button & Meta */}
              <div className="flex flex-col items-start gap-3 pt-4">
                <Link
                  href="/apply"
                  className="h-16 px-10 rounded-2xl bg-white text-black font-bold text-base hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                >
                  Apply to Host <ArrowRight size={18} />
                </Link>
                <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest pl-2">
                  Node Capacity: Open
                </p>
              </div>
            </div>

            {/* Decorative Visual Element (Optional: matches your dark gradient vibe) */}
            <div className="hidden md:flex w-full md:w-1/3 h-64 rounded-3xl bg-gradient-to-br from-[#00FFA3]/10 to-transparent border border-white/5 items-center justify-center">
              <Network size={64} className="text-[#00FFA3]/20" />
            </div>
          </div>
        </motion.section>

      </main>
    </div>
  );
}