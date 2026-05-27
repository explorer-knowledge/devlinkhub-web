"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionTemplate, useMotionValue } from "framer-motion";
import {
  Mail, MessageSquare, Briefcase, Zap, Rocket, Building2,
  Calendar, Github, Linkedin, Instagram, ArrowRight, CheckCircle2,
  Network, Sparkles, ChevronDown, MapPin, Inbox, Info, Eye, ArrowLeft, Send,
  Users, Heart,
  ArrowUpRight,
  Terminal
} from "lucide-react";
import Link from "next/link";
import { saveInquiry } from "@/utils/inquiriesData";

// ─── UTILITY COMPONENTS ─────────────────────────────────────────────\
const DiscordIcon = ({ size = 24, color = "currentColor", className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    className={className}
  >
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
  </svg>
);

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
      className={`relative group overflow-hidden bg-[#050505] border border-white/[0.08] rounded-3xl transition-all duration-300 hover:border-white/20 ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-500 group-hover:opacity-100 z-0"
        style={{ background: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, ${accent}15, transparent 40%)` }}
      />
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

// ─── DATA ──────────────────────────────────────────────────────────

const CATEGORIES = [
  { title: "PARTNERSHIPS", desc: "Collaborate on university, community, and ecosystem growth initiatives.", icon: Network, color: "#00F0FF" },
  { title: "SPONSORSHIPS", desc: "Support hackathons, learning programs, and community expansion.", icon: Sparkles, color: "#7B61FF" },
  { title: "COLLABORATIONS", desc: "Build innovation labs and developer programs together.", icon: Rocket, color: "#FF1CF7" },
  { title: "SUPPORT", desc: "Questions about onboarding, contributions, or community access.", icon: MessageSquare, color: "#00FFA3" },
  { title: "EVENTS", desc: "Hackathons, workshops, and speaking opportunities.", icon: Calendar, color: "#F59E0B" }
];

const FORM_CATEGORIES = [
  { label: "General Inquiry", color: "#B4BCD0" },
  { label: "Partnerships", color: "#00F0FF" },
  { label: "Sponsorships", color: "#7B61FF" },
  { label: "Collaborations", color: "#FF1CF7" },
  { label: "Support", color: "#00FFA3" },
  { label: "Events", color: "#F59E0B" }
];

// ─── MAIN PAGE ─────────────────────────────────────────────────────

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("devlink_auth_user");
      if (stored) {
        try {
          setCurrentUser(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const isAdmin = currentUser && (
    currentUser.username === "admin" ||
    currentUser.isAdmin === true ||
    currentUser.email === "admin@devlink.dev"
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "General Inquiry",
    subject: "",
    message: "",
    organization: ""
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const activeCategoryColor = FORM_CATEGORIES.find(c => c.label === formData.category)?.color || "#00F0FF";

  const handleInquireClick = (title: string) => {
    // Convert e.g., "PARTNERSHIPS" -> "Partnerships"
    const formatted = title.charAt(0) + title.slice(1).toLowerCase();

    setFormData(prev => ({
      ...prev,
      category: formatted,
      subject: `${formatted} Proposal`
    }));

    // Scroll to form section
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 800);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setLoading(true);
    try {
      const saved = await saveInquiry({
        name: formData.name,
        email: formData.email,
        category: formData.category,
        subject: formData.subject || `${formData.category} Request`,
        message: formData.message,
        organization: formData.organization
      });

      setCreatedId(saved.id);
      setSuccess(true);
    } catch (err) {
      console.error("Failed to submit inquiry:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    setFormData({
      name: "",
      email: "",
      category: "General Inquiry",
      subject: "",
      message: "",
      organization: ""
    });
    setSuccess(false);
    setCreatedId(null);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-zinc-300 font-sans selection:bg-white/10 py-20 px-6 relative overflow-hidden">

      {/* Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#7B61FF]/[0.05] blur-[150px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#00F0FF]/[0.05] blur-[150px] rounded-full animate-pulse-slow" />
      </div>

      <main className="relative z-10 max-w-[1200px] mx-auto">

        {/* ─── HEADER SECTION ─── */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
          }}
          className="text-center py-24 relative z-10"
        >
          {/* Top Badge */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.05)] mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse shadow-[0_0_8px_#00F0FF]" />
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-zinc-300 uppercase">
              DevLink // Secure Channel
            </span>
          </motion.div>

          {/* Dashboard Quick Access Portal Badge (Desktop) */}
          {isAdmin && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute top-0 right-0 hidden md:block"
            >
              <Link
                href="/contact/inquiries"
                className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#08080a] border border-[#00F0FF]/30 text-xs font-mono font-bold text-[#00F0FF] hover:bg-[#00F0FF]/10 transition-all shadow-[0_0_20px_rgba(0,240,255,0.1)] active:scale-95"
              >
                <Inbox size={14} className="group-hover:animate-bounce" />
                Manage Inquiries
              </Link>
            </motion.div>
          )}

          {/* Main Headlines */}
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
            }}
            className="text-5xl sm:text-6xl md:text-8xl font-black text-white tracking-tighter mb-6 leading-[1.05]"
          >
            Let's Build <br className="sm:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#7B61FF] to-[#FF1CF7]">
              Together.
            </span>
          </motion.h1>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
            }}
            className="text-base sm:text-lg text-zinc-400 font-light max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Open a transmission for partnerships, open-source sponsorships, grassroots collaborations, ecosystem programs, or direct support.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
            }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/join"
              className="group relative w-full sm:w-auto h-14 px-10 inline-flex items-center justify-center overflow-hidden rounded-xl bg-white font-bold text-black text-sm transition-all hover:scale-[1.03] active:scale-[0.97] shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_35px_rgba(255,255,255,0.3)]"
            >
              {/* Sweep Hover Element */}
              <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-700 group-hover:[transform:skew(-12deg)_translateX(150%)] z-0">
                <div className="relative h-full w-12 bg-black/[0.15]" />
              </div>
              <span className="relative z-10 flex items-center gap-2">
                <Zap size={16} className="text-[#7B61FF]" fill="#7B61FF" />
                Join The Network
              </span>
            </Link>

            {isAdmin && (
              <Link
                href="/contact/inquiries"
                className="md:hidden w-full sm:w-auto h-14 px-8 rounded-xl border border-[#00F0FF]/30 bg-[#00F0FF]/5 text-[#00F0FF] text-sm font-bold hover:bg-[#00F0FF]/10 transition-colors flex items-center justify-center gap-2"
              >
                <Inbox size={16} /> Inquiries Portal
              </Link>
            )}

            <Link
              href="/about"
              className="hidden md:flex w-full sm:w-auto h-14 px-8 rounded-xl border border-white/10 bg-white/[0.03] text-white text-sm font-medium hover:bg-white/[0.08] hover:border-white/20 transition-all items-center justify-center gap-2 group"
            >
              Explore Ecosystem <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-zinc-400 group-hover:text-white" />
            </Link>
          </motion.div>
        </motion.section>


        {/* CATEGORY CARDS */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-32 relative z-10"
        >
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
              }}
              className="h-full"
            >
              <SpotlightCard
                accent={cat.color}
                className="p-6 md:p-8 flex flex-col items-center text-center h-full group border border-white/5 hover:border-white/10 transition-colors duration-500"
              >
                {/* Pass the theme color to CSS variables for dynamic hover effects */}
                <div
                  className="flex flex-col items-center flex-1 w-full"
                  style={{ "--theme-color": cat.color } as React.CSSProperties}
                >

                  {/* Glowing Icon Container */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center border mb-6 transition-all duration-500 group-hover:scale-110 relative shadow-inner"
                    style={{
                      backgroundColor: `${cat.color}10`,
                      borderColor: `${cat.color}30`,
                      boxShadow: `inset 0 0 15px ${cat.color}05`
                    }}
                  >
                    {/* Subtle internal glow on hover */}
                    <div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-[8px]"
                      style={{ backgroundColor: cat.color }}
                    />
                    <cat.icon size={24} style={{ color: cat.color }} className="relative z-10 transition-transform duration-300 group-hover:scale-110" />
                  </div>

                  <h3 className="text-sm font-bold text-white mb-3 tracking-widest uppercase group-hover:text-[var(--theme-color)] transition-colors duration-300">
                    {cat.title}
                  </h3>

                  <p className="text-xs text-zinc-400 font-light leading-relaxed mb-8 flex-1">
                    {cat.desc}
                  </p>

                  <button
                    onClick={() => handleInquireClick(cat.title)}
                    className="w-full text-[11px] font-bold text-zinc-300 uppercase tracking-widest bg-white/[0.03] border border-white/10 px-4 py-3.5 rounded-xl hover:bg-[var(--theme-color)]/10 hover:border-[var(--theme-color)]/50 hover:text-white active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 group/btn overflow-hidden relative"
                  >
                    <span className="relative z-10 transition-transform duration-300 group-hover/btn:-translate-x-1">
                      Inquire
                    </span>
                    <ArrowRight
                      size={14}
                      className="relative z-10 text-[var(--theme-color)] opacity-0 -translate-x-4 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-300"
                    />
                  </button>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.section>

        {/* CONTACT FORM & INFO GRID */}
        <section ref={formRef} id="contact-form-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-32 items-start">

          {/* Main card panel */}
          <div className="lg:col-span-8">
            <SpotlightCard
              className="p-8 md:p-12 relative overflow-hidden transition-colors duration-500"
              accent={activeCategoryColor}
            >
              {/* Dynamic Background Glow based on active category */}
              <div
                className="absolute top-0 right-0 w-full h-1/2 opacity-10 blur-[100px] pointer-events-none transition-colors duration-700"
                style={{ backgroundColor: activeCategoryColor }}
              />

              <AnimatePresence mode="wait">
                {!success ? (
                  <motion.div
                    key="form-container"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8 relative z-10"
                  >
                    <div>
                      <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Open a Transmission</h2>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full animate-pulse shadow-lg" style={{ backgroundColor: activeCategoryColor, boxShadow: `0 0 10px ${activeCategoryColor}` }} />
                        <p className="text-xs text-zinc-400 font-mono tracking-widest uppercase">
                          Active Node: <span style={{ color: activeCategoryColor }} className="font-bold transition-colors duration-300">{formData.category}</span>
                        </p>
                      </div>
                    </div>

                    <form
                      className="space-y-6"
                      onSubmit={handleFormSubmit}
                      // Passing the active color to CSS variables for dynamic focus states
                      style={{ "--theme-color": activeCategoryColor } as React.CSSProperties}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* Full Name */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Full Name *</label>
                          <div className="relative group">
                            <Users size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[var(--theme-color)] transition-colors duration-300" />
                            <input
                              ref={nameInputRef}
                              id="form-name-input"
                              required
                              type="text"
                              value={formData.name}
                              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full h-12 bg-black/50 border border-white/10 rounded-xl pl-11 pr-4 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-[var(--theme-color)] focus:ring-1 focus:ring-[var(--theme-color)] transition-all shadow-inner"
                              placeholder="Jane Doe"
                            />
                          </div>
                        </div>

                        {/* Email Address */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Secure Email *</label>
                          <div className="relative group">
                            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[var(--theme-color)] transition-colors duration-300" />
                            <input
                              required
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                              className="w-full h-12 bg-black/50 border border-white/10 rounded-xl pl-11 pr-4 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-[var(--theme-color)] focus:ring-1 focus:ring-[var(--theme-color)] transition-all shadow-inner"
                              placeholder="jane@example.com"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* Custom Category Dropdown */}
                        <div className="space-y-2 relative">
                          <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Routing Category *</label>
                          <div className="relative group">
                            <Network size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[var(--theme-color)] transition-colors duration-300 z-10 pointer-events-none" />
                            <button
                              type="button"
                              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                              className="w-full h-12 bg-black/50 border border-white/10 rounded-xl pl-11 pr-4 text-sm text-left text-white flex items-center justify-between focus:border-[var(--theme-color)] focus:ring-1 focus:ring-[var(--theme-color)] outline-none transition-all cursor-pointer shadow-inner hover:border-white/20"
                            >
                              <span className="flex items-center gap-2">
                                {formData.category}
                              </span>
                              <ChevronDown size={16} className={`text-zinc-500 transition-transform ${isDropdownOpen ? "rotate-180 text-white" : ""}`} />
                            </button>
                          </div>

                          {/* Dropdown Options Box */}
                          <AnimatePresence>
                            {isDropdownOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                className="absolute left-0 right-0 mt-2 bg-[#0A0A0F]/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 py-2"
                              >
                                {FORM_CATEGORIES.map((cat) => (
                                  <button
                                    key={cat.label}
                                    type="button"
                                    onClick={() => {
                                      setFormData(prev => ({ ...prev, category: cat.label }));
                                      setIsDropdownOpen(false);
                                    }}
                                    className="w-full px-5 py-3 text-sm text-left hover:bg-white/5 text-zinc-400 hover:text-white flex items-center gap-3 transition-colors cursor-pointer"
                                  >
                                    <span className="w-2 h-2 rounded-full shadow-lg" style={{ backgroundColor: cat.color, boxShadow: `0 0 8px ${cat.color}` }} />
                                    {cat.label}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Organization */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Organization (Optional)</label>
                          <div className="relative group">
                            <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[var(--theme-color)] transition-colors duration-300" />
                            <input
                              type="text"
                              value={formData.organization}
                              onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                              className="w-full h-12 bg-black/50 border border-white/10 rounded-xl pl-11 pr-4 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-[var(--theme-color)] focus:ring-1 focus:ring-[var(--theme-color)] transition-all shadow-inner"
                              placeholder="Startup / Community"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Subject */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Subject / Topic *</label>
                        <div className="relative group">
                          <Info size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[var(--theme-color)] transition-colors duration-300" />
                          <input
                            required
                            type="text"
                            value={formData.subject}
                            onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                            className="w-full h-12 bg-black/50 border border-white/10 rounded-xl pl-11 pr-4 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-[var(--theme-color)] focus:ring-1 focus:ring-[var(--theme-color)] transition-all shadow-inner"
                            placeholder="What is this transmission regarding?"
                          />
                        </div>
                      </div>

                      {/* Message Body */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Message Detail *</label>
                        <div className="relative group">
                          <MessageSquare size={16} className="absolute left-4 top-5 text-zinc-600 group-focus-within:text-[var(--theme-color)] transition-colors duration-300" />
                          <textarea
                            required
                            value={formData.message}
                            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                            className="w-full h-40 bg-black/50 border border-white/10 rounded-xl pl-11 pr-4 py-4 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-[var(--theme-color)] focus:ring-1 focus:ring-[var(--theme-color)] transition-all resize-none shadow-inner"
                            placeholder="Outline your proposal, idea, or questions here..."
                          />
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        disabled={loading}
                        type="submit"
                        className="group relative w-full h-14 overflow-hidden rounded-xl font-bold text-black text-sm flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                        style={{ backgroundColor: "white" }}
                      >
                        {/* Dynamic Sweep Element based on Theme */}
                        <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(150%)] z-0">
                          <div className="relative h-full w-12 opacity-20" style={{ backgroundColor: activeCategoryColor }} />
                        </div>

                        <div className="relative z-10 flex items-center gap-2">
                          {loading ? (
                            <>
                              <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: activeCategoryColor, borderTopColor: "transparent" }} />
                              Broadcasting to Network...
                            </>
                          ) : (
                            <>
                              <Send size={16} style={{ color: activeCategoryColor }} className="transition-colors duration-300" />
                              Transmit Inquiry
                            </>
                          )}
                        </div>
                      </button>
                    </form>
                  </motion.div>
                ) : (

                  // ─── SUCCESS STATE ───
                  <motion.div
                    key="success-container"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center py-16 text-center space-y-8 relative z-10"
                  >
                    <div
                      className="w-24 h-24 rounded-[2rem] border-2 flex items-center justify-center shadow-2xl relative overflow-hidden"
                      style={{ borderColor: `${activeCategoryColor}30`, backgroundColor: `${activeCategoryColor}10`, boxShadow: `0 0 50px ${activeCategoryColor}20` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10" />
                      <CheckCircle2 size={48} style={{ color: activeCategoryColor }} className="animate-pulse relative z-10" />
                    </div>

                    <div className="space-y-3 max-w-md">
                      <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: activeCategoryColor }}>
                        Transmission Acknowledged
                      </span>
                      <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Inquiry Registered</h2>
                      <p className="text-sm text-zinc-400 font-light leading-relaxed">
                        Your message has been broadcast to the DevLink support matrix. A coordinator node has been assigned to catalog your request.
                      </p>
                      {createdId && (
                        <div className="inline-block bg-black/50 border border-white/10 rounded-xl px-5 py-3 mt-4 shadow-inner">
                          <code className="text-xs font-mono text-zinc-400">
                            REF_ID: <span style={{ color: activeCategoryColor }} className="font-bold">{createdId}</span>
                          </code>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md pt-6">
                      {createdId && (
                        <Link
                          href={`/contact/inquiries/${createdId}`}
                          className="flex-1 h-12 rounded-xl bg-white text-black font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                        >
                          <Eye size={16} /> View Details
                        </Link>
                      )}
                      <Link
                        href="/contact/inquiries"
                        className="flex-1 h-12 rounded-xl border border-white/10 bg-white/5 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                      >
                        <Inbox size={16} /> Dashboard
                      </Link>
                    </div>

                    <button
                      onClick={handleResetForm}
                      className="text-xs text-zinc-500 hover:text-white font-mono transition-colors pt-4 cursor-pointer"
                    >
                      [ Initialize New Transmission ]
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </SpotlightCard>
          </div>

          {/* Social info sidebar */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            {[
              {
                label: "Email Contact", val: "hello@devlink.community", href: "mailto:hello@devlink.community",
                icon: Mail, color: "#00F0FF",
                gradient: "linear-gradient(135deg, #00F0FF 0%, #0080FF 100%)", btnText: "text-white"
              },
              {
                label: "GitHub Hub", val: "github.com/devlinkorg", href: "https://github.com",
                icon: Github, color: "#FFFFFF",
                gradient: "linear-gradient(135deg, #ffffff 0%, #a1a1aa 100%)", btnText: "text-black"
              },
              {
                label: "Discord Community", val: "Join Builder Network", href: "#",
                icon: DiscordIcon, color: "#5865F2",
                gradient: "linear-gradient(135deg, #5865F2 0%, #4752C4 100%)", btnText: "text-white"
              },
              {
                label: "LinkedIn Network", val: "DevLink Network", href: "https://linkedin.com",
                icon: Linkedin, color: "#0A66C2",
                gradient: "linear-gradient(135deg, #0A66C2 0%, #004182 100%)", btnText: "text-white"
              },
              {
                label: "Instagram Page", val: "@devlink.community", href: "https://instagram.com",
                icon: Instagram, color: "#E1306C",
                // The authentic Instagram brand gradient
                gradient: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                btnText: "text-white"
              }
            ].map((info, i) => (
              <SpotlightCard
                key={i}
                accent={info.color}
                className="p-5 flex flex-col justify-center group border border-white/5 hover:border-white/15 transition-all duration-300 relative"
              >
                {/* Invisible link wrapper covering the whole card */}
                <a href={info.href} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-20" aria-label={info.label} />

                <div className="flex items-center gap-4 relative z-10">

                  {/* Neon Icon Container */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110 relative overflow-hidden shrink-0"
                    style={{
                      backgroundColor: `${info.color}10`,
                      borderColor: `${info.color}25`,
                      boxShadow: `inset 0 0 12px ${info.color}05`
                    }}
                  >
                    {/* Subtle gradient flash inside the box on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                      style={{ backgroundImage: info.gradient }}
                    />
                    <info.icon size={20} color={info.color} style={{ color: info.color }} className="relative z-10" />
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 text-left relative">
                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1 group-hover:text-zinc-400 transition-colors duration-300">
                      {info.label}
                    </p>

                    {/* Gradient Text Crossfade Magic */}
                    <div className="relative">
                      {/* The base gray text that fades out */}
                      <p className="text-sm font-bold text-zinc-300 group-hover:opacity-0 transition-opacity duration-300">
                        {info.val}
                      </p>
                      {/* The gradient text that fades in right on top of it */}
                      <p
                        className="text-sm font-bold absolute left-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-transparent bg-clip-text"
                        style={{ backgroundImage: info.gradient }}
                      >
                        {info.val}
                      </p>
                    </div>
                  </div>

                  {/* Action Icon Button */}
                  <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center text-zinc-500 group-hover:border-transparent group-hover:scale-110 transition-all duration-300 shrink-0 shadow-lg relative overflow-hidden">
                    {/* Base background */}
                    <div className="absolute inset-0 bg-white/[0.02] group-hover:opacity-0 transition-opacity duration-300" />

                    {/* Gradient background that fades in */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ backgroundImage: info.gradient }}
                    />

                    <ArrowUpRight size={14} className={`relative z-10 transition-colors duration-300 group-hover:${info.btnText}`} />
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </section>

        {/* PARTNERSHIP/SPONSORSHIP BLOCK */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-32 relative z-10"
        >
          {/* Header */}
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(0,240,255,0.05)]">
              <Network size={14} className="text-[#00F0FF]" />
              <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#00F0FF] uppercase">
                Ecosystem Growth
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5 tracking-tight">
              Partner With The <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#7B61FF]">
                Developer Community.
              </span>
            </h2>
            <p className="text-base text-zinc-400 font-light leading-relaxed max-w-xl">
              DevLink collaborates with universities, open-source foundations, and developer tools to create grassroots, high-impact builder programs.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">

            {/* Partnership Card */}
            <SpotlightCard className="p-8 lg:p-10 h-full flex flex-col group border border-white/5 hover:border-[#00F0FF]/30 transition-colors duration-500">
              <div className="w-12 h-12 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/20 flex items-center justify-center mb-6 shadow-inner">
                <Users size={24} className="text-[#00F0FF]" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-6 tracking-tight">
                Community Partnerships
              </h3>

              <ul className="space-y-4 mb-10 flex-1">
                {[
                  "University Tech Chapters",
                  "Open-Source Foundations",
                  "Regional Developer Groups",
                  "Co-hosted Builder Meetups"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-zinc-400 font-light group/item hover:text-zinc-200 transition-colors">
                    <CheckCircle2 size={16} className="text-[#00FFA3] shrink-0 mt-0.5 group-hover/item:shadow-[0_0_10px_rgba(0,255,163,0.5)] rounded-full transition-all" />
                    {item}
                  </li>
                ))}
              </ul>

              <button className="w-full h-12 rounded-xl bg-white/[0.03] hover:bg-[#00F0FF]/10 border border-white/10 hover:border-[#00F0FF]/30 text-sm font-bold text-white transition-all flex items-center justify-center gap-2 group/btn">
                Become a Partner <ArrowRight size={16} className="text-[#00F0FF] group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </SpotlightCard>

            {/* Sponsorship Card */}
            <SpotlightCard className="p-8 lg:p-10 h-full flex flex-col group border border-white/5 hover:border-[#FF1CF7]/30 transition-colors duration-500">
              <div className="w-12 h-12 rounded-xl bg-[#FF1CF7]/10 border border-[#FF1CF7]/20 flex items-center justify-center mb-6 shadow-inner">
                <Heart size={24} className="text-[#FF1CF7]" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-6 tracking-tight">
                Sponsorship Opportunities
              </h3>

              <ul className="space-y-4 mb-10 flex-1">
                {[
                  "Global Hackathon Prizes",
                  "Open-Source Bounties",
                  "Venue & Infrastructure Grants",
                  "API & Tooling Credits"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-zinc-400 font-light group/item hover:text-zinc-200 transition-colors">
                    <CheckCircle2 size={16} className="text-[#FF1CF7] shrink-0 mt-0.5 group-hover/item:shadow-[0_0_10px_rgba(255,28,247,0.5)] rounded-full transition-all" />
                    {item}
                  </li>
                ))}
              </ul>

              <button className="w-full h-12 rounded-xl bg-white/[0.03] hover:bg-[#FF1CF7]/10 border border-white/10 hover:border-[#FF1CF7]/30 text-sm font-bold text-white transition-all flex items-center justify-center gap-2 group/btn">
                Sponsor the Network <ArrowRight size={16} className="text-[#FF1CF7] group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </SpotlightCard>

          </div>
        </motion.section>

        <section className="relative w-full py-32 md:py-48 px-6 text-center overflow-hidden">
  {/* Edge-to-edge background glow */}
  <div className="absolute inset-0 z-0">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-r from-[#00F0FF]/20 to-[#7B61FF]/20 blur-[150px] rounded-full" />
  </div>

  <div className="relative z-10 max-w-4xl mx-auto">
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.9]"
    >
      Ready To Build <br />
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#7B61FF] to-[#FF1CF7]">
        Together?
      </span>
    </motion.h2>

    <motion.p 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className="text-lg md:text-xl text-zinc-400 font-light max-w-xl mx-auto mb-12 leading-relaxed"
    >
      Join the future of grassroots developer ecosystems. Open a transmission, connect with your next crew, and start shipping your ideas into the real world.
    </motion.p>

    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
      className="flex flex-col sm:flex-row items-center justify-center gap-4"
    >
      <button
        onClick={() => {
          if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
            setTimeout(() => nameInputRef.current?.focus(), 800);
          }
        }}
        className="group h-16 px-10 rounded-2xl bg-white text-black font-bold text-base hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_40px_rgba(255,255,255,0.15)] flex items-center gap-3"
      >
        Start A Conversation <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </button>

      <Link 
        href="/join"
        className="h-16 px-10 rounded-2xl border border-white/10 bg-white/5 text-white font-bold text-base hover:bg-white/10 transition-all flex items-center gap-3 backdrop-blur-sm"
      >
        <Terminal size={18} className="text-[#00F0FF]" /> Join the Network
      </Link>
    </motion.div>
  </div>
</section>

      </main>
    </div>
  );
}