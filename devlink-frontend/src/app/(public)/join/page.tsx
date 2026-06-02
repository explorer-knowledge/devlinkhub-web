"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github, ArrowLeft, Mail, User, Zap, ArrowRight,
  Code2, Cpu, Globe2, Layers, Palette, TerminalSquare,
  CheckCircle2, Database, Box, Camera, FileText, Link2, SkipForward,
} from "lucide-react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  updateProfile,
  getAdditionalUserInfo,
} from "firebase/auth";
import { auth } from "@/utils/firebase";
import { useAuth } from "@/context/AuthContext";

// ─── Onboarding Data ──────────────────────────────────────────────────────────

const ROLES = [
  { id: "frontend", label: "Frontend Engineer", icon: Layers, color: "#00F0FF" },
  { id: "backend", label: "Backend Engineer", icon: Database, color: "#00FFA3" },
  { id: "ai_ml", label: "AI/ML Builder", icon: Cpu, color: "#FF1CF7" },
  { id: "web3", label: "Web3/Blockchain", icon: Globe2, color: "#F59E0B" },
  { id: "design", label: "UI/UX Designer", icon: Palette, color: "#7B61FF" },
  { id: "founder", label: "Startup Founder", icon: Box, color: "#FF5F56" },
];

const TECH_STACK = [
  "React", "Next.js", "TypeScript", "Python", "Rust", "Go",
  "Node.js", "Solidity", "PyTorch", "Tailwind", "PostgreSQL", "Docker",
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const { syncWithBackend } = useAuth();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isOAuthFlow, setIsOAuthFlow] = useState(false);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:10000";

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    role: "",
    tech: [] as string[],
  });

  // Optional profile completion fields (step 4)
  const [profileData, setProfileData] = useState({
    bio: "",
    githubUrl: "",
    avatarUrl: "",
    firstName: "",
    lastName: "",
  });

  const avatarFileRef = useRef<HTMLInputElement>(null);

  // Dynamic terminal based on current step
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  useEffect(() => {
    const logs: Record<number, string[]> = {
      1: [
        "Initializing DevLink secure connection...",
        "Establishing handshake with global matrix...",
        "Awaiting user authentication vector...",
      ],
      2: [
        `AUTH_SUCCESS: Welcome, ${formData.username || "Builder"}.`,
        "Querying global ecosystem roles...",
        "Awaiting structural assignment...",
      ],
      3: [
        `ROLE_ASSIGNED: ${formData.role.toUpperCase()}`,
        "Scanning local environment for dependencies...",
        "Awaiting tech stack configuration...",
      ],
      4: [
        "STACK_INDEXED: Frameworks loaded into memory.",
        "OPTIONAL: Personalizing developer identity layer...",
        "You may skip this step and configure later.",
      ],
      5: [
        "SYNCING_STACK: Processing selected frameworks...",
        "Generating unique builder profile...",
        "Allocating ecosystem resources...",
        "BOOT_SEQUENCE_COMPLETE. Redirecting to core...",
      ],
    };
    setTerminalLogs(logs[step] || []);
  }, [step, formData.username, formData.role]);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleNext = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");

    if (step === 1) {
      if (!formData.email || !formData.password) {
        setError("Please fill in all fields.");
        return;
      }
      // Prepopulate username
      if (!formData.username) {
        const defaultUsername = formData.email.split("@")[0] || "";
        setFormData(prev => ({ ...prev, username: defaultUsername }));
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!formData.username) {
        setError("Please enter a username.");
        return;
      }
      setIsSubmitting(true);
      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/check-username?username=${formData.username}`);
        const data = await res.json();
        if (!data.available) {
          setError("Username is already taken.");
          setIsSubmitting(false);
          return;
        }
      } catch (err) {}
      setIsSubmitting(false);
      if (!formData.role) { setError("Please select a role."); return; }
      setStep(3);
      return;
    }

    if (step === 3) {
      if (formData.tech.length === 0) { setError("Select at least one technology."); return; }
      // Move to optional profile step
      setStep(4);
      return;
    }

    if (step === 4) {
      if (!profileData.firstName || !profileData.lastName || !profileData.githubUrl || !profileData.bio) {
        setError("All fields need to be filled to Save & Launch.");
        return;
      }
      try {
        const url = new URL(profileData.githubUrl);
        if (url.protocol !== "http:" && url.protocol !== "https:") {
          throw new Error();
        }
      } catch (_) {
        setError("Please enter a valid GitHub profile URL (starting with https:// or http://).");
        return;
      }
      // This branch handles the "Complete Profile" submit (with fields filled)
      await submitAndFinalize();
    }
  };

  const submitAndFinalize = async (skip = false) => {
    setStep(5);
    setIsSubmitting(true);
    try {
      if (!isOAuthFlow) {
        const cred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await updateProfile(cred.user, { displayName: formData.username });
      }

      const syncPayload: Record<string, string> = {
        username: formData.username,
        role: formData.role,
        skills: JSON.stringify(formData.tech),
      };

      if (!skip) {
        if (profileData.bio) syncPayload.bio = profileData.bio;
        if (profileData.githubUrl) syncPayload.githubUrl = profileData.githubUrl;
        if (profileData.avatarUrl) syncPayload.avatar = profileData.avatarUrl;
        if (profileData.firstName) syncPayload.firstName = profileData.firstName;
        if (profileData.lastName) syncPayload.lastName = profileData.lastName;
        if (profileData.firstName || profileData.lastName) {
          syncPayload.name = `${profileData.firstName} ${profileData.lastName}`.trim();
        }
      }

      await syncWithBackend(syncPayload);
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err: any) {
      setError(friendlyError(err.code));
      setStep(3);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOAuthSignUp = async (provider: "google" | "github") => {
    setError("");
    try {
      const p = provider === "google" ? new GoogleAuthProvider() : new GithubAuthProvider();
      const credential = await signInWithPopup(auth, p);
      const additionalInfo = getAdditionalUserInfo(credential);
      
      if (additionalInfo?.isNewUser) {
        setIsOAuthFlow(true);
        setFormData(prev => ({
          ...prev,
          username: credential.user.email?.split("@")[0] || ""
        }));
        setStep(2);
      } else {
        await syncWithBackend();
        router.push("/dashboard");
      }
    } catch (err: any) {
      if (err.code !== "auth/popup-closed-by-user") setError(friendlyError(err.code));
    }
  };

  const handleBack = () => { if (step > 1) setStep((p) => p - 1); };

  const toggleTech = (tech: string) =>
    setFormData((prev) => ({
      ...prev,
      tech: prev.tech.includes(tech) ? prev.tech.filter((t) => t !== tech) : [...prev.tech, tech],
    }));

  // ── Animations ───────────────────────────────────────────────────────────────

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 font-sans selection:bg-[#00F0FF]/30 flex flex-col md:flex-row overflow-hidden">

      {/* ─── LEFT COLUMN ─── */}
      <div className="hidden md:flex md:w-[45%] relative flex-col justify-between p-12 lg:p-20 border-r border-white/10 overflow-hidden bg-[#050505]">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[20%] -left-[20%] w-[800px] h-[800px] bg-[#00F0FF]/[0.05] blur-[150px] rounded-full mix-blend-screen"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[0%] right-[0%] w-[600px] h-[600px] bg-[#FF1CF7]/[0.05] blur-[120px] rounded-full mix-blend-screen"
          />
        </div>

        <Link href="/" className="relative z-10 inline-flex items-center group w-fit">
          <div className="absolute inset-0 bg-[#00F0FF]/0 group-hover:bg-[#00F0FF]/15 blur-xl transition-all duration-500 rounded-full" />
          <img src="/logos/DevLink_Text_Logo-white.png" alt="DevLink" className="h-8 w-auto object-contain" onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.parentElement?.insertAdjacentHTML("beforeend", '<span class="text-2xl font-black text-white tracking-tighter">DEVLINK</span>'); }} />
        </Link>

        <div className="relative z-10 w-full max-w-lg mt-12">
          <motion.div layout className="rounded-2xl bg-black/40 border border-white/10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
              <span className="ml-2 text-[10px] font-mono text-zinc-500">onboarding-node.sh</span>
            </div>
            <div className="p-6 font-mono text-xs sm:text-sm leading-relaxed text-zinc-400 min-h-[160px]">
              <AnimatePresence mode="popLayout">
                {terminalLogs.map((line, index) => (
                  <motion.div
                    key={line}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className={index === terminalLogs.length - 1 && step === 4 ? "text-[#00FFA3] font-bold" : ""}
                  >
                    <span className="text-[#FF1CF7] mr-2">❯</span> {line}
                  </motion.div>
                ))}
              </AnimatePresence>
              <motion.div animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-2 h-4 bg-[#00FFA3] mt-2 inline-block align-middle" />
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 mt-12 pt-8 border-t border-white/10 flex items-center justify-between text-sm font-mono text-zinc-500">
          <span>STEP 0{Math.min(step, 4)} / 04</span>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <span key={s} className={`w-2 h-2 rounded-full transition-all ${step >= s ? "bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]" : "bg-white/10"}`} />
            ))}
          </div>
        </div>
      </div>

      {/* ─── RIGHT COLUMN ─── */}
      <div className="w-full md:w-[55%] flex flex-col relative min-h-screen z-10 bg-[#030303]">

        {/* Mobile Header */}
        <div className="w-full flex justify-between items-center md:hidden p-6 relative z-10">
          <Link href="/"><img src="/logos/DevLink_Text_Logo-white.png" alt="DevLink" className="h-6 w-auto" onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.parentElement?.insertAdjacentHTML("beforeend", '<span class="text-xl font-black text-white tracking-tighter">DEVLINK</span>'); }} /></Link>
          <div className="text-xs font-mono text-zinc-500">STEP {step}/3</div>
        </div>

        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-white/5 z-20">
          <motion.div
            className="h-full bg-gradient-to-r from-[#00F0FF] to-[#7B61FF]"
            initial={{ width: "0%" }}
            animate={{ width: `${(Math.min(step, 4) / 4) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        <div className="flex-1 flex flex-col justify-center px-6 sm:px-16 lg:px-24 w-full max-w-[700px] mx-auto py-12">

          {/* Global error banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">

            {/* ── STEP 1: CREDENTIALS ── */}
            {step === 1 && (
              <motion.div key="step1" variants={fadeUp} initial="hidden" animate="visible" exit="exit" className="w-full">
                <div className="flex items-center gap-4 mb-2">
                  <Link href="/" className="inline-flex items-center text-zinc-500 hover:text-white transition-colors group">
                    <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                  </Link>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Initialize Profile</h1>
                </div>
                <p className="text-zinc-400 text-sm sm:text-base mb-8">Connect your account to build, collab, and ship with the DevLink matrix.</p>

                <form onSubmit={handleNext} className="space-y-4 mb-8">
                  <div className="relative group">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#00F0FF] transition-colors" />
                    <input
                      id="join-email"
                      type="email" required placeholder="Secure Email Address"
                      value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full h-14 bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 text-white placeholder-zinc-600 focus:outline-none focus:border-[#00F0FF]/50 focus:ring-1 focus:ring-[#00F0FF]/50 transition-all shadow-inner"
                    />
                  </div>
                  <div className="relative group">
                    <Zap size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#00F0FF] transition-colors" />
                    <input
                      id="join-password"
                      type="password" required placeholder="Password (min 6 chars)"
                      minLength={6}
                      value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full h-14 bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 text-white placeholder-zinc-600 focus:outline-none focus:border-[#00F0FF]/50 focus:ring-1 focus:ring-[#00F0FF]/50 transition-all shadow-inner"
                    />
                  </div>
                  <button id="join-next-1" type="submit" className="group relative w-full h-14 mt-4 inline-flex items-center justify-center overflow-hidden rounded-xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white hover:text-black transition-all">
                    Next Step <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>

                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px bg-white/10 flex-1" />
                  <span className="text-xs font-mono text-zinc-600 uppercase tracking-widest">Or sign up with</span>
                  <div className="h-px bg-white/10 flex-1" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button id="join-google" onClick={() => handleOAuthSignUp("google")} className="h-12 flex items-center justify-center gap-2 bg-white/[0.03] hover:bg-white/[0.08] text-white font-medium rounded-xl border border-white/10 transition-all active:scale-[0.98]">
                    <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google
                  </button>
                  <button id="join-github" onClick={() => handleOAuthSignUp("github")} className="h-12 flex items-center justify-center gap-2 bg-white/[0.03] hover:bg-white/[0.08] text-white font-medium rounded-xl border border-white/10 transition-all active:scale-[0.98]">
                    <Github size={18} /> GitHub
                  </button>
                </div>

                <Link href="/signin" className="block text-center text-sm text-zinc-400 mt-6 hover:text-[#00F0FF] transition-colors">
                  Already have an account? Sign in
                </Link>
              </motion.div>
            )}

            {/* ── STEP 2: SELECT ROLE ── */}
            {step === 2 && (
              <motion.div key="step2" variants={fadeUp} initial="hidden" animate="visible" exit="exit" className="w-full">
                <div className="flex items-center gap-4 mb-2">
                  <button onClick={handleBack} className="inline-flex items-center text-zinc-500 hover:text-white transition-colors group">
                    <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                  </button>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Identify your Class</h1>
                </div>
                <p className="text-zinc-400 text-sm sm:text-base mb-8">Select your primary discipline to customise guild and project matches.</p>

                <div className="relative group mb-6">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#00F0FF] transition-colors" />
                  <input
                    id="join-username"
                    type="text" required placeholder="Developer Alias (Username)"
                    value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full h-14 bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 text-white placeholder-zinc-600 focus:outline-none focus:border-[#00F0FF]/50 focus:ring-1 focus:ring-[#00F0FF]/50 transition-all shadow-inner"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-10 w-full sm:w-[95%]">
                  {ROLES.map((role) => {
                    const isSelected = formData.role === role.id;
                    return (
                      <button
                        key={role.id}
                        onClick={() => setFormData({ ...formData, role: role.id })}
                        className={`relative p-4 rounded-xl border text-left transition-all duration-300 flex flex-col gap-3 w-full ${
                          isSelected 
                            ? "bg-white border-white text-black shadow-[0_0_20px_rgba(255,255,255,0.15)]" 
                            : "bg-black/40 border-white/5 hover:border-white/15 hover:bg-white/[0.02] text-white"
                        }`}
                      >
                        {isSelected && <CheckCircle2 size={16} className="absolute top-3 right-3 text-black" />}
                        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shadow-inner ${
                          isSelected ? "bg-black/5 border-black/10" : "bg-black border-white/10"
                        }`}>
                          <role.icon size={16} style={{ color: isSelected ? "#000000" : role.color }} />
                        </div>
                        <span className={`font-bold text-sm ${isSelected ? "text-black" : "text-white"}`}>{role.label}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  id="join-next-2"
                  onClick={handleNext}
                  disabled={!formData.role || !formData.username}
                  className="group w-full h-14 inline-flex items-center justify-center rounded-xl bg-white text-black font-bold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                  Confirm Classification <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}

            {/* ── STEP 3: TECH STACK ── */}
            {step === 3 && (
              <motion.div key="step3" variants={fadeUp} initial="hidden" animate="visible" exit="exit" className="w-full">
                <div className="flex items-center gap-4 mb-2">
                  <button onClick={handleBack} className="inline-flex items-center text-zinc-500 hover:text-white transition-colors group">
                    <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                  </button>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Equip your Stack</h1>
                </div>
                <p className="text-zinc-400 text-sm sm:text-base mb-8">Select the primary tools, frameworks, and languages you use to build.</p>

                <div className="flex flex-wrap gap-3 mb-12">
                  {TECH_STACK.map((tech) => {
                    const isSelected = formData.tech.includes(tech);
                    return (
                      <button
                        key={tech}
                        onClick={() => toggleTech(tech)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${isSelected ? "bg-[#00F0FF]/10 border-[#00F0FF]/30 text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.15)]" : "bg-white/[0.03] border-white/5 text-zinc-400 hover:bg-white/[0.08] hover:text-white"}`}
                      >
                        {tech}
                      </button>
                    );
                  })}
                </div>

                <button
                  id="join-submit"
                  onClick={handleNext}
                  disabled={formData.tech.length === 0 || isSubmitting}
                  className="group relative w-full h-14 inline-flex items-center justify-center overflow-hidden rounded-xl bg-white text-black font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:hover:scale-100"
                >
                  <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-700 group-hover:[transform:skew(-12deg)_translateX(150%)] z-0">
                    <div className="relative h-full w-12 bg-black/[0.15]" />
                  </div>
                  <span className="relative z-10 flex items-center gap-2">
                    {isSubmitting ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                        <Zap size={18} className="text-[#7B61FF]" fill="#7B61FF" />
                      </motion.div>
                    ) : (
                      <><Zap size={18} className="text-[#7B61FF]" fill="#7B61FF" /> Enter the Matrix</>
                    )}
                  </span>
                </button>
              </motion.div>
            )}

            {/* ── STEP 4: OPTIONAL PROFILE COMPLETION ── */}
            {step === 4 && (
              <motion.div key="step4" variants={fadeUp} initial="hidden" animate="visible" exit="exit" className="w-full">
                <div className="flex items-center gap-4 mb-2">
                  <button onClick={handleBack} className="inline-flex items-center text-zinc-500 hover:text-white transition-colors group">
                    <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                  </button>
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Personalize Profile</h1>
                  </div>
                </div>
                <p className="text-zinc-400 text-sm sm:text-base mb-1">Stand out on the builder board. All fields are optional.</p>
                <div className="inline-flex items-center gap-1.5 mb-8 px-3 py-1 rounded-full bg-[#00FFA3]/10 border border-[#00FFA3]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00FFA3]" />
                  <span className="text-[10px] font-mono text-[#00FFA3] tracking-widest uppercase">Optional Step</span>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleNext(e); }} className="space-y-4">

                  {/* Name row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative group">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#00F0FF] transition-colors" />
                      <input
                        id="profile-firstname"
                        type="text"
                        placeholder="First Name"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                        className="w-full h-12 bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-[#00F0FF]/50 focus:ring-1 focus:ring-[#00F0FF]/20 transition-all"
                      />
                    </div>
                    <div className="relative group">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#00F0FF] transition-colors" />
                      <input
                        id="profile-lastname"
                        type="text"
                        placeholder="Last Name"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                        className="w-full h-12 bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-[#00F0FF]/50 focus:ring-1 focus:ring-[#00F0FF]/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* GitHub URL */}
                  <div className="relative group">
                    <Github size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#00F0FF] transition-colors" />
                    <input
                      id="profile-github"
                      type="url"
                      placeholder="GitHub Profile URL (https://github.com/username)"
                      value={profileData.githubUrl}
                      onChange={(e) => setProfileData({ ...profileData, githubUrl: e.target.value })}
                      className="w-full h-12 bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-[#00F0FF]/50 focus:ring-1 focus:ring-[#00F0FF]/20 transition-all"
                    />
                  </div>

                  {/* Bio */}
                  <div className="relative group">
                    <FileText size={16} className="absolute left-4 top-4 text-zinc-600 group-focus-within:text-[#00F0FF] transition-colors" />
                    <textarea
                      id="profile-bio"
                      placeholder="Short bio — what you build, your interests, goals... (optional)"
                      rows={3}
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 pt-3 pb-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-[#00F0FF]/50 focus:ring-1 focus:ring-[#00F0FF]/20 transition-all resize-none"
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      id="profile-submit"
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative flex-1 h-14 inline-flex items-center justify-center overflow-hidden rounded-xl bg-white text-black font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:hover:scale-100"
                    >
                      <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-700 group-hover:[transform:skew(-12deg)_translateX(150%)] z-0">
                        <div className="relative h-full w-12 bg-black/[0.15]" />
                      </div>
                      <span className="relative z-10 flex items-center gap-2">
                        <CheckCircle2 size={17} />
                        Save & Launch
                      </span>
                    </button>

                    <button
                      id="profile-skip"
                      type="button"
                      onClick={() => submitAndFinalize(true)}
                      disabled={isSubmitting}
                      className="sm:w-auto px-6 h-14 inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-white font-medium text-sm transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      <SkipForward size={16} />
                      Skip for now
                    </button>
                  </div>

                </form>
              </motion.div>
            )}

            {/* ── STEP 5: PROCESSING ── */}
            {step === 5 && (
              <motion.div key="step5" variants={fadeUp} initial="hidden" animate="visible" exit="exit" className="w-full flex flex-col items-center justify-center text-center py-20">
                <div className="relative mb-8">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }} className="w-24 h-24 rounded-full border-2 border-dashed border-[#00F0FF]/30 border-t-[#00F0FF]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <TerminalSquare size={24} className="text-[#00F0FF] animate-pulse" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-white tracking-tight mb-2">Syncing Node to Core...</h1>
                <p className="text-zinc-500 text-sm max-w-sm mx-auto font-mono">
                  Finalizing {formData.username || "builder"} configuration and matching ecosystem guilds.
                </p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─── Firebase error → human-readable ─────────────────────────────────────────

function friendlyError(code: string): string {
  const map: Record<string, string> = {
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/network-request-failed": "Network error. Check your connection.",
    "auth/account-exists-with-different-credential":
      "An account already exists with a different sign-in method.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
  };
  return map[code] ?? "Sign-up failed. Please try again.";
}