"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GitBranch, GitPullRequest, GitFork, Star, Plus, Code2, 
  Terminal, Search, Globe, ArrowUpRight, Cpu, Zap, Heart, ShieldAlert 
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SpotlightCard from "@/components/community/SpotlightCard";


interface OSRepo {
  id: string | number;
  name: string;
  tagline: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  issues: number;
  color: string;
  githubUrl: string;
}

const INITIAL_REPOS: OSRepo[] = [
  {
    id: 1,
    name: "Hyperion-CLI",
    tagline: "Next-gen zero-config node launcher and manager.",
    description: "Hyperion-CLI automates sandboxed microservice deployments with single-command configurations. It abstracts container isolation layers to speed up edge compilation runs.",
    language: "Rust",
    stars: 342,
    forks: 41,
    issues: 8,
    color: "#00F0FF",
    githubUrl: "https://github.com/devlinkhub/hyperion-cli"
  },
  {
    id: 2,
    name: "Hermes-State-Relayer",
    tagline: "Cryptographic rollup sequencer bridge transferring databases.",
    description: "Hermes-State-Relayer batches network transaction proof blocks to maintain consistent distributed cache architectures under low-bandwidth networks.",
    language: "Go",
    stars: 215,
    forks: 28,
    issues: 5,
    color: "#FF1CF7",
    githubUrl: "https://github.com/devlinkhub/hermes-state-relayer"
  },
  {
    id: 3,
    name: "Echo-Router",
    tagline: "Ultra-lightweight edge layout middleware.",
    description: "Echo-Router settles route routing requests under 2ms using cloudflare workers. It provides static HTML injection filters to resolve client hydration mismatches.",
    language: "TypeScript",
    stars: 489,
    forks: 67,
    issues: 12,
    color: "#00FFA3",
    githubUrl: "https://github.com/devlinkhub/echo-router"
  },
  {
    id: 4,
    name: "NeuroCore-Matrix",
    tagline: "CUDA-based tensor matrix algebra parser.",
    description: "NeuroCore-Matrix accelerates linear algebra operations inside distributed nodes. Optimizes neural network backpropagation equations with custom memory allocations.",
    language: "C++",
    stars: 620,
    forks: 112,
    issues: 19,
    color: "#7B61FF",
    githubUrl: "https://github.com/devlinkhub/neurocore-matrix"
  }
];

const CONTRIBUTOR_HANDLES = ["arivers", "zchen", "mvance", "svance", "davek", "jdoe", "coder9", "alice_w"];
const CONTRIB_ACTIONS = [
  "pushed 3 commits to master branch",
  "opened Pull Request #42: validation of security tokens",
  "merged Pull Request #38: resolving dependency warnings",
  "closed Issue #105: WASM memory buffer leaks",
  "submitted Code Review on echo-router config files",
  "starred repository"
];
const REPO_NAMES = ["Hyperion-CLI", "Hermes-State-Relayer", "Echo-Router", "NeuroCore-Matrix"];

export default function OpenSourcePage() {
  const [repos, setRepos] = useState<OSRepo[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLang, setSelectedLang] = useState("All");

  // Contribution Ledger live stream logs
  const [tickerLogs, setTickerLogs] = useState<string[]>([]);

  // Propose Repo Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [repoName, setRepoName] = useState("");
  const [repoTagline, setRepoTagline] = useState("");
  const [repoDesc, setRepoDesc] = useState("");
  const [repoLang, setRepoLang] = useState("Rust");
  const [repoColor, setRepoColor] = useState("#00F0FF");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitLogs, setSubmitLogs] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("devlinkhub_opensource_repos");
      if (stored) {
        setRepos(JSON.parse(stored));
      } else {
        setRepos(INITIAL_REPOS);
        localStorage.setItem("devlinkhub_opensource_repos", JSON.stringify(INITIAL_REPOS));
      }

      const storedUser = localStorage.getItem("devlinkhub_auth_user");
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    }

    // Populate initial ticker logs
    const initialLogs = Array.from({ length: 8 }).map(() => generateRandomLog());
    setTickerLogs(initialLogs);

    // Live ledger ticker interval
    const interval = setInterval(() => {
      setTickerLogs(prev => [generateRandomLog(), ...prev.slice(0, 15)]);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const generateRandomLog = () => {
    const handle = CONTRIBUTOR_HANDLES[Math.floor(Math.random() * CONTRIBUTOR_HANDLES.length)];
    const action = CONTRIB_ACTIONS[Math.floor(Math.random() * CONTRIB_ACTIONS.length)];
    const repo = REPO_NAMES[Math.floor(Math.random() * REPO_NAMES.length)];
    const timestamp = new Date().toLocaleTimeString();
    return `[${timestamp}] @${handle} ${action} inside ${repo}`;
  };

  const handleProposeClick = () => {
    if (!currentUser) {
      window.location.href = `/signin?redirect=${encodeURIComponent("/opensource")}`;
      return;
    }
    setIsModalOpen(true);
  };

  const handleSubmitRepo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoName || !repoTagline || !repoDesc) return;
    setIsSubmitting(true);

    const logs = [
      "Connecting to GitHub API metadata validator...",
      "Analyzing project architecture configuration...",
      "Verifying repository license nodes...",
      "Binding owner signature certificates...",
      "Broadcasting node mapping updates to ledger...",
      "Verification complete! Repository added to directory."
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < logs.length) {
        setSubmitLogs(prev => [...prev, `[INFO] ${logs[i]}`]);
        i++;
      } else {
        clearInterval(interval);

        const newRepo: OSRepo = {
          id: `repo-${Date.now()}`,
          name: repoName,
          tagline: repoTagline,
          description: repoDesc,
          language: repoLang,
          stars: 1,
          forks: 0,
          issues: 0,
          color: repoColor,
          githubUrl: `https://github.com/${currentUser?.username || "devlinkhub"}/${repoName.toLowerCase()}`
        };

        const updated = [...repos, newRepo];
        setRepos(updated);
        if (typeof window !== "undefined") {
          localStorage.setItem("devlinkhub_opensource_repos", JSON.stringify(updated));
        }

        setIsSubmitting(false);
        setIsModalOpen(false);
        setRepoName("");
        setRepoTagline("");
        setRepoDesc("");
        setSubmitLogs([]);
      }
    }, 300);
  };

  // Star increment simulator
  const handleStarRepo = (repoId: string | number) => {
    const updated = repos.map(r => {
      if (r.id === repoId) {
        return { ...r, stars: r.stars + 1 };
      }
      return r;
    });
    setRepos(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("devlinkhub_opensource_repos", JSON.stringify(updated));
    }
  };

  // Aggregate stats
  const totalReposCount = repos.length;
  const totalStarsCount = repos.reduce((acc, r) => acc + r.stars, 0);
  const totalForksCount = repos.reduce((acc, r) => acc + r.forks, 0);

  // Filters logic
  const filtered = repos.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLang = selectedLang === "All" || r.language === selectedLang;
    return matchesSearch && matchesLang;
  });

  return (
    <div className="relative min-h-screen bg-[#030303] text-zinc-100 font-sans selection:bg-[#00F0FF]/30 flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col relative pt-24 pb-20 z-10">
        
        {/* Glow vector shadows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] max-w-[1200px] h-[550px] bg-[#00F0FF]/[0.02] blur-[150px] rounded-full mix-blend-screen pointer-events-none" />

        <div className="max-w-[1300px] mx-auto w-full px-6 relative z-10 space-y-12">
          
          {/* Hero */}
          <div className="flex flex-col items-center text-center space-y-6 mt-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md">
              <Code2 size={14} className="text-[#00F0FF] animate-pulse" />
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#00F0FF] uppercase">Decentralized Hub</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-white leading-none">
              Open Source <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#7B61FF] to-[#FF1CF7]">
                Nodes index.
              </span>
            </h1>
            
            <p className="text-sm md:text-base text-zinc-400 max-w-xl mx-auto font-light leading-relaxed">
              Browse DevLinkHub core libraries and tool chains. Submit repositories, claim code bounties, or track contributions live on the ledger.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Active Repositories", value: totalReposCount, color: "#00F0FF" },
              { label: "Accumulated Stars", value: totalStarsCount, color: "#FF1CF7" },
              { label: "PR Rollups", value: totalForksCount, color: "#00FFA3" },
              { label: "Total Contributors", value: "148+", color: "#7B61FF" }
            ].map((st, idx) => (
              <div key={idx} className="bg-[#08080a] border border-white/5 p-4 rounded-xl shadow-xl flex flex-col justify-between min-h-[90px]">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">{st.label}</span>
                <span className="text-xl font-black text-white" style={{ color: st.color }}>{st.value}</span>
              </div>
            ))}
          </div>

          {/* Ledger & Actions layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2 Cols: Repos List */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Header actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl">
                <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide">
                  {["All", "Rust", "Go", "TypeScript", "C++"].map(lang => (
                    <button
                      suppressHydrationWarning
                      key={lang}
                      onClick={() => setSelectedLang(lang)}
                      className={`relative px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all duration-300 cursor-pointer ${
                        selectedLang === lang ? "text-white" : "text-zinc-500 hover:text-zinc-350"
                      }`}
                    >
                      {selectedLang === lang && (
                        <motion.div
                          layoutId="active-lang-pill"
                          className="absolute inset-0 bg-white/[0.08] border border-white/10 rounded-lg"
                        />
                      )}
                      <span className="relative z-10">{lang}</span>
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-52 shrink-0">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input 
                    type="text"
                    placeholder="Filter repositories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 pl-9 pr-4 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-[#00F0FF]/50"
                  />
                </div>
              </div>

              {/* Repos Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                  {filtered.map(repo => (
                    <motion.div
                      key={repo.id}
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      <SpotlightCard
                        accent={repo.color}
                        className="p-6 rounded-3xl bg-[#08080a]/60 border border-white/5 hover:border-white/10 flex flex-col justify-between h-full group relative min-h-[220px]"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-mono text-zinc-500">{repo.language}</span>
                            
                            <a 
                              href={repo.githubUrl} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
                            >
                              <ArrowUpRight size={14} />
                            </a>
                          </div>

                          <h3 className="text-sm font-bold text-white mb-2 group-hover:text-white transition-colors">
                            {repo.name}
                          </h3>

                          <p className="text-xs text-zinc-400 font-light leading-relaxed mb-6">
                            {repo.tagline}
                          </p>
                        </div>

                        {/* Specs bottom row */}
                        <div className="pt-4 border-t border-white/[0.04] mt-auto flex items-center justify-between">
                          <div className="flex gap-3 font-mono text-[9px] text-zinc-500">
                            <button 
                              suppressHydrationWarning
                              onClick={() => handleStarRepo(repo.id)}
                              className="flex items-center gap-1 hover:text-[#00F0FF] cursor-pointer"
                            >
                              <Star size={11} className="text-zinc-500 group-hover:text-[#00F0FF]" /> {repo.stars}
                            </button>
                            <span className="flex items-center gap-1">
                              <GitFork size={11} /> {repo.forks}
                            </span>
                          </div>

                          <Link 
                            href={`/projects/open-issues?search=${repo.name}`}
                            className="px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 text-zinc-400 hover:text-white font-mono text-[9px] font-bold transition-all bg-white/5 active:scale-[0.98]"
                          >
                            Bounties: {repo.issues}
                          </Link>
                        </div>
                      </SpotlightCard>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {filtered.length === 0 && (
                <div className="py-20 text-center border border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
                  <ShieldAlert size={26} className="text-zinc-650 mb-2 mx-auto animate-pulse" />
                  <p className="text-xs text-zinc-500">No open source libraries match current configurations.</p>
                </div>
              )}

            </div>

            {/* Right 1 Col: Contribution Ledger & Register Actions */}
            <div className="space-y-6">
              
              {/* Propose repo card */}
              <div className="bg-[#08080a] border border-white/5 rounded-3xl p-6 relative overflow-hidden group shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
                <h3 className="text-sm font-bold text-white mb-1">Host Library on DevLinkHub</h3>
                <p className="text-[11px] text-zinc-500 font-light mb-6">Register your open-source directory to enable star voting and issue bounties.</p>
                
                <button
                  suppressHydrationWarning
                  onClick={handleProposeClick}
                  className="w-full py-2.5 rounded-xl text-xs font-mono font-bold bg-[#00F0FF] text-black hover:bg-[#00F0FF]/90 transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.25)] flex items-center justify-center gap-2 cursor-pointer border-none"
                >
                  <Plus size={13} /> Add Repository
                </button>
              </div>

              {/* Ticker Ledger terminal */}
              <div className="bg-black border border-white/10 rounded-3xl p-6 space-y-4 shadow-2xl min-h-[350px] flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <Terminal size={14} className="text-[#00F0FF] animate-pulse" />
                    <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase">Contribution Ledger</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-[#00FFA3] animate-pulse" />
                </div>

                <div className="flex-1 font-mono text-[9px] text-[#00F0FF] space-y-2 overflow-y-auto max-h-[250px] scrollbar-hide py-2 flex flex-col-reverse justify-end">
                  <AnimatePresence mode="popLayout">
                    {tickerLogs.map((log, idx) => (
                      <motion.div
                        key={`${idx}-${log.slice(0, 10)}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.25 }}
                        className="truncate py-0.5"
                      >
                        {log}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="text-[8px] font-mono text-zinc-600 border-t border-white/5 pt-2 flex items-center justify-between">
                  <span>LEDGER_STREAM_NODE_ACTIVE</span>
                  <span>SYNC_ESTABLISHED</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>

      {/* ─── REGISTER OS REPO MODAL ─── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-[#09090b] border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl space-y-6"
            >
              
              {/* Submit loading */}
              {isSubmitting && (
                <div className="absolute inset-0 bg-black/98 z-40 p-6 flex flex-col justify-center items-center text-center space-y-4">
                  <div className="w-10 h-10 rounded-full border-4 border-t-[#00F0FF] border-white/5 animate-spin mb-2" />
                  <div className="space-y-1">
                    <span className="block text-[10px] font-mono text-white tracking-widest uppercase animate-pulse">Mapping Repository</span>
                    <span className="block text-[8px] text-zinc-500">Broadcasting node configuration...</span>
                  </div>
                  
                  <div className="w-full bg-black border border-white/10 rounded-xl p-3 font-mono text-[8px] text-[#00F0FF] text-left min-h-[100px] flex flex-col justify-end overflow-hidden relative shadow-2xl">
                    <div className="absolute inset-0 bg-[#00F0FF]/5 pointer-events-none" />
                    <div className="flex flex-col gap-0.5 overflow-y-auto">
                      {submitLogs.map((log, idx) => (
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
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors cursor-pointer bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-[10px] font-mono"
              >
                [Cancel]
              </button>

              <div className="text-center space-y-2">
                <Code2 size={20} className="text-[#00F0FF] mx-auto animate-pulse" />
                <h3 className="text-lg font-bold text-white tracking-tight">Host Open Source Node</h3>
                <p className="text-[10px] text-zinc-500 font-mono">Submit your repository metadata for decentralized registration</p>
              </div>

              <form onSubmit={handleSubmitRepo} className="space-y-4">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-zinc-500">Repository Name</label>
                    <input 
                      type="text"
                      required
                      value={repoName}
                      onChange={(e) => setRepoName(e.target.value)}
                      placeholder="e.g. echo-router"
                      className="w-full h-10 px-3 rounded-lg border border-white/5 bg-zinc-900/50 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-[#00F0FF]/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-zinc-500">Primary Language</label>
                    <select 
                      value={repoLang}
                      onChange={(e) => setRepoLang(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-white/5 bg-zinc-900/50 text-xs text-zinc-300 focus:outline-none focus:border-[#00F0FF]/50 cursor-pointer focus:bg-black"
                    >
                      {["Rust", "Go", "TypeScript", "C++", "Python"].map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-zinc-500">Short Tagline</label>
                  <input 
                    type="text"
                    required
                    value={repoTagline}
                    onChange={(e) => setRepoTagline(e.target.value)}
                    placeholder="e.g. Ultra-lightweight edge layout middleware."
                    className="w-full h-10 px-3 rounded-lg border border-white/5 bg-zinc-900/50 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-[#00F0FF]/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-zinc-500">Detailed Scope Description</label>
                  <textarea 
                    rows={3}
                    required
                    value={repoDesc}
                    onChange={(e) => setRepoDesc(e.target.value)}
                    placeholder="Outline features, configuration variables, and developer workflow objectives..."
                    className="w-full p-3 rounded-lg border border-white/5 bg-zinc-900/50 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-[#00F0FF]/50 resize-none"
                  />
                </div>

                {/* Theme selector */}
                <div className="space-y-2">
                  <label className="text-[9px] font-mono text-zinc-500">Log Accent Color</label>
                  <div className="flex gap-3">
                    {["#00F0FF", "#FF1CF7", "#00FFA3", "#7B61FF", "#FFB000"].map(c => {
                      const active = repoColor === c;
                      return (
                        <button
                          suppressHydrationWarning
                          key={c}
                          type="button"
                          onClick={() => setRepoColor(c)}
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

                <button
                  suppressHydrationWarning
                  type="submit"
                  className="w-full h-11 rounded-xl bg-[#00F0FF] text-black font-extrabold text-xs hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-1 cursor-pointer mt-6 font-mono uppercase tracking-wider border-none"
                >
                  Commit Repository Node
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
