"use client";

import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, UploadCloud, CheckCircle2, UserCheck, Code2, 
  Terminal, ShieldAlert, Sparkles 
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getMergedProjects, saveProjects, Project } from "@/utils/projectsData";

const CATEGORIES = ["AI/ML", "Web3", "FinTech", "Open Source", "Infrastructure"];
const ACCENT_COLORS = [
  { name: "Cyan", value: "#00F0FF" },
  { name: "Pink", value: "#FF1CF7" },
  { name: "Green", value: "#00FFA3" },
  { name: "Purple", value: "#7B61FF" },
  { name: "Orange", value: "#FFB000" }
];
const PRESET_TECH = [
  "Rust", "Python", "PyTorch", "Solidity", "Go", 
  "TypeScript", "React", "Framer", "Tailwind", "C++", 
  "WASM", "Redis", "Kafka", "Docker", "Node.js"
];

export default function SubmitProjectPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null);
  
  const [name, setName] = useState("");
  const [category, setCategory] = useState("AI/ML");
  const [description, setDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [tech, setTech] = useState<string[]>([]);
  const [customTech, setCustomTech] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [color, setColor] = useState("#00F0FF");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitLogs, setSubmitLogs] = useState<string[]>([]);

  // Check authentication on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("devlinkhub_auth_user");
      if (storedUser) {
        setIsAuthenticated(true);
        setUser(JSON.parse(storedUser));
      } else {
        setIsAuthenticated(false);
      }
    }
  }, []);

  const toggleTech = (t: string) => {
    setTech(prev => 
      prev.includes(t) ? prev.filter(item => item !== t) : [...prev, t]
    );
  };

  const handleAddCustomTech = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && customTech.trim()) {
      e.preventDefault();
      if (!tech.includes(customTech.trim())) {
        setTech(prev => [...prev, customTech.trim()]);
      }
      setCustomTech("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !githubUrl) return;
    setIsSubmitting(true);

    const logs = [
      "Connecting to decentralized registry portal...",
      "Validating repository signature credentials...",
      "Matching project category index metadata...",
      "Compiling tech stack presets and parameters...",
      "Saving project metadata nodes in state container...",
      "Registry successful! Broadcasting update..."
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < logs.length) {
        setSubmitLogs(prev => [...prev, `[INFO] ${logs[i]}`]);
        i++;
      } else {
        clearInterval(interval);

        getMergedProjects().then((allProjects) => {
          const newProject: Project = {
            id: `proj-${Date.now()}`,
            name,
            category,
            description,
            longDescription: longDescription || description,
            tech,
            stars: Math.floor(Math.random() * 5) + 1, // Start with small organic stars
            forks: 0,
            contributors: 1,
            status: "Active Dev",
            color,
            githubUrl,
            issues: [
              { 
                id: `issue-${Date.now()}-1`, 
                title: "Setup codebase diagnostics pipeline", 
                difficulty: "Easy", 
                tags: tech.slice(0, 2), 
                claimedBy: "" 
              },
              { 
                id: `issue-${Date.now()}-2`, 
                title: "Optimize entry handler algorithms", 
                difficulty: "Medium", 
                tags: tech.slice(0, 3), 
                claimedBy: "" 
              }
            ],
            openings: [
              { 
                id: `opening-${Date.now()}-1`, 
                role: "Founding Collaborator", 
                commitment: "10 hrs/wk", 
                equity: "3% - 6%" 
              }
            ]
          };

          allProjects.push(newProject);
          saveProjects(allProjects).then(() => {
            // Redirect to projects main page
            window.location.href = "/projects";
          });
        });
      }
    }, 300);
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono text-xs">
        Connecting to registry workspace...
      </div>
    );
  }

  // Not authenticated render
  if (isAuthenticated === false) {
    return (
      <div className="relative min-h-screen bg-[#030303] text-zinc-100 font-sans flex flex-col justify-center items-center px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#FF1CF7]/[0.05] blur-[100px] rounded-full pointer-events-none" />
        
        <div className="w-full max-w-[440px] bg-[#09090b] border border-white/5 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-[#FF1CF7]/10 border border-[#FF1CF7]/30 flex items-center justify-center text-[#FF1CF7] mx-auto animate-pulse">
            <ShieldAlert size={22} />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Identity Handshake Required</h2>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              You must authenticate your developer profile in order to submit and register projects inside DevLinkHub's decentralized matrix registry.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Link 
              href={`/signin?redirect=${encodeURIComponent("/projects/submit")}`}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-[#FF1CF7] via-[#7B61FF] to-[#00F0FF] text-black font-extrabold text-xs flex items-center justify-center hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-[0_0_15px_rgba(123,97,255,0.25)]"
            >
              Sign In to Continue
            </Link>
            <Link 
              href="/projects" 
              className="text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              [Return to Directory]
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#030303] text-zinc-100 font-sans selection:bg-[#00F0FF]/30 flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col relative pt-24 pb-20 z-10">
        
        {/* Loader Overlay */}
        {isSubmitting && (
          <div className="fixed inset-0 bg-black/95 z-50 flex flex-col justify-center items-center text-center p-6">
            <div className="w-12 h-12 rounded-full border-4 border-t-[#00F0FF] border-white/5 animate-spin shadow-[0_0_15px_rgba(0,240,255,0.15)] mb-6" />
            <div className="space-y-1 mb-6">
              <h4 className="text-xs font-bold text-white font-mono uppercase tracking-widest animate-pulse">Broadcasting Node</h4>
              <p className="text-[10px] text-zinc-500 font-light">Pushing project payload to registry nodes...</p>
            </div>
            
            <div className="w-full max-w-md bg-black border border-white/10 rounded-2xl p-4 font-mono text-[9px] text-[#00F0FF] text-left min-h-[140px] flex flex-col justify-end overflow-hidden relative shadow-2xl">
              <div className="absolute inset-0 bg-[#00F0FF]/5 pointer-events-none" />
              <div className="flex flex-col gap-1 overflow-y-auto">
                {submitLogs.map((log, idx) => (
                  <div key={idx} className="truncate">
                    {log}
                  </div>
                ))}
                <div className="w-2 h-3.5 bg-[#00F0FF] animate-pulse ml-1 inline-block" />
              </div>
            </div>
          </div>
        )}

        <div className="max-w-[800px] mx-auto w-full px-6 relative z-10 space-y-10">
          
          {/* Breadcrumb */}
          <div className="flex items-center justify-between mt-8">
            <Link 
              href="/projects" 
              className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors font-mono text-xs cursor-pointer bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md"
            >
              <ArrowLeft size={13} /> Return to Directory
            </Link>
            <div className="flex items-center gap-1.5 text-zinc-500 font-mono text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
              <UserCheck size={12} className="text-[#00FFA3]" />
              <span>Session: {user?.username}</span>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-[#09090b] border border-white/5 rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#00F0FF]/[0.02] blur-[80px] rounded-full pointer-events-none" />

            <div className="text-center mb-10 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#00F0FF]/10 border border-[#00F0FF]/20 flex items-center justify-center text-[#00F0FF] mx-auto shadow-inner">
                <UploadCloud size={22} />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Submit New Initiative</h2>
              <p className="text-xs text-zinc-500 font-light leading-relaxed max-w-sm mx-auto">
                Register your open-source package or startup MVP to recruit builders and synchronize development objectives.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Form grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Project Name */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Project Name</label>
                  <input 
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. PayStream"
                    className="w-full h-11 px-4 rounded-xl border border-white/5 bg-zinc-900/50 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-[#00F0FF]/50 focus:bg-black transition-all"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-white/5 bg-zinc-900/50 text-xs text-zinc-300 focus:outline-none focus:border-[#00F0FF]/50 focus:bg-black transition-all cursor-pointer appearance-none"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

              </div>

              {/* GitHub Repo Link */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">GitHub Repository URL</label>
                <input 
                  type="url"
                  required
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/org/repo"
                  className="w-full h-11 px-4 rounded-xl border border-white/5 bg-zinc-900/50 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-[#00F0FF]/50 focus:bg-black transition-all"
                />
              </div>

              {/* Short Description */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Short Description (Index Card)</label>
                <input 
                  type="text"
                  required
                  maxLength={110}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Continuous second-by-second microtransaction payment channels engine... (max 110 chars)"
                  className="w-full h-11 px-4 rounded-xl border border-white/5 bg-zinc-900/50 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-[#00F0FF]/50 focus:bg-black transition-all"
                />
              </div>

              {/* Detailed Description */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Detailed description (Project Page)</label>
                <textarea 
                  rows={4}
                  value={longDescription}
                  onChange={(e) => setLongDescription(e.target.value)}
                  placeholder="Explain your architectural layers, current status, goals, and what profiles you need..."
                  className="w-full p-4 rounded-xl border border-white/5 bg-zinc-900/50 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-[#00F0FF]/50 focus:bg-black transition-all resize-none"
                />
              </div>

              {/* Theme color picker */}
              <div className="space-y-3">
                <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Ecosystem Theme Accent</label>
                <div className="flex gap-4">
                  {ACCENT_COLORS.map(c => {
                    const active = color === c.value;
                    return (
                      <button
                        suppressHydrationWarning
                        key={c.name}
                        type="button"
                        onClick={() => setColor(c.value)}
                        className={`w-7 h-7 rounded-full border transition-all cursor-pointer hover:scale-105 flex items-center justify-center`}
                        style={{ 
                          backgroundColor: c.value, 
                          borderColor: active ? "white" : "transparent",
                          boxShadow: active ? `0 0 12px ${c.value}` : "none"
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Tech Stack selectors */}
              <div className="space-y-3">
                <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Tech Stack Signature</label>
                
                {/* Tech selector lists */}
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_TECH.map(t => {
                    const active = tech.includes(t);
                    return (
                      <button
                        suppressHydrationWarning
                        key={t}
                        type="button"
                        onClick={() => toggleTech(t)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold border transition-all cursor-pointer ${
                          active 
                            ? "bg-[#00F0FF] text-black border-transparent shadow-[0_0_10px_rgba(0,240,255,0.2)]" 
                            : "bg-white/5 border-white/5 text-zinc-400 hover:border-white/15"
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Tech Tag input */}
                <div className="space-y-1.5 max-w-xs">
                  <span className="block text-[8px] font-mono text-zinc-600 uppercase">[Press ENTER to submit custom tag]</span>
                  <div className="relative">
                    <Code2 size={13} className="absolute left-3.5 top-3.5 text-zinc-500" />
                    <input 
                      type="text"
                      value={customTech}
                      onChange={(e) => setCustomTech(e.target.value)}
                      onKeyDown={handleAddCustomTech}
                      placeholder="e.g. PyTorch (press enter)"
                      className="w-full h-10 pl-9 pr-4 rounded-xl border border-white/5 bg-zinc-900/50 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-[#00F0FF]/50 focus:bg-black transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <button 
                suppressHydrationWarning
                type="submit"
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#7B61FF] text-black font-extrabold text-xs hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mt-8 shadow-[0_4px_25px_rgba(0,240,255,0.25)] border-none font-mono uppercase tracking-wider"
              >
                Commit Project Registry
              </button>

            </form>
          </div>

        </div>
      </main>

    </div>
  );
}
