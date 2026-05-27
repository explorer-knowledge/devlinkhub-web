"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, CheckCircle2, User, Sparkles, Terminal, Rocket, Tag, Briefcase
} from "lucide-react";

function SpotlightCard({ children, className = "", accent = "#7B61FF" }: { children: React.ReactNode, className?: string, accent?: string }) {
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

const PRESET_TAGS = ["Next.js", "React", "TypeScript", "FastAPI", "Python", "Rust", "WebAssembly", "Go", "Figma", "TailwindCSS", "LangChain", "PostgreSQL"];

function OnboardingContent() {
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect") || "/community";

  const [user, setUser] = useState<{ name: string; username: string; email: string } | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
  // Profile onboarding fields
  const [profileForm, setProfileForm] = useState({
    name: "",
    role: "AI Engineer",
    bio: "",
    skills: "",
    projectTitle: "",
    equity: "2% - 5%",
    commitment: "20 hrs/wk",
    github: ""
  });

  // Check auth session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("devlink_auth_user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        // Pre-fill name from session
        setProfileForm(prev => ({ ...prev, name: parsed.name || "" }));
      } else {
        // Not authenticated, redirect to dedicated /signin page
        window.location.href = `/signin?redirect=${encodeURIComponent("/onboarding")}`;
      }
    }
  }, []);

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
        { label: "Frontend", value: 90 },
        { label: "Backend", value: 85 }
      ],
      socials: { 
        github: profileForm.github || "https://github.com", 
        linkedin: "https://linkedin.com" 
      }
    };

    // Save custom builders to localStorage
    const stored = localStorage.getItem("devlink_custom_builders");
    const customList = stored ? JSON.parse(stored) : [];
    customList.push(newBuilder);
    localStorage.setItem("devlink_custom_builders", JSON.stringify(customList));

    setSuccess(true);
  };

  const handleAddPresetTag = (tag: string) => {
    setProfileForm(prev => {
      const currentTags = prev.skills ? prev.skills.split(",").map(s => s.trim()) : [];
      if (currentTags.includes(tag)) return prev;
      const updatedTags = [...currentTags.filter(Boolean), tag];
      return { ...prev, skills: updatedTags.join(", ") };
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono text-xs">
        Verifying developer gate credentials...
      </div>
    );
  }

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
          <ArrowLeft size={14} /> Cancel Onboarding
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
                <Rocket size={32} />
              </div>
              <h2 className="text-3xl font-extrabold text-white mb-3">Onboarding Complete!</h2>
              <p className="text-zinc-400 text-sm font-light leading-relaxed mb-8 max-w-md">
                Your builder profile has been compiled and is now listed on the **Co-Founder Matcher** board. Technical founders can now view your details and pitch to you.
              </p>
              <a 
                href="/community" 
                className="px-8 py-3 rounded-xl bg-white text-black font-bold text-xs hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.1)] border-none"
              >
                Launch Community Board
              </a>
            </SpotlightCard>
          </motion.div>
        ) : (
          <motion.div 
            key="onboarding-forms"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch"
          >
            {/* Left Card Details */}
            <div className="md:col-span-5 flex flex-col justify-between">
              <SpotlightCard className="p-8 flex flex-col justify-between h-full" accent="#7B61FF">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold tracking-widest uppercase mb-6 text-zinc-400">
                    <Sparkles size={12} className="text-[#7B61FF]" /> Builder Setup
                  </div>
                  <h3 className="text-2xl font-extrabold text-white mb-4 leading-tight">Create Your Developer Profile</h3>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed mb-6">
                    Add your profile details, project goals, and stack preferences to help matching co-founders pitch to your expertise.
                  </p>

                  <div className="space-y-4 pt-6 border-t border-white/5 font-mono text-xs text-zinc-500">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={12} className="text-[#00FFA3]" />
                      <span>Syncs automatically with dashboard</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={12} className="text-[#00FFA3]" />
                      <span>Custom tag indexing for skills</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={12} className="text-[#00FFA3]" />
                      <span>Protected profile inbox routing</span>
                    </div>
                  </div>
                </div>

                <div className="pt-8 font-mono text-[9px] text-zinc-600">
                  SESSION KEY: devlink_auth_user • @{user.username}
                </div>
              </SpotlightCard>
            </div>

            {/* Right Card Form */}
            <div className="md:col-span-7">
              <SpotlightCard className="p-8" accent="#7B61FF">
                <h4 className="text-lg font-bold text-white mb-6">Publish Builder Profile</h4>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Full Name</label>
                      <input 
                        type="text"
                        required
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        placeholder="Liam Wright"
                        className="w-full h-11 px-4 rounded-xl border border-white/10 bg-black text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-white/20 transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Primary Role</label>
                      <select
                        value={profileForm.role}
                        onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                        className="w-full h-11 px-4 rounded-xl border border-white/10 bg-black text-xs text-zinc-300 focus:outline-none focus:border-white/20 transition-colors appearance-none cursor-pointer"
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
                      placeholder="Next.js, FastAPI, Rust"
                      className="w-full h-11 px-4 rounded-xl border border-white/10 bg-black text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-white/20 transition-colors"
                    />
                    
                    {/* Preset tags generator */}
                    <div className="flex flex-wrap gap-1 pt-1.5">
                      {PRESET_TAGS.map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleAddPresetTag(tag)}
                          className="px-2 py-0.5 rounded border border-white/5 bg-white/5 hover:bg-white/10 text-[9px] text-zinc-400 hover:text-white transition-all cursor-pointer font-mono"
                        >
                          + {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-white/5 my-4 pt-4">
                    <h5 className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <Briefcase size={12} className="text-[#7B61FF]" /> Project Specs (Optional)
                    </h5>
                    
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
                        <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">GitHub Repository URL</label>
                        <input 
                          type="url"
                          value={profileForm.github}
                          onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                          placeholder="https://github.com/username/repo"
                          className="w-full h-11 px-4 rounded-xl border border-white/10 bg-black text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-white/20 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <button 
                    suppressHydrationWarning
                    type="submit"
                    className="w-full h-11 rounded-xl bg-white text-black font-bold text-xs hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mt-6 shadow-[0_0_20px_rgba(255,255,255,0.1)] border-none"
                  >
                    Publish Profile to Board
                  </button>
                </form>
              </SpotlightCard>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono text-xs">
        Loading DevLink onboarding interface...
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
}
