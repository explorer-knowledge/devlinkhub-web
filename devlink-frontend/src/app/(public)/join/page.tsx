"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Github, ArrowLeft, Mail, User, Zap, ArrowRight,
  Code2, Cpu, Globe2, Layers, Palette, TerminalSquare, 
  CheckCircle2, Database, Box
} from "lucide-react";

// ─── ONBOARDING DATA ───

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
  "Node.js", "Solidity", "PyTorch", "Tailwind", "PostgreSQL", "Docker"
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    role: "",
    tech: [] as string[]
  });

  // Dynamic Terminal based on step
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  
  useEffect(() => {
    const logs = {
      1: [
        "Initializing DevLink secure connection...",
        "Establishing handshake with global matrix...",
        "Awaiting user authentication vector..."
      ],
      2: [
        `AUTH_SUCCESS: Welcome, ${formData.username || 'Builder'}.`,
        "Querying global ecosystem roles...",
        "Awaiting structural assignment..."
      ],
      3: [
        `ROLE_ASSIGNED: ${formData.role.toUpperCase()}`,
        "Scanning local environment for dependencies...",
        "Awaiting tech stack configuration..."
      ],
      4: [
        "SYNCING_STACK: Processing selected frameworks...",
        "Generating unique builder profile...",
        "Allocating ecosystem resources...",
        "BOOT_SEQUENCE_COMPLETE. Redirecting to core..."
      ]
    };

    setTerminalLogs(logs[step as keyof typeof logs] || []);
  }, [step, formData.username, formData.role]);

  // Handlers
  const handleNext = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (step < 4) setStep(prev => prev + 1);
    if (step === 3) {
      // Simulate final onboarding creation
      setStep(4);
      setIsSubmitting(true);
      setTimeout(() => {
        router.push("/dashboard"); // Redirect to app after onboarding
      }, 3000);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  const toggleTech = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      tech: prev.tech.includes(tech) 
        ? prev.tech.filter(t => t !== tech)
        : [...prev.tech, tech]
    }));
  };

  // Animations
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 font-sans selection:bg-[#00F0FF]/30 flex flex-col md:flex-row overflow-hidden">
      
      {/* ─── LEFT COLUMN: BRANDING & DYNAMIC TERMINAL ─── */}
      <div className="hidden md:flex md:w-[45%] relative flex-col justify-between p-12 lg:p-20 border-r border-white/10 overflow-hidden bg-[#050505]">
        
        {/* Ambient Backglows */}
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

        {/* Top Logo */}
        <Link href="/" className="relative z-10 inline-flex items-center group w-fit">
          <div className="absolute inset-0 bg-[#00F0FF]/0 group-hover:bg-[#00F0FF]/15 blur-xl transition-all duration-500 rounded-full" />
          <img src="/logos/DevLink_Text_Logo-white.png" alt="DevLink" className="h-8 w-auto object-contain drop-shadow-[0_0_10px_rgba(0,240,255,0.1)]" onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.parentElement?.insertAdjacentHTML('beforeend', '<span class="text-2xl font-black text-white tracking-tighter">DEVLINK</span>')}} />
        </Link>

        {/* Middle Content (Terminal Mockup) */}
        <div className="relative z-10 w-full max-w-lg mt-12">
          <motion.div 
            layout
            className="rounded-2xl bg-black/40 border border-white/10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl"
          >
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
              <motion.div 
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="w-2 h-4 bg-[#00FFA3] mt-2 inline-block align-middle"
              />
            </div>
          </motion.div>
        </div>

        {/* Bottom Progress Stats */}
        <div className="relative z-10 mt-12 pt-8 border-t border-white/10 flex items-center justify-between text-sm font-mono text-zinc-500">
          <span>STEP 0{step} / 03</span>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${step >= 1 ? 'bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]' : 'bg-white/10'}`} />
            <span className={`w-2 h-2 rounded-full ${step >= 2 ? 'bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]' : 'bg-white/10'}`} />
            <span className={`w-2 h-2 rounded-full ${step >= 3 ? 'bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]' : 'bg-white/10'}`} />
          </div>
        </div>
      </div>

      {/* ─── RIGHT COLUMN: INTERACTIVE ONBOARDING ─── */}
      <div className="w-full md:w-[55%] flex flex-col relative min-h-screen z-10 bg-[#030303]">
        
        {/* Mobile Header */}
        <div className="w-full flex justify-between items-center md:hidden p-6 relative z-10">
          <Link href="/" className="inline-flex items-center">
            <img src="/logos/DevLink_Text_Logo-white.png" alt="DevLink" className="h-6 w-auto" onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.parentElement?.insertAdjacentHTML('beforeend', '<span class="text-xl font-black text-white tracking-tighter">DEVLINK</span>') }} />
          </Link>
          <div className="text-xs font-mono text-zinc-500">STEP {step}/3</div>
        </div>

        {/* Top Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-white/5 z-20">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#00F0FF] to-[#7B61FF]"
            initial={{ width: "0%" }}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        <div className="flex-1 flex flex-col justify-center px-6 sm:px-16 lg:px-24 w-full max-w-[700px] mx-auto py-12">
          
          <AnimatePresence mode="wait">
            
            {/* ─── STEP 1: INITIAL AUTH ─── */}
            {step === 1 && (
              <motion.div key="step1" variants={fadeUp} initial="hidden" animate="visible" exit="exit" className="w-full">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors group mb-8">
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Core
                </Link>

                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">Initialize Profile</h1>
                <p className="text-zinc-400 text-sm sm:text-base mb-8">Connect your GitHub to verify commits and instantly match with your next crew.</p>

                <div className="space-y-4 mb-8">
                  <button onClick={() => setStep(2)} className="w-full h-14 flex items-center justify-center gap-3 bg-white text-black font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                    <Github size={20} /> Continue with GitHub
                  </button>
                  <button onClick={() => setStep(2)} className="w-full h-14 flex items-center justify-center gap-3 bg-white/[0.03] hover:bg-white/[0.08] text-white font-medium rounded-xl border border-white/10 transition-all active:scale-[0.98]">
                    Continue with Google
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-8">
                  <div className="h-px bg-white/10 flex-1" />
                  <span className="text-xs font-mono text-zinc-600 uppercase tracking-widest">Or setup manually</span>
                  <div className="h-px bg-white/10 flex-1" />
                </div>

                <form onSubmit={handleNext} className="space-y-4">
                  <div className="relative group">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#00F0FF] transition-colors" />
                    <input 
                      type="text" required placeholder="Developer Alias (Username)"
                      value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})}
                      className="w-full h-14 bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 text-white placeholder-zinc-600 focus:outline-none focus:border-[#00F0FF]/50 focus:ring-1 focus:ring-[#00F0FF]/50 transition-all shadow-inner"
                    />
                  </div>
                  <div className="relative group">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#00F0FF] transition-colors" />
                    <input 
                      type="email" required placeholder="Secure Email Address"
                      value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full h-14 bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 text-white placeholder-zinc-600 focus:outline-none focus:border-[#00F0FF]/50 focus:ring-1 focus:ring-[#00F0FF]/50 transition-all shadow-inner"
                    />
                  </div>
                  
                  <button type="submit" className="group relative w-full h-14 mt-4 inline-flex items-center justify-center overflow-hidden rounded-xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white hover:text-black transition-all">
                    Next Step <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
                
                <div className="mt-8 text-center text-sm text-zinc-400">
                  Already have a node? <Link href="/signin" className="text-white font-bold hover:text-[#00F0FF] transition-colors">Sign In</Link>
                </div>
              </motion.div>
            )}

            {/* ─── STEP 2: SELECT ROLE ─── */}
            {step === 2 && (
              <motion.div key="step2" variants={fadeUp} initial="hidden" animate="visible" exit="exit" className="w-full">
                <button onClick={handleBack} className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors group mb-8">
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
                </button>

                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">Identify your Class</h1>
                <p className="text-zinc-400 text-sm sm:text-base mb-8">Select your primary discipline. This customizes your guild recommendations and project matches.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                  {ROLES.map((role) => {
                    const isSelected = formData.role === role.id;
                    return (
                      <button
                        key={role.id}
                        onClick={() => setFormData({...formData, role: role.id})}
                        className={`relative p-5 rounded-2xl border text-left transition-all duration-300 flex flex-col gap-4 ${
                          isSelected 
                            ? 'bg-white/5 border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.05)]' 
                            : 'bg-black/40 border-white/5 hover:border-white/15 hover:bg-white/[0.02]'
                        }`}
                      >
                        {isSelected && <CheckCircle2 size={18} className="absolute top-4 right-4 text-white" />}
                        <div className="w-10 h-10 rounded-xl bg-black border border-white/10 flex items-center justify-center shadow-inner">
                          <role.icon size={18} style={{ color: role.color }} />
                        </div>
                        <span className="font-bold text-white text-sm">{role.label}</span>
                      </button>
                    )
                  })}
                </div>

                <button 
                  onClick={handleNext} 
                  disabled={!formData.role}
                  className="group w-full h-14 inline-flex items-center justify-center rounded-xl bg-white text-black font-bold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                  Confirm Classification <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}

            {/* ─── STEP 3: TECH STACK ─── */}
            {step === 3 && (
              <motion.div key="step3" variants={fadeUp} initial="hidden" animate="visible" exit="exit" className="w-full">
                <button onClick={handleBack} className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors group mb-8">
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
                </button>

                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">Equip your Stack</h1>
                <p className="text-zinc-400 text-sm sm:text-base mb-8">Select the primary tools, frameworks, and languages you use to build.</p>

                <div className="flex flex-wrap gap-3 mb-12">
                  {TECH_STACK.map((tech) => {
                    const isSelected = formData.tech.includes(tech);
                    return (
                      <button
                        key={tech}
                        onClick={() => toggleTech(tech)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
                          isSelected 
                            ? 'bg-[#00F0FF]/10 border-[#00F0FF]/30 text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.15)]' 
                            : 'bg-white/[0.03] border-white/5 text-zinc-400 hover:bg-white/[0.08] hover:text-white'
                        }`}
                      >
                        {tech}
                      </button>
                    )
                  })}
                </div>

                <button 
                  onClick={handleNext} 
                  disabled={formData.tech.length === 0}
                  className="group relative w-full h-14 inline-flex items-center justify-center overflow-hidden rounded-xl bg-white text-black font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:hover:scale-100"
                >
                  <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-700 group-hover:[transform:skew(-12deg)_translateX(150%)] z-0">
                    <div className="relative h-full w-12 bg-black/[0.15]" />
                  </div>
                  <span className="relative z-10 flex items-center gap-2">
                    <Zap size={18} className="text-[#7B61FF]" fill="#7B61FF" />
                    Enter the Matrix
                  </span>
                </button>
              </motion.div>
            )}

            {/* ─── STEP 4: PROCESSING / LOADING ─── */}
            {step === 4 && (
              <motion.div key="step4" variants={fadeUp} initial="hidden" animate="visible" exit="exit" className="w-full flex flex-col items-center justify-center text-center py-20">
                <div className="relative mb-8">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }} className="w-24 h-24 rounded-full border-2 border-dashed border-[#00F0FF]/30 border-t-[#00F0FF]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <TerminalSquare size={24} className="text-[#00F0FF] animate-pulse" />
                  </div>
                </div>
                
                <h1 className="text-2xl font-bold text-white tracking-tight mb-2">Syncing Node to Core...</h1>
                <p className="text-zinc-500 text-sm max-w-sm mx-auto font-mono">
                  Finalizing {formData.username || 'builder'} configuration and matching ecosystem guilds.
                </p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}