"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Rocket, Search, TerminalSquare, ExternalLink, Plus, 
  ArrowRight, ShieldCheck, Heart, User, Sparkles, Send, 
  Code2, Users, Briefcase, DollarSign, Cpu, Globe2, Database, ShieldAlert, Award
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SpotlightCard from "@/components/community/SpotlightCard";
import { getMergedStartups, saveStartups, Startup, StartupJob } from "@/utils/startupsData";
import { useAuth } from "@/context/AuthContext";

const SECTORS = ["All", "AI", "Web3", "SaaS", "DevTools", "BioTech"];
const STAGES = ["All Stages", "Pre-seed", "Seed", "Series A", "Bootstrapped"];
const SECTOR_ICONS: Record<string, any> = {
  "AI": Cpu,
  "Web3": Globe2,
  "SaaS": Briefcase,
  "DevTools": Code2,
  "BioTech": Database
};

export default function StartupsPage() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("All");
  const [selectedStage, setSelectedStage] = useState("All Stages");
  const [onlyHiring, setOnlyHiring] = useState(false);
  const { firebaseUser, localUser } = useAuth();

  // Detail Modal state
  const [activeStartup, setActiveStartup] = useState<Startup | null>(null);
  
  // Custom Job Apply State
  const [activeJob, setActiveJob] = useState<StartupJob | null>(null);
  const [applyCover, setApplyCover] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [applyLogs, setApplyLogs] = useState<string[]>([]);

  // Register Startup Modal state
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [regName, setRegName] = useState("");
  const [regTagline, setRegTagline] = useState("");
  const [regDesc, setRegDesc] = useState("");
  const [regSector, setRegSector] = useState<any>("AI");
  const [regStage, setRegStage] = useState<any>("Pre-seed");
  const [regRaised, setRegRaised] = useState("");
  const [regTech, setRegTech] = useState<string[]>([]);
  const [regCustomTech, setRegCustomTech] = useState("");
  const [regColor, setRegColor] = useState("#00F0FF");
  const [regRole, setRegRole] = useState("");
  const [regSalary, setRegSalary] = useState("");
  const [regEquity, setRegEquity] = useState("");
  const [isRegSubmitting, setIsRegSubmitting] = useState(false);
  const [regLogs, setRegLogs] = useState<string[]>([]);

  // Initialize data on mount
  useEffect(() => {
    getMergedStartups().then(setStartups);
  }, []);

  // Compute launchpad statistics
  const totalStartupsCount = startups.length;
  const hiringCount = startups.filter(s => (s.jobs?.length || 0) > 0).length;
  const totalOpeningsCount = startups.reduce((acc, s) => acc + (s.jobs?.length || 0), 0);

  // Capital Raised compute
  const getRaisedNum = (r: string) => {
    if (r.toLowerCase() === "bootstrapped") return 0;
    const clean = r.replace("$", "").replace("M", "").replace("k", "");
    const val = parseFloat(clean) || 0;
    if (r.includes("M")) return val * 1000000;
    if (r.includes("k")) return val * 1000;
    return val;
  };
  const totalCapitalVal = startups.reduce((acc, s) => acc + getRaisedNum(s.raised), 0);
  const formattedRaised = `$${(totalCapitalVal / 1000000).toFixed(1)}M`;

  // Sector and stage filtering logic
  const filtered = startups.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSector = selectedSector === "All" || s.sector === selectedSector;
    const matchesStage = selectedStage === "All Stages" || s.stage === selectedStage;
    const matchesHiring = !onlyHiring || (s.jobs?.length || 0) > 0;

    return matchesSearch && matchesSector && matchesStage && matchesHiring;
  });

  const handleRegisterClick = () => {
    if (!firebaseUser) {
      window.location.href = `/signin?redirect=${encodeURIComponent("/startups")}`;
      return;
    }
    setIsRegModalOpen(true);
  };

  const handleApplyClick = (job: StartupJob) => {
    if (!firebaseUser) {
      window.location.href = `/signin?redirect=${encodeURIComponent("/startups")}`;
      return;
    }
    setActiveJob(job);
  };

  const handleAddRegTech = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && regCustomTech.trim()) {
      e.preventDefault();
      if (!regTech.includes(regCustomTech.trim())) {
        setRegTech(prev => [...prev, regCustomTech.trim()]);
      }
      setRegCustomTech("");
    }
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyCover.trim() || !activeJob || !activeStartup) return;
    setIsApplying(true);

    const logs = [
      "Authorizing application token...",
      "Resolving hiring manager routing key...",
      "Uploading cover letter content payload...",
      "Syncing builder resume metadata...",
      "Application registered successfully!"
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < logs.length) {
        setApplyLogs(prev => [...prev, `[INFO] ${logs[i]}`]);
        i++;
      } else {
        clearInterval(interval);
        
        // Save job application state
        const stored = localStorage.getItem("devlink_job_applications") || "[]";
        const applications = JSON.parse(stored);
        applications.push({
          jobId: activeJob.id,
          role: activeJob.role,
          startupName: activeStartup.name,
          username: localUser?.username || firebaseUser?.email || "user",
          coverLetter: applyCover,
          timestamp: Date.now()
        });
        localStorage.setItem("devlink_job_applications", JSON.stringify(applications));

        // Clear states
        setIsApplying(false);
        setActiveJob(null);
        setApplyCover("");
        setApplyLogs([]);
      }
    }, 250);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regTagline || !regDesc) return;
    setIsRegSubmitting(true);

    const logs = [
      "Establishing link to decentralized ledger...",
      "Validating company incorporation signature...",
      "Matching sector directories index...",
      "Binding founder authentication keys...",
      "Storing metadata payload nodes...",
      "Broadcast successful! Startup registry committed."
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < logs.length) {
        setRegLogs(prev => [...prev, `[INFO] ${logs[i]}`]);
        i++;
      } else {
        clearInterval(interval);

        const newJobs: StartupJob[] = [];
        if (regRole) {
          newJobs.push({
            id: `job-${Date.now()}`,
            role: regRole,
            salary: regSalary || "Competitive",
            equity: regEquity || "Negotiable",
            type: "Full-Time"
          });
        }

        const newStartup: Startup = {
          id: `startup-${Date.now()}`,
          name: regName,
          tagline: regTagline,
          description: regDesc,
          sector: regSector,
          stage: regStage,
          raised: regRaised || "Bootstrapped",
          teamSize: 1,
          tech: regTech,
          color: regColor,
          logoText: regName.slice(0, 2).toUpperCase(),
          founder: {
            name: localUser?.name || firebaseUser?.displayName || "Anonymous",
            avatar: (localUser?.name || firebaseUser?.displayName || "AN").slice(0, 2).toUpperCase(),
            handle: localUser?.username || firebaseUser?.email || "anonymous"
          },
          jobs: newJobs
        };

        const updated = [...startups, newStartup];
        setStartups(updated);
        saveStartups(updated);

        // Reset forms
        setIsRegSubmitting(false);
        setIsRegModalOpen(false);
        setRegName("");
        setRegTagline("");
        setRegDesc("");
        setRegTech([]);
        setRegRole("");
        setRegSalary("");
        setRegEquity("");
        setRegLogs([]);
      }
    }, 300);
  };

  return (
    <div className="relative min-h-screen bg-[#030303] text-zinc-100 font-sans selection:bg-[#00F0FF]/30 flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col relative pt-24 pb-20 z-10">
        
        {/* Decorative glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] max-w-[1200px] h-[550px] bg-[#00F0FF]/[0.03] blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
        <div className="absolute top-60 right-0 w-[450px] h-[450px] bg-[#FF1CF7]/[0.02] blur-[100px] rounded-full mix-blend-screen pointer-events-none" />

        <div className="max-w-[1300px] mx-auto w-full px-6 relative z-10 space-y-12">
          
          {/* Page Title & Sub Header */}
          <div className="flex flex-col items-center text-center space-y-6 mt-12">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md"
            >
              <Rocket size={14} className="text-[#00F0FF] animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-[0.2em] text-[#00F0FF] uppercase">
                Startup Launchpad
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter text-white leading-none"
            >
              Discover the <br className="sm:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#7B61FF] to-[#FF1CF7]">
                Next Core.
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm md:text-base text-zinc-400 max-w-2xl font-light leading-relaxed"
            >
              Explore next-generation tech startups hiring builders. Apply to roles with equity stakes, audit technical pitches, or launch your own company node.
            </motion.p>
          </div>

          {/* Startup statistics overview bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Listed Startups", value: totalStartupsCount, desc: "Nodes registered in directory", color: "#00F0FF" },
              { label: "Capital Raised", value: formattedRaised, desc: "Aggregated venture capital", color: "#FF1CF7" },
              { label: "Open Vacancies", value: totalOpeningsCount, desc: "Job roles currently hiring", color: "#00FFA3" },
              { label: "Startups Hiring", value: hiringCount, desc: "Teams looking for co-founders", color: "#7B61FF" }
            ].map((stat, i) => (
              <div key={i} className="bg-[#08080a] border border-white/5 rounded-2xl p-5 flex flex-col justify-between min-h-[110px] relative overflow-hidden group shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
                <div>
                  <span className="block text-[9px] font-mono text-zinc-500 uppercase tracking-widest">{stat.label}</span>
                  <span className="block text-[8px] font-mono text-zinc-600 mt-0.5">{stat.desc}</span>
                </div>
                <div className="text-2xl font-black mt-4 tracking-tight text-white group-hover:scale-105 transition-transform origin-left duration-300" style={{ color: stat.color }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Submit Startup Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="w-full bg-[#08080a] border border-white/5 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#00F0FF]/[0.01] to-[#7B61FF]/[0.01] pointer-events-none" />
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:scale-105 transition-transform duration-300">
                <Plus size={14} className="text-[#00F0FF]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Own a Startup Node?</h4>
                <p className="text-[10px] text-zinc-500">Register your organization to recruit builders and list vacancies.</p>
              </div>
            </div>
            
            <button
              suppressHydrationWarning
              onClick={handleRegisterClick}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-mono font-bold bg-[#00F0FF] text-black hover:bg-[#00F0FF]/90 transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:scale-[1.02] cursor-pointer"
            >
              Launch Startup
            </button>
          </motion.div>

          {/* Granular Filters & Layout Container */}
          <div className="space-y-6">
            
            {/* Filter controls row */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl">
              
              {/* Sector pills */}
              <div className="flex items-center gap-1 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-hide">
                {SECTORS.map(sec => (
                  <button
                    suppressHydrationWarning
                    key={sec}
                    onClick={() => setSelectedSector(sec)}
                    className={`relative px-4 py-2 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all duration-300 cursor-pointer ${
                      selectedSector === sec 
                        ? "text-white" 
                        : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]"
                    }`}
                  >
                    {selectedSector === sec && (
                      <motion.div
                        layoutId="active-sec-pill"
                        className="absolute inset-0 bg-white/[0.08] border border-white/10 rounded-lg"
                      />
                    )}
                    <span className="relative z-10">{sec}</span>
                  </button>
                ))}
              </div>

              {/* Stage dropdown & Hiring toggle & Search */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                
                {/* Stage selector */}
                <select 
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="w-full sm:w-40 h-10 px-3 rounded-lg border border-white/5 bg-zinc-950 text-xs text-zinc-400 focus:outline-none focus:border-[#00F0FF]/50 cursor-pointer appearance-none"
                >
                  {STAGES.map(stg => (
                    <option key={stg} value={stg}>{stg}</option>
                  ))}
                </select>

                {/* Hiring only toggle */}
                <label className="flex items-center gap-2 shrink-0 cursor-pointer text-xs text-zinc-500 hover:text-zinc-300 select-none">
                  <input 
                    type="checkbox"
                    checked={onlyHiring}
                    onChange={(e) => setOnlyHiring(e.target.checked)}
                    className="w-4 h-4 rounded border-white/10 bg-zinc-950 checked:bg-[#00F0FF] checked:border-transparent accent-[#00F0FF] cursor-pointer"
                  />
                  <span>Hiring Openings</span>
                </label>

                {/* Search bar */}
                <div className="relative w-full sm:w-56 shrink-0">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input 
                    type="text"
                    placeholder="Search node taglines..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 pl-9 pr-4 rounded-lg bg-black border border-white/10 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-[#00F0FF]/50 transition-all"
                  />
                </div>

              </div>

            </div>

            {/* Startups Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filtered.map((startup) => {
                  const SectorIcon = SECTOR_ICONS[startup.sector] || Rocket;
                  const isHiring = (startup.jobs?.length || 0) > 0;
                  return (
                    <motion.div
                      key={startup.id}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.25 }}
                    >
                      <SpotlightCard
                        accent={startup.color}
                        className="p-6 rounded-3xl bg-[#08080A]/60 border border-white/5 hover:border-white/10 hover:bg-zinc-950/40 transition-all duration-300 flex flex-col justify-between h-full min-h-[280px] group relative overflow-hidden"
                      >
                        <div>
                          {/* Card Header metadata */}
                          <div className="flex items-start justify-between mb-4 w-full">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-xs"
                                style={{ borderColor: `${startup.color}25`, backgroundColor: `${startup.color}05`, color: startup.color }}
                              >
                                {startup.logoText}
                              </div>
                              <div>
                                <h3 className="text-sm font-bold text-white group-hover:text-white transition-colors">{startup.name}</h3>
                                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">{startup.sector}</span>
                              </div>
                            </div>
                            
                            <span className="text-[8px] font-mono text-zinc-500 px-2 py-0.5 rounded bg-white/5 border border-white/5">
                              {startup.stage}
                            </span>
                          </div>

                          {/* Tagline */}
                          <p className="text-xs font-bold text-white mb-2 leading-snug group-hover:text-[#00F0FF] transition-colors">
                            {startup.tagline}
                          </p>

                          {/* Description */}
                          <p className="text-[11px] text-zinc-400 font-light leading-relaxed mb-6 line-clamp-3">
                            {startup.description}
                          </p>

                          {/* Spec variables tags */}
                          <div className="flex flex-wrap gap-1.5 mb-6">
                            {startup.tech.map(t => (
                              <span key={t} className="px-2 py-0.5 rounded bg-white/[0.02] border border-white/[0.05] text-[9px] font-mono text-zinc-500">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Card bottom telemetry summary details */}
                        <div className="pt-4 border-t border-white/[0.04] mt-auto flex items-center justify-between w-full">
                          
                          {/* Financials & hiring badges */}
                          <div className="flex gap-4 font-mono text-[9px] text-zinc-500">
                            <span className="flex items-center gap-0.5"><DollarSign size={10} className="text-[#00FFA3]" /> {startup.raised}</span>
                            {isHiring ? (
                              <span className="text-[#FF1CF7] font-bold blink">🔥 Hiring {startup.jobs?.length} role(s)</span>
                            ) : (
                              <span>👥 Team: {startup.teamSize}</span>
                            )}
                          </div>

                          {/* Open detail button */}
                          <button
                            suppressHydrationWarning
                            onClick={() => setActiveStartup(startup)}
                            className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 hover:bg-white hover:text-black hover:scale-105 transition-all flex items-center justify-center text-zinc-400 cursor-pointer"
                          >
                            <ArrowRight size={12} />
                          </button>

                        </div>

                      </SpotlightCard>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {filtered.length === 0 && (
              <div className="py-24 text-center border border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
                <ShieldAlert size={28} className="text-zinc-600 mb-2 mx-auto animate-pulse" />
                <p className="text-xs text-zinc-500">No startup nodes matched filter configurations.</p>
              </div>
            )}

          </div>

        </div>
      </main>

      {/* ─── STARTUP DETAIL OVERLAY / SLIDE OVER ─── */}
      <AnimatePresence>
        {activeStartup && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl bg-[#09090b] border border-white/10 rounded-[2rem] p-8 relative overflow-hidden shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              
              {/* Dynamic Job application loader overlay */}
              {isApplying && (
                <div className="absolute inset-0 bg-black/95 z-40 p-6 flex flex-col justify-center items-center text-center space-y-4">
                  <div className="w-10 h-10 rounded-full border-4 border-t-[#00F0FF] border-white/5 animate-spin mb-2" />
                  <div className="space-y-1">
                    <span className="block text-[10px] font-mono text-white tracking-widest uppercase animate-pulse">Broadcasting Credentials</span>
                    <span className="block text-[8px] text-zinc-500">Syncing builder nodes inside startup db...</span>
                  </div>
                  
                  <div className="w-full bg-black border border-white/10 rounded-xl p-3 font-mono text-[8px] text-[#00F0FF] text-left min-h-[95px] flex flex-col justify-end overflow-hidden relative shadow-2xl">
                    <div className="absolute inset-0 bg-[#00F0FF]/5 pointer-events-none" />
                    <div className="flex flex-col gap-0.5 overflow-y-auto">
                      {applyLogs.map((log, idx) => (
                        <div key={idx} className="truncate">
                          {log}
                        </div>
                      ))}
                      <div className="w-1.5 h-3 bg-[#00F0FF] animate-pulse ml-0.5 inline-block" />
                    </div>
                  </div>
                </div>
              )}

              {/* Close Button */}
              <button 
                suppressHydrationWarning
                onClick={() => {
                  setActiveStartup(null);
                  setActiveJob(null);
                }} 
                className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors cursor-pointer bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-[10px] font-mono"
              >
                [Close]
              </button>

              {/* Startup details view */}
              {!activeJob ? (
                <div className="space-y-6 pt-4">
                  
                  {/* Title & Metadata Header */}
                  <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                    <div 
                      className="w-14 h-14 rounded-2xl border flex items-center justify-center font-black text-lg"
                      style={{ borderColor: `${activeStartup.color}30`, backgroundColor: `${activeStartup.color}05`, color: activeStartup.color }}
                    >
                      {activeStartup.logoText}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white leading-tight">{activeStartup.name}</h2>
                      <div className="flex gap-4 font-mono text-[10px] text-zinc-500 mt-1.5">
                        <span>Sector: <b className="text-zinc-300">{activeStartup.sector}</b></span>
                        <span>Stage: <b className="text-zinc-300">{activeStartup.stage}</b></span>
                        <span>Raised: <b className="text-[#00FFA3]">{activeStartup.raised}</b></span>
                      </div>
                    </div>
                  </div>

                  {/* Pitch description */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Pitch Overview</h4>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed">
                      {activeStartup.description}
                    </p>
                  </div>

                  {/* Founder Profile */}
                  <div className="p-4 rounded-2xl bg-black border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 text-xs font-mono font-bold">
                        {activeStartup.founder.avatar}
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-white">{activeStartup.founder.name}</span>
                        <span className="block text-[10px] font-mono text-zinc-500">Founder // @{activeStartup.founder.handle}</span>
                      </div>
                    </div>
                    
                    <button 
                      suppressHydrationWarning
                      onClick={() => {
                        window.location.href = `/community?chat=${activeStartup.founder.handle}`;
                      }}
                      className="px-3.5 py-1.5 rounded-lg border border-white/10 hover:border-white/20 text-zinc-400 hover:text-white font-mono text-[9px] font-bold cursor-pointer transition-all active:scale-[0.98]"
                    >
                      Message Founder
                    </button>
                  </div>

                  {/* Tech stack */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Technologies Stack</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {activeStartup.tech.map(t => (
                        <span key={t} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-zinc-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Available Jobs list */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Open Roles ({activeStartup.jobs?.length || 0})</h4>
                    <div className="space-y-3">
                      {activeStartup.jobs?.map(job => (
                        <div key={job.id} className="p-4 rounded-2xl bg-black border border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
                            <span className="block text-xs font-bold text-white">{job.role}</span>
                            <div className="flex gap-4 font-mono text-[9px] text-zinc-500 mt-1">
                              <span>💰 {job.salary}</span>
                              <span>💎 {job.equity} Equity</span>
                              <span>⏱️ {job.type}</span>
                            </div>
                          </div>

                          <button 
                            suppressHydrationWarning
                            onClick={() => handleApplyClick(job)}
                            className="px-4 py-2 rounded-lg bg-[#00F0FF] text-black font-mono text-[10px] font-bold hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer border-none"
                          >
                            Apply Role
                          </button>
                        </div>
                      ))}

                      {(!activeStartup.jobs || activeStartup.jobs.length === 0) && (
                        <p className="text-xs text-zinc-500 italic font-mono">No active job opportunities posted by this startup.</p>
                      )}
                    </div>
                  </div>

                </div>
              ) : (
                /* Job Application form view */
                <form onSubmit={handleApplySubmit} className="space-y-5 pt-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white">Apply for {activeJob.role}</h3>
                    <p className="text-[10px] text-zinc-500 font-mono">Company node: @{activeStartup.name} // Compensation: {activeJob.salary} + {activeJob.equity} Equity</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1 font-bold">Proposal Pitch Cover Letter</label>
                    <textarea 
                      rows={6}
                      required
                      value={applyCover}
                      onChange={(e) => setApplyCover(e.target.value)}
                      placeholder="Outline why your experience in compiling stack algorithms matches this startup and how many hours you can dedicate..."
                      className="w-full p-4 rounded-xl border border-white/5 bg-zinc-900/50 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-[#00F0FF]/50 focus:bg-black transition-all resize-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      suppressHydrationWarning
                      type="button"
                      onClick={() => setActiveJob(null)}
                      className="flex-1 py-2.5 rounded-xl border border-white/10 text-zinc-400 hover:text-white transition-all text-xs font-bold cursor-pointer bg-white/5 active:scale-[0.98]"
                    >
                      Back to Overview
                    </button>
                    <button 
                      suppressHydrationWarning
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-[#00F0FF] text-black hover:bg-[#00F0FF]/90 transition-all text-xs font-bold cursor-pointer active:scale-[0.98]"
                    >
                      Broadcast application
                    </button>
                  </div>
                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── REGISTER STARTUP MODAL ─── */}
      <AnimatePresence>
        {isRegModalOpen && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-xl bg-[#09090b] border border-white/10 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              
              {/* Dynamic submit loader */}
              {isRegSubmitting && (
                <div className="absolute inset-0 bg-black/98 z-40 p-6 flex flex-col justify-center items-center text-center space-y-4">
                  <div className="w-10 h-10 rounded-full border-4 border-t-[#00F0FF] border-white/5 animate-spin mb-2" />
                  <div className="space-y-1">
                    <span className="block text-[10px] font-mono text-white tracking-widest uppercase animate-pulse">Publishing Company</span>
                    <span className="block text-[8px] text-zinc-500">Writing startup configuration blocks...</span>
                  </div>
                  
                  <div className="w-full bg-black border border-white/10 rounded-xl p-3 font-mono text-[8px] text-[#00F0FF] text-left min-h-[110px] flex flex-col justify-end overflow-hidden relative shadow-2xl">
                    <div className="absolute inset-0 bg-[#00F0FF]/5 pointer-events-none" />
                    <div className="flex flex-col gap-0.5 overflow-y-auto">
                      {regLogs.map((log, idx) => (
                        <div key={idx} className="truncate">
                          {log}
                        </div>
                      ))}
                      <div className="w-1.5 h-3 bg-[#00F0FF] animate-pulse ml-0.5 inline-block" />
                    </div>
                  </div>
                </div>
              )}

              <button 
                suppressHydrationWarning
                onClick={() => setIsRegModalOpen(false)}
                className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors cursor-pointer bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-[10px] font-mono"
              >
                [Cancel]
              </button>

              <div className="text-center space-y-2 mb-4">
                <Rocket size={20} className="text-[#00F0FF] mx-auto animate-pulse" />
                <h3 className="text-lg font-bold text-white tracking-tight">Launch Startup Profile</h3>
                <p className="text-[10px] text-zinc-500 font-mono">Create and register your company profile inside the Launchpad database</p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-5">
                
                {/* Name & sector & stage */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1 font-bold">Company Name</label>
                    <input 
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. AetherLabs"
                      className="w-full h-10 px-3.5 rounded-xl border border-white/5 bg-zinc-900/50 text-xs text-white placeholder-zinc-750 focus:outline-none focus:border-[#00F0FF]/50 focus:bg-black transition-all"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1 font-bold">Sector Category</label>
                    <select 
                      value={regSector}
                      onChange={(e) => setRegSector(e.target.value as any)}
                      className="w-full h-10 px-3.5 rounded-xl border border-white/5 bg-zinc-900/50 text-xs text-zinc-300 focus:outline-none focus:border-[#00F0FF]/50 cursor-pointer appearance-none focus:bg-black"
                    >
                      {SECTORS.filter(s => s !== "All").map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1 font-bold">Funding Stage</label>
                    <select 
                      value={regStage}
                      onChange={(e) => setRegStage(e.target.value as any)}
                      className="w-full h-10 px-3.5 rounded-xl border border-white/5 bg-zinc-900/50 text-xs text-zinc-300 focus:outline-none focus:border-[#00F0FF]/50 cursor-pointer appearance-none focus:bg-black"
                    >
                      {STAGES.filter(s => s !== "All Stages").map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Capital Raised & Tagline */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5 sm:col-span-1">
                    <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1 font-bold">Capital Raised</label>
                    <input 
                      type="text"
                      value={regRaised}
                      onChange={(e) => setRegRaised(e.target.value)}
                      placeholder="e.g. $1.2M or Bootstrapped"
                      className="w-full h-10 px-3.5 rounded-xl border border-white/5 bg-zinc-900/50 text-xs text-white placeholder-zinc-750 focus:outline-none focus:border-[#00F0FF]/50 focus:bg-black transition-all"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1 font-bold">One-liner Tagline</label>
                    <input 
                      type="text"
                      required
                      value={regTagline}
                      onChange={(e) => setRegTagline(e.target.value)}
                      placeholder="e.g. Autonomous neural agent swarms for developer automation."
                      className="w-full h-10 px-3.5 rounded-xl border border-white/5 bg-zinc-900/50 text-xs text-white placeholder-zinc-750 focus:outline-none focus:border-[#00F0FF]/50 focus:bg-black transition-all"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1 font-bold">Company Overview</label>
                  <textarea 
                    rows={3}
                    required
                    value={regDesc}
                    onChange={(e) => setRegDesc(e.target.value)}
                    placeholder="Provide a detailed summary of your technological product architecture, user targets, and vision..."
                    className="w-full p-3.5 rounded-xl border border-white/5 bg-zinc-900/50 text-xs text-white placeholder-zinc-750 focus:outline-none focus:border-[#00F0FF]/50 focus:bg-black transition-all resize-none"
                  />
                </div>

                {/* Theme color & tech tags inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Theme Accent color selection */}
                  <div className="space-y-3">
                    <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1 font-bold">Theme Color Accent</label>
                    <div className="flex gap-3">
                      {["#00F0FF", "#FF1CF7", "#00FFA3", "#7B61FF", "#FFB000"].map(c => {
                        const active = regColor === c;
                        return (
                          <button
                            suppressHydrationWarning
                            key={c}
                            type="button"
                            onClick={() => setRegColor(c)}
                            className="w-6 h-6 rounded-full border transition-all cursor-pointer"
                            style={{ 
                              backgroundColor: c, 
                              borderColor: active ? "white" : "transparent",
                              boxShadow: active ? `0 0 10px ${c}` : "none"
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Tech stack tags */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1 font-bold">Tech Stack [Press Enter]</label>
                    <input 
                      type="text"
                      value={regCustomTech}
                      onChange={(e) => setRegCustomTech(e.target.value)}
                      onKeyDown={handleAddRegTech}
                      placeholder="e.g. Next.js (press enter)"
                      className="w-full h-10 px-3.5 rounded-xl border border-white/5 bg-zinc-900/50 text-xs text-white placeholder-zinc-750 focus:outline-none focus:border-[#00F0FF]/50 focus:bg-black transition-all"
                    />
                    <div className="flex flex-wrap gap-1 mt-1">
                      {regTech.map(t => (
                        <span key={t} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono text-zinc-400">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Job Position Posting section */}
                <div className="p-5 rounded-2xl bg-black border border-white/5 space-y-4">
                  <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold border-b border-white/5 pb-2">
                    Post Initial Vacancy (Optional)
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-zinc-500">Role Title</label>
                      <input 
                        type="text"
                        value={regRole}
                        onChange={(e) => setRegRole(e.target.value)}
                        placeholder="e.g. AI Systems Engineer"
                        className="w-full h-9 px-3 rounded-lg border border-white/5 bg-zinc-900/50 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-[#00F0FF]/50 focus:bg-black transition-all"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-zinc-500">Salary Range</label>
                      <input 
                        type="text"
                        value={regSalary}
                        onChange={(e) => setRegSalary(e.target.value)}
                        placeholder="e.g. $100k - $120k"
                        className="w-full h-9 px-3 rounded-lg border border-white/5 bg-zinc-900/50 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-[#00F0FF]/50 focus:bg-black transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-zinc-500">Equity Range</label>
                      <input 
                        type="text"
                        value={regEquity}
                        onChange={(e) => setRegEquity(e.target.value)}
                        placeholder="e.g. 1.0% - 2.0%"
                        className="w-full h-9 px-3 rounded-lg border border-white/5 bg-zinc-900/50 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-[#00F0FF]/50 focus:bg-black transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Register Button */}
                <button
                  suppressHydrationWarning
                  type="submit"
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#7B61FF] text-black font-extrabold text-xs hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mt-8 font-mono uppercase tracking-widest border-none shadow-[0_4px_25px_rgba(0,240,255,0.25)]"
                >
                  Publish Startup Node
                </button>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
