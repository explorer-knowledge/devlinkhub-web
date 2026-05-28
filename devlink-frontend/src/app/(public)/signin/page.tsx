"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Github, 
  ArrowLeft, 
  Mail, 
  Lock, 
  Zap, 
  ArrowRight,
  Activity,
  Fingerprint
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fake telemetry feed for returning users
  const [telemetryLines, setTelemetryLines] = useState<string[]>([
    "INIT_REQ: Checking local cache for active tokens...",
    "PING: Node devlink-auth-us-east-1 active."
  ]);

  useEffect(() => {
    const lines = [
      "AUTH_VERIFY: Checking session integrity...",
      "SYNC: Establishing WebSocket to Matrix Core...",
      "AWAITING_INPUT: Please provide credentials to unlock node."
    ];
    let step = 0;
    const interval = setInterval(() => {
      if (step < lines.length) {
        setTelemetryLines(prev => [...prev, lines[step]]);
        step++;
      } else {
        clearInterval(interval);
      }
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API Auth call
    setTimeout(() => setIsSubmitting(false), 2000);
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 font-sans selection:bg-[#00F0FF]/30 flex flex-col md:flex-row overflow-hidden">
      
      {/* ─── LEFT COLUMN: BRANDING & VISUALS ─── */}
      <div className="hidden md:flex md:w-1/2 relative flex-col justify-between p-12 lg:p-20 border-r border-white/10 overflow-hidden bg-[#050505]">
        
        {/* Ambient Backglow */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }} 
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[20%] -left-[20%] w-[800px] h-[800px] bg-[#7B61FF]/[0.05] blur-[150px] rounded-full mix-blend-screen" 
          />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.15, 0.05] }} 
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[0%] right-[0%] w-[600px] h-[600px] bg-[#00F0FF]/[0.05] blur-[120px] rounded-full mix-blend-screen" 
          />
        </div>

        {/* Top Logo */}
        <Link href="/" className="relative z-10 inline-flex items-center group w-fit">
          <div className="absolute inset-0 bg-[#00F0FF]/0 group-hover:bg-[#00F0FF]/15 blur-xl transition-all duration-500 rounded-full" />
          <img
            src="/logos/DevLink_Text_Logo-white.png"
            alt="DevLink"
            className="h-8 w-auto object-contain drop-shadow-[0_0_10px_rgba(0,240,255,0.1)] transition-all duration-500"
            onError={(e) => { 
              e.currentTarget.style.display = "none";
              e.currentTarget.parentElement?.insertAdjacentHTML('beforeend', '<span class="text-2xl font-black text-white tracking-tighter">DEVLINK</span>')
            }}
          />
        </Link>

        {/* Middle Content (Telemetry Mockup) */}
        <div className="relative z-10 w-full max-w-lg mt-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="rounded-2xl bg-black/40 border border-white/10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00FFA3] animate-pulse shadow-[0_0_8px_#00FFA3]" />
                <span className="text-[10px] font-mono text-zinc-400 tracking-widest uppercase">System Telemetry</span>
              </div>
              <Activity size={12} className="text-zinc-500" />
            </div>
            <div className="p-6 font-mono text-[11px] sm:text-xs leading-relaxed text-zinc-500 space-y-2 h-[200px] overflow-y-auto scrollbar-hide">
              {telemetryLines.map((line, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={index === telemetryLines.length - 1 ? "text-[#00F0FF]" : ""}
                >
                  <span className="text-[#7B61FF] mr-2">›</span> {line}
                </motion.div>
              ))}
              <motion.div 
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="w-2 h-3 bg-[#00F0FF] mt-2 inline-block align-middle"
              />
            </div>
          </motion.div>
        </div>

        {/* Bottom Status Proof */}
        <div className="relative z-10 mt-12 border-t border-white/5 pt-8">
          <div className="flex items-center gap-6">
             <div>
               <p className="text-2xl font-bold text-white mb-1 tracking-tight">99.9%</p>
               <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Uptime</p>
             </div>
             <div className="w-px h-10 bg-white/10" />
             <div>
               <p className="text-2xl font-bold text-white mb-1 tracking-tight">~12ms</p>
               <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Global Latency</p>
             </div>
             <div className="w-px h-10 bg-white/10" />
             <div>
               <p className="text-2xl font-bold text-white mb-1 tracking-tight flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-[#00FFA3] shadow-[0_0_10px_#00FFA3]" /> Live
               </p>
               <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">API Status</p>
             </div>
          </div>
        </div>
      </div>

      {/* ─── RIGHT COLUMN: THE FORM ─── */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center relative min-h-screen p-6 sm:p-12 z-10">
        
        {/* Mobile-only background effects */}
        <div className="absolute inset-0 pointer-events-none md:hidden z-0">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[#7B61FF]/[0.1] blur-[120px] rounded-full mix-blend-screen" />
        </div>

        {/* Mobile Header (Hidden on Desktop) */}
        <div className="w-full flex justify-between items-center md:hidden mb-12 relative z-10">
          <Link href="/" className="inline-flex items-center">
            <img src="/logos/DevLink_Text_Logo-white.png" alt="DevLink" className="h-6 w-auto" onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.parentElement?.insertAdjacentHTML('beforeend', '<span class="text-xl font-black text-white tracking-tighter">DEVLINK</span>') }} />
          </Link>
          <Link href="/" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400">
            <ArrowLeft size={16} />
          </Link>
        </div>

        <motion.div 
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="w-full max-w-[440px] relative z-10"
        >
          <motion.div variants={fadeUp} className="mb-0">
            <div className="flex items-center gap-4 mb-2">
              <Link href="/" className="inline-flex items-center text-zinc-500 hover:text-white transition-colors group">
                <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
              </Link>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Access Node
              </h1>
            </div>
            <p className="text-zinc-400 text-sm sm:text-base">
              Welcome back to the matrix. Authenticate to sync your local environment.
            </p>
          </motion.div>

          {/* Email Form */}
          <motion.form variants={fadeUp} onSubmit={handleSubmit} className="space-y-5 mt-8">
            
            <div className="relative group">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#00F0FF] transition-colors" />
              <input 
                type="email" 
                required
                placeholder="Email Address / Phone Number"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 text-white placeholder-zinc-600 focus:outline-none focus:border-[#00F0FF]/50 focus:ring-1 focus:ring-[#00F0FF]/50 transition-all shadow-inner"
              />
            </div>

            <div className="space-y-2">
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#00F0FF] transition-colors" />
                <input 
                  type="password" 
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 text-white placeholder-zinc-600 focus:outline-none focus:border-[#00F0FF]/50 focus:ring-1 focus:ring-[#00F0FF]/50 transition-all shadow-inner"
                />
              </div>
              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-xs font-medium text-zinc-500 hover:text-[#00F0FF] transition-colors">
                  Forgot your keys?
                </Link>
              </div>
            </div>

            <button 
              disabled={isSubmitting}
              type="submit"
              className="group relative w-full h-14 mt-2 inline-flex items-center justify-center overflow-hidden rounded-xl bg-white px-8 font-bold text-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_35px_rgba(255,255,255,0.3)] disabled:opacity-70 disabled:hover:scale-100"
            >
              {/* Sweep Hover Element */}
              <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-700 group-hover:[transform:skew(-12deg)_translateX(150%)] z-0">
                <div className="relative h-full w-12 bg-black/[0.15]" />
              </div>
              
              <span className="relative z-10 flex items-center gap-2">
                {isSubmitting ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <Zap size={18} className="text-[#00F0FF]" fill="#00F0FF" />
                  </motion.div>
                ) : (
                  <>
                    <Fingerprint size={18} className="text-[#00F0FF]" />
                    Sign In with Email
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </motion.form>

          {/* OR divider */}
          <motion.div variants={fadeUp} className="flex items-center gap-4 my-6">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-sm font-mono text-zinc-500 uppercase tracking-widest">Or</span>
            <div className="h-px bg-white/10 flex-1" />
          </motion.div>

          {/* Google and GitHub buttons in a single row */}
          <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3">
            <button className="h-12 flex items-center justify-center gap-2 bg-white/[0.03] hover:bg-white/[0.08] text-white font-medium rounded-xl border border-white/10 transition-all active:scale-[0.98]">
              <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>
            <button className="h-12 flex items-center justify-center gap-2 bg-white/[0.03] hover:bg-white/[0.08] text-white font-medium rounded-xl border border-white/10 transition-all active:scale-[0.98]">
              <Github size={18} />
              Sign in with GitHub
            </button>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Link href="/join" className="block text-center text-sm text-zinc-400 mt-6 hover:text-[#00F0FF] transition-colors">
              Create Newone? Signup
            </Link>
          </motion.div>

        </motion.div>
      </div>

    </div>
  );
}