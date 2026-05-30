"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, TerminalSquare, Star, GitFork, Users, ExternalLink, 
  Search, Cpu, Code2, Database, ShieldAlert, Award 
} from "lucide-react";
import Link from "next/link";
import SpotlightCard from "@/components/community/SpotlightCard";
import { getMergedProjects, Project } from "@/utils/projectsData";

const POPULAR_TECH = [
  "Python", "PyTorch", "Rust", "Solidity", "Go", 
  "TypeScript", "React", "Framer", "Tailwind", "C++", 
  "WASM", "Redis", "JavaScript", "WebAudio", "TensorFlow.js"
];

export default function ExploreProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "trending" | "new">("all");

  useEffect(() => {
    getMergedProjects().then(setProjects);
  }, []);

  // Compute counters
  const totalProjects = projects.length;
  const totalIssues = projects.reduce((acc, p) => acc + (p.issues?.length || 0), 0);
  const totalOpenings = projects.reduce((acc, p) => acc + (p.openings?.length || 0), 0);

  const toggleTech = (tech: string) => {
    setSelectedTech(prev => 
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    );
  };

  // Filter & Sort Logic
  const filtered = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTech = selectedTech.length === 0 || 
                        selectedTech.every(t => project.tech.includes(t));
    
    return matchesSearch && matchesTech;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (activeTab === "trending") {
      // Parse star string (e.g. 1.2k -> 1200)
      const getStarsNum = (s: string | number) => {
        if (typeof s === "number") return s;
        if (s.endsWith("k")) return parseFloat(s.slice(0, -1)) * 1000;
        return parseInt(s) || 0;
      };
      return getStarsNum(b.stars) - getStarsNum(a.stars);
    }
    if (activeTab === "new") {
      // Custom project IDs are string timestamps or numbers; custom ones are newer
      return (typeof b.id === "string" ? 1 : 0) - (typeof a.id === "string" ? 1 : 0);
    }
    return 0; // Default
  });

  return (
    <div className="relative min-h-screen bg-[#030303] text-zinc-100 font-sans selection:bg-[#00F0FF]/30 flex flex-col">
      <main className="flex-1 flex flex-col relative pt-24 pb-20 z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] max-w-[1200px] h-[500px] bg-[#FF1CF7]/[0.03] blur-[150px] rounded-full mix-blend-screen pointer-events-none" />

        <div className="max-w-[1300px] mx-auto w-full px-6 relative z-10 space-y-12">
          
          {/* Breadcrumb Header */}
          <div className="flex items-center justify-between mt-8">
            <Link 
              href="/projects" 
              className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors font-mono text-xs cursor-pointer bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md"
            >
              <ArrowLeft size={13} /> Project Directory
            </Link>
            <div className="text-zinc-500 font-mono text-xs hidden sm:block">
              SYSTEM_CORE // EXPLORER_NODE_ACTIVE
            </div>
          </div>

          {/* Page Intro */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              Ecosystem <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF1CF7] to-[#7B61FF]">Explorer</span>
            </h1>
            <p className="text-zinc-400 text-sm font-light max-w-xl">
              Apply granular query criteria to search through compiled developer initiatives, code repos, and community micro-startups.
            </p>
          </div>

          {/* Mini Telemetry Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Active Repositories", value: totalProjects, icon: Cpu, color: "#00F0FF" },
              { label: "Developer Openings", value: totalOpenings, icon: Users, color: "#00FFA3" },
              { label: "Open Issues/Bounties", value: totalIssues, icon: ShieldAlert, color: "#FF1CF7" },
              { label: "Community Builders", value: 128, icon: Award, color: "#7B61FF" }
            ].map((stat, i) => (
              <div key={i} className="bg-[#08080a] border border-white/5 rounded-2xl p-4 flex flex-col justify-between min-h-[100px] relative overflow-hidden group shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.01] to-transparent pointer-events-none" />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">{stat.label}</span>
                  <stat.icon size={14} style={{ color: stat.color }} />
                </div>
                <div className="text-2xl font-bold mt-2 tracking-tight text-white group-hover:scale-105 transition-transform origin-left duration-300">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* Filters & Workspace layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left sidebar: Granular Filters */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#08080a] border border-white/5 rounded-2xl p-6 space-y-6 shadow-xl">
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest border-b border-white/5 pb-3">
                  Granular Filters
                </h3>

                {/* Text search */}
                <div className="space-y-2">
                  <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Query String</label>
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-3 text-zinc-500" />
                    <input 
                      type="text"
                      placeholder="Keyword / term..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-10 pl-9 pr-4 rounded-xl bg-black border border-white/10 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-[#FF1CF7]/50 transition-all"
                    />
                  </div>
                </div>

                {/* Tech selection grid */}
                <div className="space-y-3">
                  <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Tech Stack Signature</label>
                  <div className="flex flex-wrap gap-1.5 max-h-[220px] overflow-y-auto pr-1">
                    {POPULAR_TECH.map(tech => {
                      const active = selectedTech.includes(tech);
                      return (
                        <button
                          suppressHydrationWarning
                          key={tech}
                          onClick={() => toggleTech(tech)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold border transition-all cursor-pointer ${
                            active 
                              ? "bg-[#FF1CF7] text-black border-transparent shadow-[0_0_10px_rgba(255,28,247,0.2)]" 
                              : "bg-white/5 border-white/5 text-zinc-400 hover:border-white/15"
                          }`}
                        >
                          {tech}
                        </button>
                      );
                    })}
                  </div>
                  {selectedTech.length > 0 && (
                    <button 
                      suppressHydrationWarning
                      onClick={() => setSelectedTech([])} 
                      className="text-[9px] font-mono text-[#FF1CF7] hover:underline bg-transparent border-none cursor-pointer p-0"
                    >
                      [Clear tech selections]
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right content: Results list */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Tab Selector bar */}
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex gap-2">
                  {[
                    { id: "all", label: "All Packages" },
                    { id: "trending", label: "Trending Stars" },
                    { id: "new", label: "Recently Submitted" }
                  ].map(tab => (
                    <button
                      suppressHydrationWarning
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-4 py-2 text-xs font-mono font-bold border-b-2 transition-all cursor-pointer ${
                        activeTab === tab.id 
                          ? "border-[#FF1CF7] text-white" 
                          : "border-transparent text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div className="text-[10px] font-mono text-zinc-500">
                  Showing {sorted.length} / {projects.length} results
                </div>
              </div>

              {/* Grid of Results */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                  {sorted.map((project) => (
                    <motion.div
                      key={project.id}
                      layout
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link href={`/projects/${project.id}`} className="block h-full group">
                        <SpotlightCard
                          accent={project.color}
                          className="h-full flex flex-col justify-between p-6 rounded-2xl bg-[#08080A]/60 border border-white/5 group-hover:border-white/10 hover:bg-zinc-950/40 transition-all duration-300 min-h-[220px]"
                        >
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:scale-105 transition-transform duration-300">
                                  <TerminalSquare size={14} />
                                </div>
                                <div>
                                  <h4 className="text-xs font-bold text-white group-hover:text-[#FF1CF7] transition-colors">{project.name}</h4>
                                  <span className="text-[9px] font-mono text-zinc-500 tracking-wide">{project.category}</span>
                                </div>
                              </div>
                              <span className="text-[9px] font-mono text-zinc-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                {project.status}
                              </span>
                            </div>

                            <p className="text-xs text-zinc-400 font-light leading-relaxed line-clamp-2">
                              {project.description}
                            </p>

                            <div className="flex flex-wrap gap-1">
                              {project.tech.map(t => (
                                <span key={t} className="px-1.5 py-0.5 rounded bg-white/[0.02] border border-white/[0.05] text-[9px] font-mono text-zinc-500">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="pt-4 border-t border-white/[0.04] mt-4 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                            <div className="flex gap-3">
                              <span className="flex items-center gap-1"><Star size={11} /> {project.stars}</span>
                              <span className="flex items-center gap-1"><GitFork size={11} /> {project.forks}</span>
                            </div>
                            <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"><ExternalLink size={11} /></span>
                          </div>
                        </SpotlightCard>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {sorted.length === 0 && (
                  <div className="col-span-2 py-16 text-center border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                    <Database size={24} className="text-zinc-600 mb-2 mx-auto animate-pulse" />
                    <p className="text-xs text-zinc-500">No project signatures match selected tech filters.</p>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      </main>


    </div>
  );
}
