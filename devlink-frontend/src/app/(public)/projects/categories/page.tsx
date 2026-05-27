"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Cpu, Globe2, ShieldCheck, Code2, Database, Info, 
  TerminalSquare, Star, GitFork, Users, ExternalLink, ArrowRight, LayoutGrid 
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SpotlightCard from "@/components/community/SpotlightCard";
import { getMergedProjects, Project } from "@/utils/projectsData";

const CATEGORY_METADATA = [
  {
    name: "AI/ML",
    desc: "Neural network execution, vector databases, browser models, and agent runtimes.",
    color: "#00F0FF",
    icon: Cpu
  },
  {
    name: "Web3",
    desc: "Cryptographic consensus, zero-knowledge proofs, rollups, and smart contracts.",
    color: "#FF1CF7",
    icon: Globe2
  },
  {
    name: "FinTech",
    desc: "High-frequency micro-payments, continuous streams, ledgers, and transactions.",
    color: "#00FFA3",
    icon: ShieldCheck
  },
  {
    name: "Open Source",
    desc: "Accessible primitives, headless frameworks, design systems, and DX toolkits.",
    color: "#7B61FF",
    icon: Code2
  },
  {
    name: "Infrastructure",
    desc: "Edge-databases, WASM pipelines, distributed computing, and containerization.",
    color: "#FFB000",
    icon: Database
  }
];

export default function CategoriesPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    getMergedProjects().then(setProjects);
  }, []);

  // Calculate statistics for each category
  const categoryStats = CATEGORY_METADATA.map(meta => {
    const categoryProjects = projects.filter(p => p.category === meta.name);
    
    // Sum stars (translating 1.2k strings to numbers if needed)
    const getStarsNum = (s: string | number) => {
      if (typeof s === "number") return s;
      if (s.endsWith("k")) return parseFloat(s.slice(0, -1)) * 1000;
      return parseInt(s) || 0;
    };
    
    const totalStars = categoryProjects.reduce((acc, p) => acc + getStarsNum(p.stars), 0);
    const totalOpenings = categoryProjects.reduce((acc, p) => acc + (p.openings?.length || 0), 0);
    const totalIssues = categoryProjects.reduce((acc, p) => acc + (p.issues?.length || 0), 0);

    return {
      ...meta,
      projectsCount: categoryProjects.length,
      starsCount: totalStars >= 1000 ? `${(totalStars / 1000).toFixed(1)}k` : totalStars,
      openingsCount: totalOpenings,
      issuesCount: totalIssues,
      projectList: categoryProjects
    };
  });

  return (
    <div className="relative min-h-screen bg-[#030303] text-zinc-100 font-sans selection:bg-[#00F0FF]/30 flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col relative pt-24 pb-20 z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] max-w-[1200px] h-[500px] bg-[#7B61FF]/[0.03] blur-[150px] rounded-full mix-blend-screen pointer-events-none" />

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
              SYSTEM_CORE // CATEGORIES_NODE_ACTIVE
            </div>
          </div>

          {/* Page Intro */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              Ecosystem <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFA3] via-[#00F0FF] to-[#7B61FF]">Categories</span>
            </h1>
            <p className="text-zinc-400 text-sm font-light max-w-xl">
              Browse projects classified by technological domains. Click on a category module to audit the active repository stack underneath.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryStats.map((cat) => {
              const isExpanded = expandedCategory === cat.name;
              return (
                <div 
                  key={cat.name} 
                  className={`relative flex flex-col justify-between rounded-3xl bg-[#08080a] border transition-all duration-300 overflow-hidden shadow-2xl p-6 ${
                    isExpanded 
                      ? "border-white/20 ring-1 ring-white/10 md:col-span-2 lg:col-span-3 bg-zinc-950/60" 
                      : "border-white/5 hover:border-white/10 hover:-translate-y-0.5"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 w-full">
                    {/* Left block info */}
                    <div className="flex items-start gap-4 max-w-xl">
                      <div 
                        className="w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 shadow-inner"
                        style={{ borderColor: `${cat.color}25`, backgroundColor: `${cat.color}05`, color: cat.color }}
                      >
                        <cat.icon size={22} />
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="text-lg font-bold text-white tracking-tight">{cat.name}</h3>
                        <p className="text-xs text-zinc-400 font-light leading-relaxed">{cat.desc}</p>
                      </div>
                    </div>

                    {/* Right block: Category Stats counters */}
                    <div className="flex flex-wrap items-center gap-6 text-zinc-500 font-mono text-[10px] uppercase tracking-wider shrink-0 lg:ml-auto">
                      <div className="text-left border-l border-white/5 pl-4">
                        <span className="block text-zinc-600 text-[8px] mb-0.5">Projects</span>
                        <span className="text-sm font-bold text-white">{cat.projectsCount}</span>
                      </div>
                      <div className="text-left border-l border-white/5 pl-4">
                        <span className="block text-zinc-600 text-[8px] mb-0.5">Total Stars</span>
                        <span className="text-sm font-bold text-white">{cat.starsCount}</span>
                      </div>
                      <div className="text-left border-l border-white/5 pl-4">
                        <span className="block text-zinc-600 text-[8px] mb-0.5">Openings</span>
                        <span className="text-sm font-bold text-[#00FFA3]">{cat.openingsCount}</span>
                      </div>
                      <div className="text-left border-l border-white/5 pl-4">
                        <span className="block text-zinc-600 text-[8px] mb-0.5">Active Issues</span>
                        <span className="text-sm font-bold text-[#FF1CF7]">{cat.issuesCount}</span>
                      </div>
                    </div>

                    {/* Toggle button */}
                    <button
                      suppressHydrationWarning
                      onClick={() => setExpandedCategory(isExpanded ? null : cat.name)}
                      className={`h-10 px-4 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 border cursor-pointer hover:scale-[1.02] shrink-0 mt-4 lg:mt-0 ${
                        isExpanded
                          ? "bg-white/10 text-white border-white/20"
                          : "bg-white/5 text-zinc-300 border-white/10 hover:border-white/20"
                      }`}
                    >
                      {isExpanded ? "Close Directory" : "View Directory"} <ArrowRight size={13} className={`transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`} />
                    </button>
                  </div>

                  {/* Expandable Project List Directory */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="w-full mt-6 pt-6 border-t border-white/5 overflow-hidden"
                      >
                        <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-4">
                          Audit Registry: {cat.name} Projects ({cat.projectsCount})
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {cat.projectList.map((project) => (
                            <Link key={project.id} href={`/projects/${project.id}`} className="group">
                              <div className="p-5 rounded-2xl bg-black border border-white/5 hover:border-white/10 transition-all hover:bg-white/[0.01] flex flex-col justify-between h-full min-h-[160px]">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <TerminalSquare size={14} style={{ color: cat.color }} />
                                      <span className="text-xs font-bold text-white group-hover:text-white transition-colors">{project.name}</span>
                                    </div>
                                    <span className="text-[8px] font-mono text-zinc-500 px-1.5 py-0.5 rounded bg-white/5">
                                      {project.status}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-zinc-400 font-light leading-relaxed line-clamp-2">
                                    {project.description}
                                  </p>
                                </div>

                                <div className="pt-3 border-t border-white/[0.03] mt-3 flex items-center justify-between text-[9px] font-mono text-zinc-500">
                                  <div className="flex gap-3">
                                    <span className="flex items-center gap-0.5"><Star size={10} /> {project.stars}</span>
                                    <span className="flex items-center gap-0.5"><GitFork size={10} /> {project.forks}</span>
                                  </div>
                                  <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                                    Details <ArrowRight size={9} />
                                  </span>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>

                        {cat.projectList.length === 0 && (
                          <div className="py-12 text-center border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                            <LayoutGrid size={24} className="text-zinc-600 mb-2 mx-auto animate-pulse" />
                            <p className="text-xs text-zinc-500">No project signatures loaded in this folder registry.</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              );
            })}
          </div>

        </div>
      </main>

      
    </div>
  );
}
