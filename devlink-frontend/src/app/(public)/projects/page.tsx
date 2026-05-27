"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TerminalSquare, Star, GitFork, Users, ExternalLink, 
  Globe2, FolderKanban, Search, Compass, LayoutGrid, AlertCircle, Plus 
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SpotlightCard from "@/components/community/SpotlightCard";
import { getMergedProjects, Project } from "@/utils/projectsData";

const CATEGORIES = ["All", "AI/ML", "Web3", "FinTech", "Open Source", "Infrastructure"];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Sync state on client mount
  useEffect(() => {
    getMergedProjects().then(setProjects);
  }, []);
  // Filter Logic
  const filteredProjects = projects.filter((project) => {
    const matchesCategory = activeCategory === "All" || project.category === activeCategory;
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.tech.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative min-h-screen bg-[#030303] text-zinc-100 font-sans selection:bg-[#00F0FF]/30 flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col relative pt-24 pb-20 z-10">
        
        {/* Ambient background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] max-w-[1200px] h-[600px] bg-[#00F0FF]/[0.04] blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
        <div className="absolute top-40 right-0 w-[500px] h-[500px] bg-[#FF1CF7]/[0.03] blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

        <div className="max-w-[1300px] mx-auto w-full px-6 relative z-10 space-y-12">
          
          {/* Page Header */}
          <div className="flex flex-col items-center text-center space-y-6 mt-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md"
            >
              <Globe2 size={14} className="text-[#00F0FF] animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-[0.2em] text-[#00F0FF] uppercase">
                Decentralized Index
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter text-white leading-tight"
            >
              The Project <br className="sm:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#FF1CF7] to-[#7B61FF]">
                Matrix.
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm md:text-base text-zinc-400 max-w-2xl font-light leading-relaxed"
            >
              Discover open-source protocols, active startups, and community hackathon projects. Find your next crew or contribute to the core.
            </motion.p>
          </div>

          {/* Premium Telemetry Sub-Navigation Panel */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="w-full bg-[#08080a] border border-white/5 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#00F0FF]/[0.01] to-[#7B61FF]/[0.01] pointer-events-none" />
            <div className="flex flex-wrap items-center gap-3">
              <Link 
                href="/projects/explore"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-white/5 border border-white/10 hover:border-[#00F0FF]/30 text-white transition-all hover:scale-[1.02]"
              >
                <Compass size={13} className="text-[#00F0FF]" /> Explore Deck
              </Link>
              <Link 
                href="/projects/categories"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-white/5 border border-white/10 hover:border-[#FF1CF7]/30 text-white transition-all hover:scale-[1.02]"
              >
                <LayoutGrid size={13} className="text-[#FF1CF7]" /> Categories
              </Link>
              <Link 
                href="/projects/collaborate"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-white/5 border border-white/10 hover:border-[#00FFA3]/30 text-white transition-all hover:scale-[1.02]"
              >
                <Users size={13} className="text-[#00FFA3]" /> Collaboration Board
              </Link>
              <Link 
                href="/projects/open-issues"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-white/5 border border-white/10 hover:border-[#7B61FF]/30 text-white transition-all hover:scale-[1.02]"
              >
                <AlertCircle size={13} className="text-[#7B61FF]" /> Open Issues
              </Link>
            </div>
            
            <Link 
              href="/projects/submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-mono font-bold bg-[#00F0FF] text-black hover:bg-[#00F0FF]/90 transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:scale-[1.02]"
            >
              <Plus size={13} /> Submit Project
            </Link>
          </motion.div>

          {/* Filters & Search */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col md:flex-row items-center justify-between gap-4 p-2 rounded-2xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl"
          >
            {/* Category Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`relative px-5 py-2.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all duration-300 ${
                    activeCategory === category 
                      ? "text-white" 
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]"
                  }`}
                >
                  {activeCategory === category && (
                    <motion.div
                      layoutId="active-pill-proj"
                      className="absolute inset-0 bg-white/[0.08] border border-white/10 rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                    />
                  )}
                  <span className="relative z-10">{category}</span>
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-64 shrink-0">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input 
                type="text"
                placeholder="Search matrix..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#00F0FF]/50 focus:ring-1 focus:ring-[#00F0FF]/50 transition-all shadow-inner"
              />
            </div>
          </motion.div>

          {/* Project Grid */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                >
                  <Link href={`/projects/${project.id}`} className="block h-full group">
                    <SpotlightCard
                      accent={project.color}
                      className="h-full flex flex-col justify-between p-6 rounded-3xl bg-[#08080A] border border-white/[0.08] group-hover:border-white/20 transition-all duration-300 relative overflow-hidden"
                    >
                      {/* Hover Glow Effect */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#00F0FF]/0 to-transparent group-hover:via-white/30 transition-all duration-500" />

                      {/* Card Header */}
                      <div className="flex items-start justify-between mb-6 relative z-10 w-full">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center shadow-inner">
                            <TerminalSquare size={18} className="text-zinc-300" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-white group-hover:text-white transition-colors">{project.name}</h3>
                            <p className="text-[9px] font-mono tracking-wider text-zinc-500 uppercase">{project.category}</p>
                          </div>
                        </div>
                        
                        {/* Status Pill */}
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 border border-white/5 backdrop-blur-md">
                          <span 
                            className="w-1.5 h-1.5 rounded-full animate-pulse" 
                            style={{ backgroundColor: project.color, boxShadow: `0 0 8px ${project.color}` }} 
                          />
                          <span className="text-[9px] font-mono text-zinc-400">{project.status}</span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="flex-1 relative z-10">
                        <p className="text-xs text-zinc-400 font-light leading-relaxed mb-6">
                          {project.description}
                        </p>
                        
                        {/* Tech Stack Pills */}
                        <div className="flex flex-wrap items-center gap-1.5 mb-6">
                          {project.tech.map(t => (
                            <span key={t} className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.05] text-[9px] font-mono text-zinc-400">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Card Footer (Stats) */}
                      <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between relative z-10 w-full">
                        <div className="flex items-center gap-4 text-zinc-500">
                          <div className="flex items-center gap-1 hover:text-white transition-colors">
                            <Star size={12} />
                            <span className="text-[10px] font-mono">{project.stars}</span>
                          </div>
                          <div className="flex items-center gap-1 hover:text-white transition-colors">
                            <GitFork size={12} />
                            <span className="text-[10px] font-mono">{project.forks}</span>
                          </div>
                          <div className="flex items-center gap-1 hover:text-white transition-colors">
                            <Users size={12} />
                            <span className="text-[10px] font-mono">{project.contributors}</span>
                          </div>
                        </div>

                        <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center text-zinc-400 group-hover:bg-white group-hover:text-black group-hover:scale-110 transition-all duration-300">
                          <ExternalLink size={12} />
                        </div>
                      </div>
                    </SpotlightCard>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="w-full py-24 flex flex-col items-center justify-center text-center border border-white/[0.05] border-dashed rounded-3xl bg-white/[0.01]"
            >
              <TerminalSquare size={32} className="text-zinc-600 mb-4 animate-pulse" />
              <h3 className="text-lg font-bold text-white mb-2">No projects found.</h3>
              <p className="text-xs text-zinc-500">Try adjusting your filters or search query.</p>
            </motion.div>
          )}

        </div>
      </main>

    </div>
  );
}