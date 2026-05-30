"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, TerminalSquare, Star, GitFork, Users, ExternalLink, 
  Search, ShieldAlert, Award, FileCode, Check, AlertCircle, AlertTriangle 
} from "lucide-react";
import Link from "next/link";
import SpotlightCard from "@/components/community/SpotlightCard";
import { getMergedProjects, saveProjects, Project, ProjectIssue } from "@/utils/projectsData";

export default function OpenIssuesPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Filters
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      getMergedProjects().then(setProjects);
      const stored = localStorage.getItem("devlinkhub_auth_user");
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    }
  }, []);

  // Extract all issues
  const allIssues: Array<{ project: Project; issue: ProjectIssue }> = [];
  projects.forEach(p => {
    p.issues?.forEach(i => {
      allIssues.push({ project: p, issue: i });
    });
  });

  // Filter issues
  const filteredIssues = allIssues.filter(item => {
    const matchesSearch = item.issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.issue.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDifficulty = selectedDifficulty === "All" || item.issue.difficulty === selectedDifficulty;

    return matchesSearch && matchesDifficulty;
  });

  // Claim issue logic
  const handleClaimIssue = (projectId: string | number, issueId: string) => {
    if (!currentUser) {
      router.push(`/signin?redirect=/projects/open-issues`);
      return;
    }

    const updatedProjects = projects.map(p => {
      if (String(p.id) === String(projectId)) {
        const updatedIssues = p.issues?.map(issue => {
          if (issue.id === issueId) {
            return { ...issue, claimedBy: currentUser.username };
          }
          return issue;
        }) || [];
        return { ...p, issues: updatedIssues };
      }
      return p;
    });

    setProjects(updatedProjects);
    saveProjects(updatedProjects);
  };

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
              SYSTEM_CORE // ISSUES_NODE_ACTIVE
            </div>
          </div>

          {/* Page Intro */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              Open Repo <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7B61FF] via-[#FF1CF7] to-[#00F0FF]">Issues</span>
            </h1>
            <p className="text-zinc-400 text-sm font-light max-w-xl">
              Audit and claim pending repository tickets across registered startup nodes. Claiming an issue flags it under your username.
            </p>
          </div>

          {/* Filtering controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-2 rounded-2xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl">
            
            {/* Difficulty tabs */}
            <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
              {[
                { id: "All", label: "All Difficulties" },
                { id: "Easy", label: "Easy Tickets" },
                { id: "Medium", label: "Medium Scope" },
                { id: "Hard", label: "Hard Architect" }
              ].map(c => (
                <button
                  suppressHydrationWarning
                  key={c.id}
                  onClick={() => setSelectedDifficulty(c.id)}
                  className={`relative px-4 py-2.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all duration-300 cursor-pointer ${
                    selectedDifficulty === c.id 
                      ? "text-white" 
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]"
                  }`}
                >
                  {selectedDifficulty === c.id && (
                    <motion.div
                      layoutId="active-pill-diff"
                      className="absolute inset-0 bg-white/[0.08] border border-white/10 rounded-xl"
                    />
                  )}
                  <span className="relative z-10">{c.label}</span>
                </button>
              ))}
            </div>

            {/* Keyword Search */}
            <div className="relative w-full md:w-64 shrink-0">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input 
                type="text"
                placeholder="Search ticket names, tech..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-black border border-white/10 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-[#7B61FF]/50 transition-all"
              />
            </div>

          </div>

          {/* Issues list Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredIssues.map(({ project, issue }) => {
                const isClaimed = !!issue.claimedBy;
                return (
                  <motion.div
                    key={`${project.id}-${issue.id}`}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                  >
                    <SpotlightCard
                      accent={project.color}
                      className="p-6 rounded-3xl bg-[#08080A]/60 border border-white/5 hover:border-white/10 hover:bg-zinc-950/40 transition-all duration-300 flex flex-col justify-between h-full min-h-[220px] group relative overflow-hidden"
                    >
                      <div>
                        {/* Top info row */}
                        <div className="flex items-start justify-between mb-4 w-full">
                          <div className="flex items-center gap-2">
                            <TerminalSquare size={14} style={{ color: project.color }} />
                            <Link href={`/projects/${project.id}`} className="text-xs font-mono font-bold text-zinc-400 hover:text-white transition-colors">
                              {project.name}
                            </Link>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                            issue.difficulty === "Hard" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                            issue.difficulty === "Medium" ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" :
                            "bg-[#00FFA3]/10 text-[#00FFA3] border border-[#00FFA3]/20"
                          }`}>
                            {issue.difficulty}
                          </span>
                        </div>

                        {/* Title of ticket */}
                        <h3 className="text-sm font-bold text-white mb-3 group-hover:text-[#7B61FF] transition-colors leading-snug">
                          {issue.title}
                        </h3>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-6">
                          {issue.tags.map(t => (
                            <span key={t} className="px-2 py-0.5 rounded bg-white/[0.02] border border-white/[0.05] text-[9px] font-mono text-zinc-500">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Footer actions */}
                      <div className="pt-4 border-t border-white/[0.04] mt-auto flex items-center justify-between gap-4 w-full">
                        {isClaimed ? (
                          <div className="w-full flex items-center gap-1.5 text-[9px] font-mono text-[#00FFA3] bg-[#00FFA3]/5 border border-[#00FFA3]/10 py-2 px-3 rounded-lg justify-center select-none">
                            <Check size={11} /> Claimed by @{issue.claimedBy}
                          </div>
                        ) : (
                          <>
                            <Link 
                              href={`/projects/${project.id}`}
                              className="px-3.5 py-2 rounded-lg border border-white/10 hover:border-white/20 text-zinc-400 hover:text-white font-mono text-[9px] font-bold transition-all bg-white/5 active:scale-[0.98]"
                            >
                              Details
                            </Link>
                            
                            <button 
                              suppressHydrationWarning
                              onClick={() => handleClaimIssue(project.id, issue.id)}
                              className="flex-1 py-2 rounded-lg bg-[#7B61FF] text-white font-mono text-[9px] font-bold flex items-center justify-center gap-1 transition-all hover:shadow-[0_0_12px_rgba(123,97,255,0.2)] hover:scale-[1.01] active:scale-[0.98] cursor-pointer border-none"
                            >
                              Claim Issue
                            </button>
                          </>
                        )}
                      </div>

                    </SpotlightCard>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {filteredIssues.length === 0 && (
            <div className="py-24 text-center border border-dashed border-white/5 rounded-[2rem] bg-white/[0.01]">
              <AlertTriangle size={28} className="text-zinc-600 mb-2 mx-auto animate-pulse" />
              <p className="text-xs text-zinc-500">No open issue tickets match selected filters.</p>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}
