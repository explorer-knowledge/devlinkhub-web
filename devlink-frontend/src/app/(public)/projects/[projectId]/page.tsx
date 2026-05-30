"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, TerminalSquare, Star, GitFork, Users, ExternalLink, 
  Plus, Calendar, CheckCircle2, Send, ShieldAlert, Award, FileCode, Check 
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SpotlightCard from "@/components/community/SpotlightCard";
import { getMergedProjects, saveProjects, Project, ProjectIssue } from "@/utils/projectsData";

export default function ProjectDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Dynamic Updates state
  const [timeline, setTimeline] = useState<Array<{ date: string, text: string }>>([
    { date: "May 10, 2026", text: "Alpha core engine successfully compiled & integrated." },
    { date: "May 02, 2026", text: "Decentralized consensus framework draft published." },
    { date: "Apr 28, 2026", text: "Repository created on local cluster nodes." }
  ]);
  const [newUpdate, setNewUpdate] = useState("");
  const [isAddingUpdate, setIsAddingUpdate] = useState(false);

  // Apply Modal state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyRole, setApplyRole] = useState("");
  const [applyPitch, setApplyPitch] = useState("");
  const [applyLogs, setApplyLogs] = useState<string[]>([]);
  const [isApplying, setIsApplying] = useState(false);

  // Load project details
  useEffect(() => {
    if (typeof window !== "undefined") {
      const authUser = localStorage.getItem("devlinkhub_auth_user");
      if (authUser) {
        setCurrentUser(JSON.parse(authUser));
      }

      getMergedProjects().then((all) => {
        const matched = all.find(p => String(p.id) === String(projectId));
        if (matched) {
          setProject(matched);
        }
        setLoading(false);
      });
    }
  }, [projectId]);

  // Handle claiming an issue
  const handleClaimIssue = (issueId: string) => {
    if (!currentUser) {
      router.push(`/signin?redirect=/projects/${projectId}`);
      return;
    }

    if (!project) return;

    const updatedIssues = project.issues?.map(issue => {
      if (issue.id === issueId) {
        return { ...issue, claimedBy: currentUser.username };
      }
      return issue;
    }) || [];

    const updatedProject = { ...project, issues: updatedIssues };
    setProject(updatedProject);

    // Save to global list
    getMergedProjects().then((all) => {
      const updatedList = all.map(p => String(p.id) === String(projectId) ? updatedProject : p);
      saveProjects(updatedList);
    });
  };

  // Handle adding custom milestone update
  const handleAddUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUpdate.trim()) return;

    const dateToday = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    });

    const newLog = { date: dateToday, text: newUpdate.trim() };
    setTimeline(prev => [newLog, ...prev]);
    setNewUpdate("");
    setIsAddingUpdate(false);
  };

  // Handle applying for role
  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyPitch.trim()) return;
    setIsApplying(true);

    const logsList = [
      "Securing connection pipeline to organization lead...",
      "Encrypting pitch credentials and bio nodes...",
      "Syncing profile telemetry matching indices...",
      "Broadcasting credentials packet...",
      "Proposal successfully lodged!"
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < logsList.length) {
        setApplyLogs(prev => [...prev, `[INFO] ${logsList[i]}`]);
        i++;
      } else {
        clearInterval(interval);
        
        // Save application log in localStorage
        const customApps = localStorage.getItem("devlinkhub_project_applications") || "[]";
        const appsList = JSON.parse(customApps);
        appsList.push({
          projectId: project?.id,
          projectName: project?.name,
          username: currentUser?.username,
          role: applyRole,
          pitch: applyPitch,
          timestamp: Date.now()
        });
        localStorage.setItem("devlinkhub_project_applications", JSON.stringify(appsList));

        // Done
        setIsApplying(false);
        setIsApplyModalOpen(false);
        setApplyPitch("");
        setApplyLogs([]);
      }
    }, 250);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono text-xs">
        Compiling project telemetry data...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-black text-zinc-300 flex flex-col justify-center items-center px-4 text-center">
        <ShieldAlert size={40} className="text-[#FF1CF7] mb-4 animate-bounce" />
        <h2 className="text-xl font-bold text-white mb-2">Project Node Unresolved</h2>
        <p className="text-xs text-zinc-500 max-w-sm mb-6 leading-relaxed">
          The requested project telemetry matrix identifier does not match any registered nodes in the decentralized registry.
        </p>
        <Link 
          href="/projects" 
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors font-mono text-xs cursor-pointer bg-white/5 border border-white/10 px-5 py-2.5 rounded-full"
        >
          <ArrowLeft size={13} /> Back to Ecosystem
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#030303] text-zinc-100 font-sans selection:bg-[#00F0FF]/30 flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col relative pt-24 pb-20 z-10">
        
        {/* Background Accent glow */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[90vw] max-w-[1000px] h-[400px] blur-[150px] rounded-full opacity-[0.06] pointer-events-none mix-blend-screen"
          style={{ backgroundColor: project.color }}
        />

        <div className="max-w-[1300px] mx-auto w-full px-6 relative z-10 space-y-8">
          
          {/* Breadcrumbs */}
          <div className="flex items-center justify-between mt-8">
            <Link 
              href="/projects" 
              className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors font-mono text-xs cursor-pointer bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md"
            >
              <ArrowLeft size={13} /> Return to directory
            </Link>
            <div className="text-zinc-500 font-mono text-[10px] hidden sm:block">
              WORKSPACE // {String(project.id).toUpperCase()} // ROOT
            </div>
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ─── LEFT COLUMN: TELEMETRY & STATS ─── */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-[#08080a] border border-white/5 rounded-2xl p-6 space-y-6 shadow-xl">
                
                {/* Visual Icon Header */}
                <div className="flex flex-col items-center text-center space-y-4">
                  <div 
                    className="w-16 h-16 rounded-2xl border flex items-center justify-center shadow-inner relative group overflow-hidden"
                    style={{ borderColor: `${project.color}30`, backgroundColor: `${project.color}05` }}
                  >
                    <TerminalSquare size={30} style={{ color: project.color }} />
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white tracking-tight">{project.name}</h2>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">{project.category}</span>
                  </div>
                </div>

                {/* Counter metrics */}
                <div className="grid grid-cols-3 gap-2 py-4 border-y border-white/5 text-center">
                  <div>
                    <span className="block text-[8px] font-mono text-zinc-600 uppercase">Stars</span>
                    <span className="text-xs font-bold text-white font-mono">{project.stars}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] font-mono text-zinc-600 uppercase">Forks</span>
                    <span className="text-xs font-bold text-white font-mono">{project.forks}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] font-mono text-zinc-600 uppercase">Contributors</span>
                    <span className="text-xs font-bold text-white font-mono">{project.contributors}</span>
                  </div>
                </div>

                {/* Detailed Spec list */}
                <div className="space-y-4 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 font-mono">Status:</span>
                    <span className="px-2 py-0.5 rounded font-mono text-[9px] text-zinc-400 bg-white/5 border border-white/5">
                      {project.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 font-mono">Code Repo:</span>
                    <a 
                      href={project.githubUrl || "#"} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-zinc-400 hover:text-white flex items-center gap-1 font-mono text-[10px] truncate max-w-[120px] transition-colors"
                    >
                      GitHub <ExternalLink size={10} />
                    </a>
                  </div>
                </div>

                {/* Tech signatures */}
                <div className="space-y-2">
                  <span className="block text-[9px] font-mono text-zinc-600 uppercase">Technologies</span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded bg-white/[0.02] border border-white/[0.05] text-[9px] font-mono text-zinc-400">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* ─── CENTER COLUMN: CONTENT & TIMELINE ─── */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Profile Card Header */}
              <div className="bg-[#08080a] border border-white/5 rounded-3xl p-8 space-y-6 shadow-xl relative overflow-hidden">
                <div className="space-y-3">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{project.name}</h1>
                  <p className="text-sm text-zinc-400 leading-relaxed font-light">
                    {project.longDescription || project.description}
                  </p>
                </div>
              </div>

              {/* Development Timeline Log */}
              <div className="bg-[#08080a] border border-white/5 rounded-3xl p-8 space-y-6 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <Calendar size={13} className="text-[#00F0FF]" /> Activity Milestones Log
                  </h3>
                  
                  <button 
                    suppressHydrationWarning
                    onClick={() => setIsAddingUpdate(!isAddingUpdate)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-[0.97]"
                  >
                    <Plus size={11} /> Append Log
                  </button>
                </div>

                {/* Inline milestone addition */}
                <AnimatePresence>
                  {isAddingUpdate && (
                    <motion.form
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      onSubmit={handleAddUpdate}
                      className="space-y-3 p-4 rounded-xl border border-white/5 bg-black/60 overflow-hidden"
                    >
                      <label className="block text-[9px] font-mono text-zinc-500 uppercase tracking-widest">[Append custom milestone statement]</label>
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          required
                          value={newUpdate}
                          onChange={(e) => setNewUpdate(e.target.value)}
                          placeholder="e.g. Integrated decentralized RPC failovers..."
                          className="flex-1 h-9 px-3 rounded-lg border border-white/10 bg-zinc-900/50 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-[#00F0FF]/50"
                        />
                        <button 
                          suppressHydrationWarning
                          type="submit"
                          className="h-9 px-3 rounded-lg bg-[#00F0FF] text-black font-bold text-xs flex items-center justify-center cursor-pointer transition-all active:scale-[0.97]"
                        >
                          <Send size={12} />
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Logs lists */}
                <div className="relative border-l border-white/10 pl-6 ml-3 space-y-6 pt-2">
                  {timeline.map((log, index) => (
                    <div key={index} className="relative group">
                      <div 
                        className="absolute -left-[30px] top-1.5 w-2 h-2 rounded-full border bg-black transition-all group-hover:scale-125"
                        style={{ borderColor: project.color, boxShadow: `0 0 6px ${project.color}` }}
                      />
                      <span className="block text-[9px] font-mono text-zinc-600">{log.date}</span>
                      <p className="text-xs text-zinc-400 font-light mt-1.5 leading-relaxed">
                        {log.text}
                      </p>
                    </div>
                  ))}
                </div>

              </div>

            </div>

            {/* ─── RIGHT COLUMN: OPENINGS & ISSUES ─── */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* 1. Collaboration Roles Vacant */}
              <div className="bg-[#08080a] border border-white/5 rounded-2xl p-6 space-y-4 shadow-xl">
                <h3 className="text-[10px] font-mono font-bold text-white uppercase tracking-widest border-b border-white/5 pb-2">
                  Collaborators Wanted
                </h3>

                <div className="space-y-4">
                  {project.openings?.map((opening) => (
                    <div key={opening.id} className="p-4 rounded-xl bg-black border border-white/5 space-y-3 relative overflow-hidden">
                      <div>
                        <h4 className="text-xs font-bold text-white leading-tight">{opening.role}</h4>
                        <div className="flex gap-4 text-[9px] font-mono text-zinc-500 mt-1.5">
                          <span>⏱️ {opening.commitment}</span>
                          <span>💎 {opening.equity}</span>
                        </div>
                      </div>

                      <button 
                        suppressHydrationWarning
                        onClick={() => {
                          if (!currentUser) {
                            router.push(`/signin?redirect=/projects/${projectId}`);
                          } else {
                            setApplyRole(opening.role);
                            setIsApplyModalOpen(true);
                          }
                        }}
                        className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-[9px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
                      >
                        Apply <Send size={9} />
                      </button>
                    </div>
                  ))}

                  {(!project.openings || project.openings.length === 0) && (
                    <p className="text-[11px] text-zinc-600 italic font-mono text-center py-4">No active openings found.</p>
                  )}
                </div>
              </div>

              {/* 2. Open Issues / Bounties */}
              <div className="bg-[#08080a] border border-white/5 rounded-2xl p-6 space-y-4 shadow-xl">
                <h3 className="text-[10px] font-mono font-bold text-white uppercase tracking-widest border-b border-white/5 pb-2">
                  Open Repository Issues
                </h3>

                <div className="space-y-3">
                  {project.issues?.map((issue) => {
                    const isClaimed = !!issue.claimedBy;
                    return (
                      <div key={issue.id} className="p-3.5 rounded-xl bg-black border border-white/5 space-y-2.5">
                        <div>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                            issue.difficulty === "Hard" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                            issue.difficulty === "Medium" ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" :
                            "bg-[#00FFA3]/10 text-[#00FFA3] border border-[#00FFA3]/20"
                          }`}>
                            {issue.difficulty}
                          </span>
                          <h4 className="text-[11px] font-bold text-white mt-2 leading-tight">{issue.title}</h4>
                        </div>

                        {isClaimed ? (
                          <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#00FFA3] bg-[#00FFA3]/5 border border-[#00FFA3]/10 p-2 rounded-lg justify-center select-none">
                            <Check size={11} /> Claimed by @{issue.claimedBy}
                          </div>
                        ) : (
                          <button 
                            suppressHydrationWarning
                            onClick={() => handleClaimIssue(issue.id)}
                            className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-[9px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-[0.98]"
                          >
                            Claim Issue
                          </button>
                        )}
                      </div>
                    );
                  })}

                  {(!project.issues || project.issues.length === 0) && (
                    <p className="text-[11px] text-zinc-600 italic font-mono text-center py-4">No open issues found.</p>
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>

      {/* ─── COLLABORATION APPLY MODAL ─── */}
      <AnimatePresence>
        {isApplyModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-[#09090b] border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-2xl space-y-6"
            >
              
              {/* Dynamic submit loader */}
              {isApplying && (
                <div className="absolute inset-0 bg-black/95 z-30 p-6 flex flex-col justify-center items-center text-center space-y-4">
                  <div className="w-10 h-10 rounded-full border-4 border-t-[#00F0FF] border-white/5 animate-spin mb-2" />
                  <div className="space-y-1">
                    <span className="block text-[10px] font-mono text-white tracking-widest uppercase animate-pulse">Broadcasting Pitch</span>
                    <span className="block text-[8px] text-zinc-500">Submitting credentials to lead node...</span>
                  </div>
                  
                  <div className="w-full bg-black border border-white/10 rounded-xl p-3 font-mono text-[8px] text-[#00F0FF] text-left min-h-[90px] flex flex-col justify-end overflow-hidden relative shadow-2xl">
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

              <div className="space-y-2 text-center">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white mx-auto shadow-inner">
                  <Award size={18} className="text-[#00F0FF]" />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">Collaboration Request</h3>
                <p className="text-[10px] text-zinc-500 font-mono">Role Signature: {applyRole}</p>
              </div>

              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Pitch Statement</label>
                  <textarea 
                    rows={4}
                    required
                    value={applyPitch}
                    onChange={(e) => setApplyPitch(e.target.value)}
                    placeholder="Why are you a fit for this role? Share your experience or project links..."
                    className="w-full p-3 rounded-xl border border-white/5 bg-zinc-900/50 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-[#00F0FF]/50 focus:bg-black transition-all resize-none"
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
                    className="flex-1 py-2.5 rounded-xl bg-[#00F0FF] text-black hover:bg-[#00F0FF]/90 transition-all text-xs font-bold cursor-pointer active:scale-[0.98]"
                  >
                    Broadcast application
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
