"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Users, Send, Calendar, Clock, Award, CheckCircle2, 
  TerminalSquare, Tag, AlertCircle, ShieldAlert 
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SpotlightCard from "@/components/community/SpotlightCard";
import { getMergedProjects, Project, ProjectOpening } from "@/utils/projectsData";
import { useAuth } from "@/context/AuthContext";

export default function CollaborateBoardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const { firebaseUser, localUser } = useAuth();
  
  // Filters
  const [selectedCommitment, setSelectedCommitment] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal apply state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyPitch, setApplyPitch] = useState("");
  const [applyLogs, setApplyLogs] = useState<string[]>([]);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    getMergedProjects().then(setProjects);
  }, []);

  // Extract all openings from all projects
  const allOpenings: Array<{ project: Project; opening: ProjectOpening }> = [];
  projects.forEach(p => {
    p.openings?.forEach(o => {
      allOpenings.push({ project: p, opening: o });
    });
  });

  // Filter openings
  const filteredOpenings = allOpenings.filter(item => {
    const matchesSearch = item.opening.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.project.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Simple commitment classification
    const hours = parseInt(item.opening.commitment) || 0;
    let category = "Part-Time";
    if (hours >= 20) category = "Full-Time Focus";
    else if (hours <= 8) category = "Advisory / Advisory";

    const matchesCommitment = selectedCommitment === "All" || 
                              (selectedCommitment === "Full-Time" && hours >= 20) ||
                              (selectedCommitment === "Part-Time" && hours < 20 && hours > 8) ||
                              (selectedCommitment === "Advisory" && hours <= 8);

    return matchesSearch && matchesCommitment;
  });

  const handleApplyClick = (project: Project, role: string) => {
    if (!firebaseUser) {
      router.push(`/signin?redirect=/projects/collaborate`);
      return;
    }
    setSelectedProject(project);
    setSelectedRole(role);
    setIsApplyModalOpen(true);
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyPitch.trim() || !selectedProject) return;
    setIsApplying(true);

    const logsList = [
      "Authenticating profile parameters...",
      "Resolving project registry node address...",
      "Lodging collaboration intent token...",
      "Syncing bio summary statistics...",
      "Broadcast complete! Pitch registered."
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < logsList.length) {
        setApplyLogs(prev => [...prev, `[INFO] ${logsList[i]}`]);
        i++;
      } else {
        clearInterval(interval);
        
        // Save application log in localStorage
        const customApps = localStorage.getItem("devlink_project_applications") || "[]";
        const appsList = JSON.parse(customApps);
        appsList.push({
          projectId: selectedProject.id,
          projectName: selectedProject.name,
          username: localUser?.username || firebaseUser?.email || "user",
          role: selectedRole,
          pitch: applyPitch,
          timestamp: Date.now()
        });
        localStorage.setItem("devlink_project_applications", JSON.stringify(appsList));

        // Done
        setIsApplying(false);
        setIsApplyModalOpen(false);
        setApplyPitch("");
        setApplyLogs([]);
      }
    }, 250);
  };

  return (
    <div className="relative min-h-screen bg-[#030303] text-zinc-100 font-sans selection:bg-[#00F0FF]/30 flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col relative pt-24 pb-20 z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] max-w-[1200px] h-[500px] bg-[#00FFA3]/[0.03] blur-[150px] rounded-full mix-blend-screen pointer-events-none" />

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
              SYSTEM_CORE // MATCHMAKER_NODE_ACTIVE
            </div>
          </div>

          {/* Page Intro */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              Collaboration <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFA3] to-[#00F0FF]">Board</span>
            </h1>
            <p className="text-zinc-400 text-sm font-light max-w-xl">
              Audit vacant roles in registered open-source teams. Pitch yourself directly to organizers to obtain project co-founder status.
            </p>
          </div>

          {/* Filtering controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-2 rounded-2xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl">
            
            {/* Commitment pills */}
            <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
              {[
                { id: "All", label: "All Hours" },
                { id: "Full-Time", label: "Full-Time Focus (20+ h/w)" },
                { id: "Part-Time", label: "Part-Time Dev (10-18 h/w)" },
                { id: "Advisory", label: "Advisory / Advisory (≤8 h/w)" }
              ].map(c => (
                <button
                  suppressHydrationWarning
                  key={c.id}
                  onClick={() => setSelectedCommitment(c.id)}
                  className={`relative px-4 py-2.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all duration-300 cursor-pointer ${
                    selectedCommitment === c.id 
                      ? "text-white" 
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]"
                  }`}
                >
                  {selectedCommitment === c.id && (
                    <motion.div
                      layoutId="active-pill-commit"
                      className="absolute inset-0 bg-white/[0.08] border border-white/10 rounded-xl"
                    />
                  )}
                  <span className="relative z-10">{c.label}</span>
                </button>
              ))}
            </div>

            {/* Keyword Search */}
            <div className="relative w-full md:w-64 shrink-0">
              <input 
                type="text"
                placeholder="Search roles or projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-black border border-white/10 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-[#00FFA3]/50 transition-all"
              />
            </div>

          </div>

          {/* Openings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredOpenings.map(({ project, opening }) => (
                <motion.div
                  key={`${project.id}-${opening.id}`}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                >
                  <SpotlightCard
                    accent={project.color}
                    className="p-6 rounded-3xl bg-[#08080A]/60 border border-white/5 hover:border-white/10 hover:bg-zinc-950/40 transition-all duration-300 flex flex-col justify-between h-full min-h-[260px] group relative overflow-hidden"
                  >
                    <div>
                      {/* Top metadata */}
                      <div className="flex items-start justify-between mb-4 w-full">
                        <div className="flex items-center gap-2">
                          <TerminalSquare size={14} style={{ color: project.color }} />
                          <Link href={`/projects/${project.id}`} className="text-xs font-mono font-bold text-zinc-400 hover:text-white transition-colors">
                            {project.name}
                          </Link>
                        </div>
                        <span className="text-[8px] font-mono text-zinc-500 uppercase px-2 py-0.5 rounded bg-white/5 border border-white/5">
                          {project.category}
                        </span>
                      </div>

                      {/* Opening Role Title */}
                      <h3 className="text-sm font-bold text-white mb-3 group-hover:text-[#00FFA3] transition-colors">
                        {opening.role}
                      </h3>

                      {/* Project brief */}
                      <p className="text-xs text-zinc-400 font-light leading-relaxed mb-6">
                        {project.description}
                      </p>

                      {/* Stat parameters tags */}
                      <div className="flex gap-4 mb-6">
                        <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-500">
                          <Clock size={11} className="text-[#00FFA3]" />
                          <span>{opening.commitment}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-500">
                          <Award size={11} className="text-[#FF1CF7]" />
                          <span>{opening.equity} Equity</span>
                        </div>
                      </div>
                    </div>

                    {/* Apply actions */}
                    <div className="flex gap-2 w-full pt-4 border-t border-white/[0.04] mt-auto">
                      <Link 
                        href={`/projects/${project.id}`}
                        className="flex-1 h-9 rounded-lg border border-white/10 hover:border-white/20 text-zinc-400 hover:text-white font-mono text-[9px] font-bold flex items-center justify-center transition-all bg-white/5 active:scale-[0.98]"
                      >
                        Auditing Node
                      </Link>
                      
                      <button 
                        suppressHydrationWarning
                        onClick={() => handleApplyClick(project, opening.role)}
                        className="flex-1 h-9 rounded-lg bg-[#00FFA3] text-black font-mono text-[9px] font-bold flex items-center justify-center gap-1 transition-all hover:shadow-[0_0_12px_rgba(0,255,163,0.2)] hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
                      >
                        Apply Role <Send size={9} />
                      </button>
                    </div>

                  </SpotlightCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredOpenings.length === 0 && (
            <div className="py-24 text-center border border-dashed border-white/5 rounded-[2rem] bg-white/[0.01]">
              <AlertCircle size={28} className="text-zinc-600 mb-2 mx-auto animate-pulse" />
              <p className="text-xs text-zinc-500">No collaboration openings match query conditions.</p>
            </div>
          )}

        </div>
      </main>

      {/* ─── APPLY MODAL ─── */}
      <AnimatePresence>
        {isApplyModalOpen && selectedProject && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="w-full max-w-md bg-[#09090b] border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-2xl space-y-6"
            >
              
              {/* Dynamic submit loader */}
              {isApplying && (
                <div className="absolute inset-0 bg-black/95 z-30 p-6 flex flex-col justify-center items-center text-center space-y-4">
                  <div className="w-10 h-10 rounded-full border-4 border-t-[#00FFA3] border-white/5 animate-spin mb-2" />
                  <div className="space-y-1">
                    <span className="block text-[10px] font-mono text-white tracking-widest uppercase animate-pulse">Broadcasting Pitch</span>
                    <span className="block text-[8px] text-zinc-500">Lodging parameters inside team database...</span>
                  </div>
                  
                  <div className="w-full bg-black border border-white/10 rounded-xl p-3 font-mono text-[8px] text-[#00FFA3] text-left min-h-[90px] flex flex-col justify-end overflow-hidden relative shadow-2xl">
                    <div className="absolute inset-0 bg-[#00FFA3]/5 pointer-events-none" />
                    <div className="flex flex-col gap-0.5 overflow-y-auto">
                      {applyLogs.map((log, idx) => (
                        <div key={idx} className="truncate">
                          {log}
                        </div>
                      ))}
                      <div className="w-1.5 h-3 bg-[#00FFA3] animate-pulse ml-0.5 inline-block" />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2 text-center">
                <div className="w-10 h-10 rounded-xl bg-[#00FFA3]/10 border border-[#00FFA3]/20 flex items-center justify-center text-[#00FFA3] mx-auto shadow-inner">
                  <Award size={18} />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">Apply for Position</h3>
                <p className="text-[10px] text-zinc-500 font-mono">@{selectedProject.name} // {selectedRole}</p>
              </div>

              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1 font-bold">Proposal Pitch Message</label>
                  <textarea 
                    rows={4}
                    required
                    value={applyPitch}
                    onChange={(e) => setApplyPitch(e.target.value)}
                    placeholder="Describe your capabilities, previous repositories built, and availability..."
                    className="w-full p-3 rounded-xl border border-white/5 bg-zinc-900/50 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-[#00FFA3]/50 focus:bg-black transition-all resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    suppressHydrationWarning
                    type="button"
                    onClick={() => setIsApplyModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 text-zinc-400 hover:text-white transition-all text-xs font-bold cursor-pointer bg-white/5 active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                  <button 
                    suppressHydrationWarning
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#00FFA3] text-black hover:bg-[#00FFA3]/90 transition-all text-xs font-bold cursor-pointer active:scale-[0.98]"
                  >
                    Broadcast Pitch
                  </button>
                </div>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
