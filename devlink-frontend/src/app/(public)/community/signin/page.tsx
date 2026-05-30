"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, CheckCircle2, Github, Mail, User, Shield, 
  Sparkles, Calendar, MapPin, Award, Target, Link, ExternalLink,
  Cpu, Rocket, LayoutTemplate, Terminal
} from "lucide-react";

// Mock Data local copies to display details on the registration page
const EVENTS = [
  { title: "Syntax Weavers Hackathon", desc: "Collaborate on building complex state machines, parser engines, and UI layers under 48 hours.", type: "Sprint", date: "Nov 15-17", prize: "$10,000", attendees: 145, maxAttendees: 200, accent: "#7B61FF" },
  { title: "AI Agriculture Summit", desc: "Design autonomous agents that automate vertical farm scheduling and monitor crop telemetry.", type: "Ideathon", date: "Dec 02", prize: "$5,000", attendees: 84, maxAttendees: 150, accent: "#00FFA3" },
  { title: "Open Source Contrib Night", desc: "Fix active bugs on core frontend libraries and earn DevLink bounty badges.", type: "Workshop", date: "Nov 22", prize: "Bounties", attendees: 192, maxAttendees: 300, accent: "#00F0FF" },
  { title: "Founders Pitch Session", desc: "Early-stage startup teams pitch to a panel of venture capitalists and angels. Receive live feedback and raise pre-seed capital.", type: "Pitch", date: "Nov 20", prize: "Funding", attendees: 12, maxAttendees: 15, accent: "#F59E0B" }
];

const BUILDERS = [
  { name: "Rohit K.", role: "AI Engineer", avatar: "RK", bio: "Building autonomous agents for finance. Need frontend developer to ship MVP.", skills: ["Python", "LangChain", "FastAPI"], status: "Active", matchScore: 98, accent: "#FF1CF7" },
  { name: "Aanya S.", role: "UI/UX Designer", avatar: "AS", bio: "Designing rich SaaS tools & interactive dashboards. Looking for Next.js builders.", skills: ["Figma", "Design Systems", "Web3"], status: "Hiring", matchScore: 94, accent: "#00FFA3" },
  { name: "Nikhil P.", role: "Fullstack Developer", avatar: "NP", bio: "Ex-stripe engineer building P2P file sharing system. Looking for Rust engineers.", skills: ["TypeScript", "Next.js", "Postgres"], status: "Active", matchScore: 89, accent: "#00F0FF" },
  { name: "Meera R.", role: "Systems Engineer", avatar: "MR", bio: "Rustacean optimizing database queries and high-performance WebAssembly APIs.", skills: ["Rust", "Wasm", "Go"], status: "Available", matchScore: 92, accent: "#7B61FF" }
];

function SpotlightCard({ children, className = "", accent = "#00F0FF" }: { children: React.ReactNode, className?: string, accent?: string }) {
  return (
    <div className={`relative overflow-hidden bg-[#050505] border border-white/5 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05)] ${className}`}>
      <div 
        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-30 z-0"
        style={{ background: `radial-gradient(400px circle at 50% 50%, ${accent}15, transparent 50%)` }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

function RegisterContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "signin";
  const idParam = searchParams.get("id") || "";
  const redirectParam = searchParams.get("redirect") || "/community";

  // Auth User state
  const [user, setUser] = useState<{ name: string; username: string; email: string } | null>(null);
  
  // Registration States
  const [success, setSuccess] = useState<boolean>(false);
  const [signInData, setSignInData] = useState({ username: "", email: "", password: "" });
  
  // Custom Join (Sign Up) states
  const [authSubMode, setAuthSubMode] = useState<"signin" | "signup">("signin");
  const [signUpData, setSignUpData] = useState({ name: "", username: "", email: "", password: "", role: "AI Engineer", github: "" });
  const [isSigningUp, setIsSigningUp] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);
  
  // Form values
  const [eventForm, setEventForm] = useState({ teamName: "", role: "Developer", proposal: "", github: "" });
  const [pitchForm, setPitchForm] = useState({ message: "", portfolio: "", discord: "" });
  const [profileForm, setProfileForm] = useState({ name: "", role: "AI Engineer", bio: "", skills: "", projectTitle: "", equity: "2% - 5%", commitment: "20 hrs/wk", github: "" });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("devlink_auth_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // If not logged in, redirect them immediately to /signin with current page as redirect target
        const queryParams = window.location.search;
        const currentPath = window.location.pathname;
        window.location.href = `/signin?redirect=${encodeURIComponent(currentPath + queryParams)}`;
      }
    }
  }, []);

  // Redirect old layout types to their dedicated paths
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (type === "profile") {
        window.location.href = `/onboarding${window.location.search}`;
      } else if (type === "signup" || type === "join") {
        window.location.href = `/join${window.location.search}`;
      } else if (type === "signin") {
        window.location.href = `/signin${window.location.search}`;
      }
    }
  }, [type]);

  // Pre-fill pitch form if pitching to builder
  useEffect(() => {
    if (type === "pitch" && idParam) {
      setPitchForm(prev => ({
        ...prev,
        message: `Hey ${idParam.split(' ')[0]}, I saw you are looking for partners. I'd love to join forces to work on this project together!`
      }));
    }
  }, [type, idParam]);

  // Telemetry stream generator for Sign Up (Join Network)
  useEffect(() => {
    if (isSigningUp) {
      const allLogs = [
        "Connecting to DevLink decentralized identity server...",
        "Generating cryptographic keypair...",
        "Validating developer handle availability...",
        "Simulating GitHub OAuth webhook callback...",
        "Syncing developer index with regional nodes...",
        "Registering cryptographic identity in local storage...",
        "Simulating session authorization token...",
        "Redirecting to DevLink community portal..."
      ];
      let i = 0;
      const interval = setInterval(() => {
        if (i < allLogs.length) {
          setLogs(prev => [...prev, `[INFO] ${allLogs[i]}`]);
          i++;
        } else {
          clearInterval(interval);
          
          // Sign in user
          const userPayload = {
            name: signUpData.name || "Anonymous Builder",
            username: signUpData.username.replace('@', '') || "anonymous",
            email: signUpData.email || "anon@devlink.com"
          };
          localStorage.setItem("devlink_auth_user", JSON.stringify(userPayload));
          setUser(userPayload);
          
          // Automatically register them on the matcher board with their chosen details
          const avatarInitials = (signUpData.name || "U").split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
          const newBuilder = {
            name: signUpData.name,
            role: signUpData.role,
            avatar: avatarInitials || "U",
            bio: `Technical co-founder specialized in ${signUpData.role}. Building Next.js products & looking to collaborate.`,
            skills: signUpData.role === "AI Engineer" ? ["Python", "FastAPI", "LangChain"] : 
                    signUpData.role === "UI/UX Designer" ? ["Figma", "Tailwind", "Design Systems"] :
                    signUpData.role === "Fullstack Developer" ? ["TypeScript", "Next.js", "React"] :
                    ["Rust", "WebAssembly", "Go"],
            status: "Available",
            matchScore: 95,
            projectSpecs: { 
              title: "Hacker MVP", 
              equity: "2% - 5%", 
              commitment: "20 hrs/wk" 
            },
            techRadar: [
              { label: "Frontend", value: 90 },
              { label: "Backend", value: 85 }
            ],
            socials: { 
              github: signUpData.github || "https://github.com", 
              linkedin: "https://linkedin.com" 
            }
          };
          const stored = localStorage.getItem("devlink_custom_builders");
          const customList = stored ? JSON.parse(stored) : [];
          customList.push(newBuilder);
          localStorage.setItem("devlink_custom_builders", JSON.stringify(customList));

          // Go to community page
          window.location.href = redirectParam;
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isSigningUp, signUpData, redirectParam]);

  // Sign In submit handler — calls real backend API
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!signInData.email && !signInData.username) || !signInData.password) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:10000"}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: signInData.email || undefined,
          username: signInData.username.replace("@", "") || undefined,
          password: signInData.password,
        }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        const userPayload = {
          name: data.user.name || data.user.username,
          username: data.user.username,
          email: data.user.email,
          token: data.token,
        };
        localStorage.setItem("devlink_auth_user", JSON.stringify(userPayload));
        localStorage.setItem("devlink_auth_token", data.token);
        setUser(userPayload);
        window.location.href = redirectParam;
        return;
      } else {
        alert(data.error || "Login failed. Check credentials.");
        return;
      }
    } catch {
      alert("Cannot reach backend. Please check the server is running.");
    }
  };

  // Sign Up (Join) submit handler — calls real backend API then starts telemetry animation
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpData.name || !signUpData.username || !signUpData.email || !signUpData.password) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:10000"}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signUpData.name,
          username: signUpData.username.replace("@", ""),
          email: signUpData.email,
          password: signUpData.password,
          role: signUpData.role,
          githubUrl: signUpData.github,
        }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        // Store token immediately before telemetry animation saves user
        localStorage.setItem("devlink_auth_token", data.token);
        // Merge backend user into signUpData so telemetry effect picks it up
        setSignUpData(prev => ({ ...prev, name: data.user.name || prev.name, username: data.user.username || prev.username, email: data.user.email || prev.email }));
      } else {
        alert(data.error || "Registration failed.");
        return;
      }
    } catch {
      // Backend down — still allow the animation but skip token storage
    }
    setIsSigningUp(true);
  };

  // Event Registration submit
  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const eventIndex = parseInt(idParam);
    if (isNaN(eventIndex)) return;

    // Save registered event index in localStorage
    const stored = localStorage.getItem("devlink_registered_events");
    const currentList: number[] = stored ? JSON.parse(stored) : [];
    if (!currentList.includes(eventIndex)) {
      currentList.push(eventIndex);
      localStorage.setItem("devlink_registered_events", JSON.stringify(currentList));
    }
    
    setSuccess(true);
  };

  // Pitch submission
  const handlePitchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idParam) return;

    // Save pitch in localStorage
    const stored = localStorage.getItem("devlink_sent_pitches");
    const currentList: string[] = stored ? JSON.parse(stored) : [];
    if (!currentList.includes(idParam)) {
      currentList.push(idParam);
      localStorage.setItem("devlink_sent_pitches", JSON.stringify(currentList));
    }

    setSuccess(true);
  };

  // Add Profile submission
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name || !profileForm.bio) return;

    const skillsArray = profileForm.skills.split(",").map(s => s.trim()).filter(Boolean);
    const avatarInitials = profileForm.name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);

    const newBuilder = {
      name: profileForm.name,
      role: profileForm.role,
      avatar: avatarInitials || "U",
      bio: profileForm.bio,
      skills: skillsArray.length > 0 ? skillsArray : ["Next.js", "React"],
      status: "Available",
      matchScore: 90,
      projectSpecs: { 
        title: profileForm.projectTitle || "Secret MVP", 
        equity: profileForm.equity, 
        commitment: profileForm.commitment 
      },
      techRadar: [
        { label: "React/Next.js", value: 90 },
        { label: "TypeScript", value: 85 }
      ],
      socials: { 
        github: profileForm.github || "https://github.com", 
        linkedin: "https://linkedin.com" 
      }
    };

    // Save custom builders in localStorage
    const stored = localStorage.getItem("devlink_custom_builders");
    const customList = stored ? JSON.parse(stored) : [];
    customList.push(newBuilder);
    localStorage.setItem("devlink_custom_builders", JSON.stringify(customList));

    setSuccess(true);
  };

  // Get active item details
  const activeEvent = type === "event" ? EVENTS[parseInt(idParam)] : null;
  const activeBuilder = type === "pitch" ? (BUILDERS.find(b => b.name === idParam) || { name: idParam, role: "Builder", bio: "Co-founder matching profile", skills: ["Coding"], matchScore: 90, accent: "#7B61FF" }) : null;

  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans relative overflow-hidden flex flex-col justify-center items-center py-16 px-4">
      {/* Background glow animations */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#7B61FF]/[0.06] blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[#00FFA3]/[0.06] blur-[150px] rounded-full mix-blend-screen pointer-events-none" />

      {/* Back button */}
      <div className="absolute top-8 left-8 z-20">
        <a 
          href="/community" 
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors font-mono text-xs cursor-pointer bg-white/5 border border-white/10 px-4 py-2 rounded-full"
        >
          <ArrowLeft size={14} /> Back to Ecosystem
        </a>
      </div>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-xl text-center py-12 px-8"
          >
            <SpotlightCard className="p-8 flex flex-col items-center" accent="#00FFA3">
              <div className="w-16 h-16 rounded-full bg-[#00FFA3]/10 border border-[#00FFA3]/30 flex items-center justify-center text-[#00FFA3] mb-6 shadow-[0_0_30px_rgba(0,255,163,0.15)]">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-3xl font-extrabold text-white mb-3">Action Confirmed!</h2>
              <p className="text-zinc-400 text-sm font-light leading-relaxed mb-8 max-w-md">
                {type === "event" && "You have registered for this event successfully. Team matchmaking details will be shared in your inbox."}
                {type === "pitch" && `Your pitch invitation has been sent to ${idParam}. They will receive notification on their dashboard.`}
                {type === "profile" && "Your profile has been published to the Co-Founder Matcher board. Builders can now pitch to your stack!"}
              </p>
              <a 
                href="/community" 
                className="px-8 py-3 rounded-xl bg-white text-black font-bold text-xs hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                Go to Matcher Board
              </a>
            </SpotlightCard>
          </motion.div>
        ) : !user || type === "signin" || type === "signup" || type === "join" ? (
          // ─── DUAL AUTH GATEKEEPER (SIGN IN & SIGN UP / JOIN) ───
          <motion.div 
            key="auth-gate"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch"
          >
            {/* Left Column: Telemetry & Benefits */}
            <div className="md:col-span-5 flex flex-col justify-between">
              <SpotlightCard className="p-8 flex flex-col justify-between h-full" accent="#7B61FF">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold tracking-widest uppercase mb-6 text-zinc-400">
                    <Terminal size={10} className="text-[#7B61FF]" /> DevLink Node Gateway
                  </div>
                  
                  {isSigningUp ? (
                    <div>
                      <h3 className="text-xl font-extrabold text-white mb-4 leading-tight">Compiling Identity</h3>
                      <p className="text-xs text-zinc-400 font-light leading-relaxed mb-6">
                        Please hold while our decentralized nodes synchronize your public records and generate secure access keys.
                      </p>
                    </div>
                  ) : authSubMode === "signup" ? (
                    <div>
                      <h3 className="text-2xl font-extrabold text-white mb-4 leading-tight">Join the Hacker Guild</h3>
                      <p className="text-xs text-zinc-400 font-light leading-relaxed mb-8">
                        Register your developer profile to claim your credentials, participate in sprints, pitch to venture capitalists, and match with team founders.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-2xl font-extrabold text-white mb-4 leading-tight">Gateway Authorization</h3>
                      <p className="text-xs text-zinc-400 font-light leading-relaxed mb-8">
                        Welcome back builder. Authenticate with your credentials to access your dashboard, pending pitches, and active hackathons.
                      </p>
                    </div>
                  )}
                </div>

                {isSigningUp ? (
                  // Telemetry Stream Panel
                  <div className="bg-black/80 border border-white/10 rounded-2xl p-4 font-mono text-[9px] text-[#00FFA3] flex-1 min-h-[180px] flex flex-col justify-end overflow-hidden shadow-2xl relative">
                    <div className="absolute inset-0 bg-[#00FFA3]/5 pointer-events-none" />
                    <div className="flex flex-col gap-1 overflow-y-auto">
                      {logs.map((log, idx) => (
                        <div key={idx} className="animate-fade-in">
                          {log}
                        </div>
                      ))}
                      <div className="w-2 h-3.5 bg-[#00FFA3] animate-pulse ml-1 inline-block" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 pt-6 border-t border-white/5 font-mono text-xs text-zinc-500">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={12} className="text-[#7B61FF]" />
                      <span>Decentralized Reputation Tracker</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={12} className="text-[#7B61FF]" />
                      <span>Direct Pipelines to Top VCs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={12} className="text-[#7B61FF]" />
                      <span>Skill-Matched Partner Search</span>
                    </div>
                  </div>
                )}
              </SpotlightCard>
            </div>

            {/* Right Column: Interactive Card Form */}
            <div className="md:col-span-7">
              <SpotlightCard className="p-8" accent="#7B61FF">
                {isSigningUp ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                    <div className="w-16 h-16 rounded-full border-4 border-t-[#00FFA3] border-white/10 animate-spin" />
                    <div className="space-y-2">
                      <h4 className="text-lg font-bold text-white font-mono uppercase tracking-widest animate-pulse">Syncing Records</h4>
                      <p className="text-xs text-zinc-500">Initializing secure session...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Tab Selection Toggle */}
                    <div className="flex bg-white/5 border border-white/10 p-1 rounded-full mb-8 max-w-[280px] mx-auto">
                      <button 
                        type="button"
                        onClick={() => setAuthSubMode("signin")}
                        className={`flex-1 py-1.5 rounded-full text-[10px] font-mono font-bold transition-all cursor-pointer ${authSubMode === "signin" ? "bg-white text-black border-none" : "text-zinc-500 hover:text-zinc-300 border-none bg-transparent"}`}
                      >
                        SIGN IN
                      </button>
                      <button 
                        type="button"
                        onClick={() => setAuthSubMode("signup")}
                        className={`flex-1 py-1.5 rounded-full text-[10px] font-mono font-bold transition-all cursor-pointer ${authSubMode === "signup" ? "bg-white text-black border-none" : "text-zinc-500 hover:text-zinc-300 border-none bg-transparent"}`}
                      >
                        JOIN NETWORK
                      </button>
                    </div>

                    {authSubMode === "signin" ? (
                      // ─── SIGN IN FORM ───
                      <form onSubmit={handleSignInSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Email Address</label>
                          <div className="relative">
                            <Mail size={14} className="absolute left-4 top-3.5 text-zinc-500" />
                            <input 
                              type="email"
                              required
                              value={signInData.email}
                              onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                              placeholder="you@domain.com"
                              className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-black text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-[#7B61FF]/50 transition-colors"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Password</label>
                          <div className="relative">
                            <Shield size={14} className="absolute left-4 top-3.5 text-zinc-500" />
                            <input 
                              type="password"
                              required
                              value={signInData.password}
                              onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                              placeholder="••••••••"
                              className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-black text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-[#7B61FF]/50 transition-colors"
                            />
                          </div>
                        </div>

                        <button 
                          type="submit"
                          className="w-full h-11 rounded-xl bg-white text-black font-bold text-xs hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mt-6 shadow-[0_0_20px_rgba(255,255,255,0.1)] border-none"
                        >
                          <Shield size={14} /> Sign In
                        </button>

                        <div className="relative flex items-center gap-3 py-2">
                          <div className="flex-1 h-px bg-white/10" />
                          <span className="text-zinc-600 text-[9px] font-mono uppercase">or</span>
                          <div className="flex-1 h-px bg-white/10" />
                        </div>

                        <a
                          href={`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:10000"}/api/auth/google`}
                          className="w-full h-11 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                          Continue with Google
                        </a>
                      </form>

                    ) : (
                      // ─── JOIN (SIGN UP) FORM ───
                      <form onSubmit={handleSignUpSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Full Name</label>
                            <div className="relative">
                              <User size={14} className="absolute left-4 top-3.5 text-zinc-500" />
                              <input 
                                type="text"
                                required
                                value={signUpData.name}
                                onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                                placeholder="e.g. Liam Wright"
                                className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-black text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-[#7B61FF]/50 transition-colors"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Username</label>
                            <div className="relative">
                              <span className="absolute left-4 top-3 text-xs text-zinc-500 font-mono">@</span>
                              <input 
                                type="text"
                                required
                                value={signUpData.username}
                                onChange={(e) => setSignUpData({ ...signUpData, username: e.target.value })}
                                placeholder="username"
                                className="w-full h-11 pl-8 pr-4 rounded-xl border border-white/10 bg-black text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-[#7B61FF]/50 transition-colors"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Email Address</label>
                            <div className="relative">
                              <Mail size={14} className="absolute left-4 top-3.5 text-zinc-500" />
                              <input 
                                type="email"
                                required
                                value={signUpData.email}
                                onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                                placeholder="you@domain.com"
                                className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-black text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-[#7B61FF]/50 transition-colors"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Simulated Password</label>
                            <input 
                              type="password"
                              required
                              value={signUpData.password}
                              onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                              placeholder="••••••••"
                              className="w-full h-11 px-4 rounded-xl border border-white/10 bg-black text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-[#7B61FF]/50 transition-colors"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Specialization</label>
                            <select 
                              value={signUpData.role}
                              onChange={(e) => setSignUpData({ ...signUpData, role: e.target.value })}
                              className="w-full h-11 px-4 rounded-xl border border-white/10 bg-black text-xs text-zinc-300 focus:outline-none focus:border-[#7B61FF]/50 transition-colors appearance-none cursor-pointer"
                            >
                              <option value="AI Engineer">AI / Agentic Systems</option>
                              <option value="UI/UX Designer">Product & UI Designer</option>
                              <option value="Fullstack Developer">Fullstack Next.js Builder</option>
                              <option value="Systems Engineer">Rust / Systems Engineer</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">GitHub Profile URL</label>
                            <input 
                              type="url"
                              required
                              value={signUpData.github}
                              onChange={(e) => setSignUpData({ ...signUpData, github: e.target.value })}
                              placeholder="https://github.com/username"
                              className="w-full h-11 px-4 rounded-xl border border-white/10 bg-black text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-[#7B61FF]/50 transition-colors"
                            />
                          </div>
                        </div>

                        <button 
                          type="submit"
                          className="w-full h-11 rounded-xl bg-white text-black font-bold text-xs hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mt-6 shadow-[0_0_20px_rgba(255,255,255,0.1)] border-none"
                        >
                          <Github size={14} /> Join & Authorize GitHub
                        </button>
                      </form>
                    )}
                  </>
                )}
              </SpotlightCard>
            </div>
          </motion.div>
        ) : (
          // ─── AUTHENTICATED REGISTER VIEWS ───
          <motion.div 
            key="register-forms"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full max-w-4xl"
          >
            {/* EVENT REGISTRATION FORM */}
            {type === "event" && activeEvent && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
                {/* Left card details */}
                <div className="md:col-span-5 flex flex-col justify-between">
                  <SpotlightCard className="p-8 flex flex-col justify-between h-full" accent={activeEvent.accent}>
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold tracking-widest uppercase mb-6 text-zinc-400">
                        {activeEvent.type} Stage
                      </div>
                      <h3 className="text-2xl font-extrabold text-white mb-4 leading-tight">{activeEvent.title}</h3>
                      <p className="text-xs text-zinc-400 font-light leading-relaxed mb-8">{activeEvent.desc}</p>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-white/5 font-mono text-xs">
                      <div className="flex items-center gap-3">
                        <Calendar size={14} style={{ color: activeEvent.accent }} />
                        <span className="text-zinc-500 uppercase text-[9px] tracking-wider">Date:</span>
                        <span className="text-white font-bold">{activeEvent.date}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Award size={14} style={{ color: activeEvent.accent }} />
                        <span className="text-zinc-500 uppercase text-[9px] tracking-wider">Reward Pool:</span>
                        <span className="text-white font-bold">{activeEvent.prize}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Target size={14} style={{ color: activeEvent.accent }} />
                        <span className="text-zinc-500 uppercase text-[9px] tracking-wider">Registrations:</span>
                        <span className="text-white font-bold">{activeEvent.attendees} / {activeEvent.maxAttendees}</span>
                      </div>
                    </div>
                  </SpotlightCard>
                </div>

                {/* Right card form */}
                <div className="md:col-span-7">
                  <SpotlightCard className="p-8" accent={activeEvent.accent}>
                    <h4 className="text-lg font-bold text-white mb-6">Complete Event RSVP</h4>
                    <form onSubmit={handleEventSubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Team Name (Optional)</label>
                        <input 
                          type="text"
                          value={eventForm.teamName}
                          onChange={(e) => setEventForm({ ...eventForm, teamName: e.target.value })}
                          placeholder="e.g. Apex Solvers"
                          className="w-full h-11 px-4 rounded-xl border border-white/10 bg-black text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-white/20 transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Your Primary Hackathon Role</label>
                        <select
                          value={eventForm.role}
                          onChange={(e) => setEventForm({ ...eventForm, role: e.target.value })}
                          className="w-full h-11 px-4 rounded-xl border border-white/10 bg-black text-xs text-zinc-300 focus:outline-none focus:border-white/20 transition-colors appearance-none"
                        >
                          <option value="Developer">Frontend Developer</option>
                          <option value="Backend Developer">Backend / Systems Engineer</option>
                          <option value="AI Specialist">AI / LLM Specialist</option>
                          <option value="Designer">Product / UI UX Designer</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Proposed Project Pitch (Brief)</label>
                        <textarea 
                          required
                          value={eventForm.proposal}
                          onChange={(e) => setEventForm({ ...eventForm, proposal: e.target.value })}
                          placeholder="What project or concept are you planning to hack on?"
                          rows={3}
                          className="w-full p-4 rounded-xl border border-white/10 bg-black text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-white/20 transition-colors resize-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">GitHub Profile URL</label>
                        <input 
                          type="url"
                          required
                          value={eventForm.github}
                          onChange={(e) => setEventForm({ ...eventForm, github: e.target.value })}
                          placeholder="https://github.com/yourusername"
                          className="w-full h-11 px-4 rounded-xl border border-white/10 bg-black text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-white/20 transition-colors"
                        />
                      </div>

                      <button 
                        type="submit"
                        className="w-full h-11 rounded-xl bg-white text-black font-bold text-xs hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mt-6 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                      >
                        Confirm Registration
                      </button>
                    </form>
                  </SpotlightCard>
                </div>
              </div>
            )}

            {/* PITCH OUTREACH REGISTRATION FORM */}
            {type === "pitch" && activeBuilder && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
                {/* Left card detail */}
                <div className="md:col-span-5 flex flex-col justify-between">
                  <SpotlightCard className="p-8 flex flex-col justify-between h-full" accent={activeBuilder.accent}>
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white font-bold font-mono">
                          {activeBuilder.name.split(' ').map(n=>n[0]).join('')}
                        </div>
                        <span className="text-[10px] font-mono font-bold text-zinc-500">{activeBuilder.matchScore}% Compatibility</span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-1">{activeBuilder.name}</h3>
                      <p className="text-[10px] text-zinc-500 font-mono mb-4">{activeBuilder.role}</p>
                      
                      <p className="text-xs text-zinc-400 font-light leading-relaxed mb-6">
                        {activeBuilder.bio}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-white/5">
                      <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-3 block">Primary Stack</label>
                      <div className="flex flex-wrap gap-1.5">
                        {activeBuilder.skills?.map(skill => (
                          <span key={skill} className="text-[9px] font-mono text-zinc-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </SpotlightCard>
                </div>

                {/* Right card form */}
                <div className="md:col-span-7">
                  <SpotlightCard className="p-8" accent={activeBuilder.accent}>
                    <h4 className="text-lg font-bold text-white mb-6">Send Co-Founder Pitch</h4>
                    <form onSubmit={handlePitchSubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Outreach Pitch Pitch Message</label>
                        <textarea 
                          required
                          value={pitchForm.message}
                          onChange={(e) => setPitchForm({ ...pitchForm, message: e.target.value })}
                          rows={6}
                          className="w-full p-4 rounded-xl border border-white/10 bg-black text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-white/20 transition-colors resize-none font-sans"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Your Portfolio Link</label>
                        <input 
                          type="url"
                          required
                          value={pitchForm.portfolio}
                          onChange={(e) => setPitchForm({ ...pitchForm, portfolio: e.target.value })}
                          placeholder="https://portfolio.com or github profile"
                          className="w-full h-11 px-4 rounded-xl border border-white/10 bg-black text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-white/20 transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Discord or Telegram Handles</label>
                        <input 
                          type="text"
                          required
                          value={pitchForm.discord}
                          onChange={(e) => setPitchForm({ ...pitchForm, discord: e.target.value })}
                          placeholder="e.g. devlink#1204"
                          className="w-full h-11 px-4 rounded-xl border border-white/10 bg-black text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-white/20 transition-colors"
                        />
                      </div>

                      <button 
                        type="submit"
                        className="w-full h-11 rounded-xl bg-white text-black font-bold text-xs hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mt-6 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                      >
                        Transmit Pitch Invitation
                      </button>
                    </form>
                  </SpotlightCard>
                </div>
              </div>
            )}

            {/* LIST ONESELF (PROFILE CREATOR) FORM */}
            {type === "profile" && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
                {/* Left card details */}
                <div className="md:col-span-5 flex flex-col justify-between">
                  <SpotlightCard className="p-8 flex flex-col justify-between h-full" accent="#7B61FF">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-[#7B61FF]/10 border border-[#7B61FF]/30 flex items-center justify-center text-[#7B61FF] mb-6">
                        <Sparkles size={22} />
                      </div>
                      <h3 className="text-2xl font-extrabold text-white mb-4 leading-tight">Join the Matcher Board</h3>
                      <p className="text-xs text-zinc-400 font-light leading-relaxed mb-6">
                        Add your profile credentials and list the projects you are working on to discover premium engineering, designer, or operational partners.
                      </p>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-white/5 font-mono text-xs text-zinc-500">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={12} className="text-[#00FFA3]" />
                        <span>Visible to 15k+ active developers</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={12} className="text-[#00FFA3]" />
                        <span>Direct filter by skill tag alignment</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={12} className="text-[#00FFA3]" />
                        <span>Protected inbox for pitch inquiries</span>
                      </div>
                    </div>
                  </SpotlightCard>
                </div>

                {/* Right card form */}
                <div className="md:col-span-7">
                  <SpotlightCard className="p-8" accent="#7B61FF">
                    <h4 className="text-lg font-bold text-white mb-6">Publish Your Builder Profile</h4>
                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Full Name</label>
                          <input 
                            type="text"
                            required
                            value={profileForm.name}
                            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                            placeholder="Full Name"
                            className="w-full h-11 px-4 rounded-xl border border-white/10 bg-black text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-white/20 transition-colors"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Primary Role</label>
                          <select
                            value={profileForm.role}
                            onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                            className="w-full h-11 px-4 rounded-xl border border-white/10 bg-black text-xs text-zinc-300 focus:outline-none focus:border-white/20 transition-colors appearance-none"
                          >
                            <option value="AI Engineer">AI Engineer</option>
                            <option value="UI/UX Designer">UI/UX Designer</option>
                            <option value="Fullstack Developer">Fullstack Developer</option>
                            <option value="Systems Engineer">Systems Engineer</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Short Biography</label>
                        <textarea 
                          required
                          value={profileForm.bio}
                          onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                          placeholder="Explain what products you build or what type of projects you are interested in."
                          rows={3}
                          className="w-full p-4 rounded-xl border border-white/10 bg-black text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-white/20 transition-colors resize-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Core Technical Stack (comma separated)</label>
                        <input 
                          type="text"
                          required
                          value={profileForm.skills}
                          onChange={(e) => setProfileForm({ ...profileForm, skills: e.target.value })}
                          placeholder="e.g. Next.js, FastAPI, Rust"
                          className="w-full h-11 px-4 rounded-xl border border-white/10 bg-black text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-white/20 transition-colors"
                        />
                      </div>

                      <div className="border-t border-white/5 my-4 pt-4">
                        <h5 className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-3">Project Specs (Optional)</h5>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Project Name</label>
                            <input 
                              type="text"
                              value={profileForm.projectTitle}
                              onChange={(e) => setProfileForm({ ...profileForm, projectTitle: e.target.value })}
                              placeholder="e.g. BitSync Engine"
                              className="w-full h-11 px-4 rounded-xl border border-white/10 bg-black text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-white/20 transition-colors"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Equity Range offered</label>
                            <input 
                              type="text"
                              value={profileForm.equity}
                              onChange={(e) => setProfileForm({ ...profileForm, equity: e.target.value })}
                              placeholder="e.g. 2% - 5%"
                              className="w-full h-11 px-4 rounded-xl border border-white/10 bg-black text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-white/20 transition-colors"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Commitment level</label>
                            <input 
                              type="text"
                              value={profileForm.commitment}
                              onChange={(e) => setProfileForm({ ...profileForm, commitment: e.target.value })}
                              placeholder="e.g. 20 hrs/wk or Full Time"
                              className="w-full h-11 px-4 rounded-xl border border-white/10 bg-black text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-white/20 transition-colors"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">GitHub Repository or Profile URL</label>
                            <input 
                              type="url"
                              value={profileForm.github}
                              onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                              placeholder="https://github.com/username"
                              className="w-full h-11 px-4 rounded-xl border border-white/10 bg-black text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-white/20 transition-colors"
                            />
                          </div>
                        </div>
                      </div>

                      <button 
                        type="submit"
                        className="w-full h-11 rounded-xl bg-white text-black font-bold text-xs hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mt-6 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                      >
                        Publish Profile to Board
                      </button>
                    </form>
                  </SpotlightCard>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono text-xs">
        Loading DevLink gateway telemetry...
      </div>
    }>
      <RegisterContent />
    </Suspense>
  );
}
