"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Search, Calendar, Inbox, ChevronRight, 
  Trash2, Filter, AlertCircle, RefreshCw, Layers, CheckCircle2, Clock
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SpotlightCard from "@/components/community/SpotlightCard";
import { getInquiries, Inquiry, clearAllInquiries, saveInquiriesList } from "@/utils/inquiriesData";
import { useAuth } from "@/context/AuthContext";

const CATEGORY_COLORS: Record<string, string> = {
  PARTNERSHIPS: "#00F0FF",
  SPONSORSHIPS: "#7B61FF",
  COLLABORATIONS: "#FF1CF7",
  SUPPORT: "#00FFA3",
  EVENTS: "#F59E0B",
  "GENERAL INQUIRY": "#B4BCD0"
};

export default function InquiriesDashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const { localUser, loading } = useAuth();

  // Load inquiries on mount
  useEffect(() => {
    setMounted(true);
    const loadData = async () => {
      const data = await getInquiries();
      setInquiries(data);
    };
    loadData();
  }, []);

  const isAdmin = !loading && localUser?.role === "Administrator";

  const handleRefresh = async () => {
    const data = await getInquiries();
    setInquiries(data);
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to purge all inquiries telemetry data? This cannot be undone.")) {
      clearAllInquiries();
      setInquiries([]);
    }
  };



  // Filter & Sort Logic
  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch = 
      inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inq.organization && inq.organization.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = 
      selectedCategory === "ALL" || 
      inq.category.toUpperCase() === selectedCategory.toUpperCase();

    const matchesStatus = 
      selectedStatus === "ALL" || 
      inq.status.toUpperCase() === selectedStatus.toUpperCase();

    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === "newest") return b.timestamp - a.timestamp;
    return a.timestamp - b.timestamp;
  });

  // Calculate statistics
  const totalCount = inquiries.length;
  const newCount = inquiries.filter(i => i.status === "New").length;
  const inProgressCount = inquiries.filter(i => i.status === "In Progress").length;
  const resolvedCount = inquiries.filter(i => i.status === "Resolved").length;

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono text-xs">
        Booting Inquiries System Telemetry...
      </div>
    );
  }

  if (mounted && !isAdmin) {
    return (
      <div className="relative min-h-screen bg-[#030303] text-zinc-100 font-sans flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-24 pb-20 px-6 z-10 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-red-500/[0.04] blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[#08080a] border border-red-500/10 rounded-3xl p-8 text-center space-y-6 shadow-2xl relative"
          >
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
            
            <div className="w-16 h-16 rounded-2xl bg-red-500/5 border border-red-500/20 flex items-center justify-center text-red-500 mx-auto shadow-inner">
              <AlertCircle size={28} className="animate-pulse" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest block">Firewall Shield Active</span>
              <h2 className="text-xl font-bold text-white tracking-tight">Access Restricted</h2>
              <p className="text-xs text-zinc-500 leading-relaxed font-light">
                This terminal is cataloged under secure coordinator operations. Administrator Firebase credentials are required to access the communications telemetry matrix.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <Link 
                href="/signin"
                className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-mono text-xs font-bold transition-all cursor-pointer shadow-[0_4px_20px_rgba(239,68,68,0.15)] active:scale-98 text-center"
              >
                [ SIGN IN AS ADMINISTRATOR ]
              </Link>
              
              <Link 
                href="/contact"
                className="w-full py-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-1.5 active:scale-98"
              >
                <ArrowLeft size={13} /> Return to Contact Page
              </Link>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#030303] text-zinc-100 font-sans selection:bg-[#00F0FF]/30 flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col relative pt-24 pb-20 z-10">
        
        {/* Background glow ambient lights */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-[#7B61FF]/[0.03] blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[300px] bg-[#00F0FF]/[0.03] blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-[1300px] mx-auto w-full px-6 relative z-10 space-y-8 flex-1 flex flex-col">
          
          {/* Breadcrumbs */}
          <div className="flex items-center justify-between mt-8">
            <Link 
              href="/contact" 
              className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors font-mono text-xs cursor-pointer bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md"
            >
              <ArrowLeft size={13} /> Return to Contact Page
            </Link>
            <div className="text-zinc-500 font-mono text-[10px]">
              DEVLINK // SUPPORT // TELEMETRY_MATRIX
            </div>
          </div>

          {/* Title header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold text-white tracking-tight">Inquiries Management</h1>
              <p className="text-sm text-zinc-400 font-light max-w-xl">
                Browse and triage communication packets transmitted via the DevLink contact terminal.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={handleRefresh}
                className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-mono text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <RefreshCw size={13} /> Refresh Log
              </button>
              <button 
                onClick={handleClearAll}
                disabled={inquiries.length === 0}
                className="px-4 py-2.5 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 disabled:opacity-30 disabled:pointer-events-none font-mono text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Trash2 size={13} /> Purge Database
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Recieved", val: totalCount, icon: Layers, color: "#B4BCD0" },
              { label: "New Packet", val: newCount, icon: Inbox, color: "#00F0FF" },
              { label: "Triage Progress", val: inProgressCount, icon: Clock, color: "#F59E0B" },
              { label: "Resolved Nodes", val: resolvedCount, icon: CheckCircle2, color: "#00FFA3" }
            ].map((stat, i) => (
              <SpotlightCard key={i} accent={stat.color} className="p-5 flex items-center gap-4">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center border"
                  style={{ borderColor: `${stat.color}15`, backgroundColor: `${stat.color}05` }}
                >
                  <stat.icon size={18} style={{ color: stat.color }} />
                </div>
                <div>
                  <span className="block text-[9px] font-mono text-zinc-500 uppercase tracking-wider">{stat.label}</span>
                  <span className="text-xl font-bold text-white font-mono">{stat.val}</span>
                </div>
              </SpotlightCard>
            ))}
          </div>

          {/* Filters Section */}
          <div className="bg-[#08080a] border border-white/5 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* Search */}
              <div className="lg:col-span-6 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search inquiries by sender, email, subject or message..."
                  className="w-full h-11 bg-black border border-white/10 rounded-xl pl-11 pr-4 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/20 transition-colors"
                />
              </div>

              {/* Status Select */}
              <div className="lg:col-span-3">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full h-11 bg-black border border-white/10 rounded-xl px-4 text-xs text-zinc-400 focus:outline-none focus:border-white/20 transition-colors"
                >
                  <option value="ALL">Status: All Packets</option>
                  <option value="NEW">Status: New</option>
                  <option value="IN PROGRESS">Status: In Progress</option>
                  <option value="RESOLVED">Status: Resolved</option>
                </select>
              </div>

              {/* Sort Select */}
              <div className="lg:col-span-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
                  className="w-full h-11 bg-black border border-white/10 rounded-xl px-4 text-xs text-zinc-400 focus:outline-none focus:border-white/20 transition-colors"
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="oldest">Sort: Oldest First</option>
                </select>
              </div>

            </div>

            {/* Category selection bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-1.5 mr-2">
                <Filter size={11} /> Categories:
              </span>
              {["ALL", "GENERAL INQUIRY", "PARTNERSHIPS", "SPONSORSHIPS", "COLLABORATIONS", "SUPPORT", "EVENTS"].map(cat => {
                const isActive = selectedCategory.toUpperCase() === cat.toUpperCase();
                const color = CATEGORY_COLORS[cat] || "#FFFFFF";
                
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg font-mono text-[9px] font-bold border transition-all cursor-pointer whitespace-nowrap ${
                      isActive 
                        ? "text-black border-transparent" 
                        : "text-zinc-500 border-white/5 hover:border-white/10 hover:text-zinc-300"
                    }`}
                    style={{
                      backgroundColor: isActive ? color : "transparent",
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Inquiries Grid List */}
          <div className="flex-1 min-h-[300px]">
            <AnimatePresence mode="wait">
              {filteredInquiries.length > 0 ? (
                <motion.div 
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {filteredInquiries.map((inq) => {
                    const categoryColor = CATEGORY_COLORS[inq.category.toUpperCase()] || "#B4BCD0";
                    const formattedDate = new Date(inq.timestamp).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric"
                    });

                    return (
                      <Link 
                        key={inq.id} 
                        href={`/contact/inquiries/${inq.id}`}
                        className="block group"
                      >
                        <SpotlightCard 
                          accent={categoryColor} 
                          className="p-6 h-full flex flex-col justify-between hover:border-white/20 transition-all"
                        >
                          <div className="space-y-4">
                            
                            {/* Card Header Info */}
                            <div className="flex items-start justify-between gap-4">
                              <span 
                                className="px-2 py-0.5 rounded font-mono text-[8px] font-bold tracking-wider uppercase border"
                                style={{ 
                                  color: categoryColor, 
                                  borderColor: `${categoryColor}25`, 
                                  backgroundColor: `${categoryColor}05` 
                                }}
                              >
                                {inq.category}
                              </span>

                              <span className={`px-2 py-0.5 rounded font-mono text-[8px] font-bold tracking-wider uppercase ${
                                inq.status === "New" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" :
                                inq.status === "In Progress" ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" :
                                "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              }`}>
                                {inq.status}
                              </span>
                            </div>

                            {/* Subject & Description */}
                            <div className="space-y-1.5">
                              <h3 className="text-base font-bold text-white group-hover:text-[#00F0FF] transition-colors line-clamp-1">
                                {inq.subject}
                              </h3>
                              <p className="text-xs text-zinc-400 font-light leading-relaxed line-clamp-2">
                                {inq.message}
                              </p>
                            </div>

                          </div>

                          {/* Footer Details */}
                          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between gap-4 text-[10px] text-zinc-500 font-mono">
                            <div className="space-y-0.5">
                              <span className="block text-white font-medium">{inq.name}</span>
                              <span className="block text-[9px] truncate max-w-[150px] sm:max-w-[200px]">{inq.email}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-right shrink-0">
                              <span className="flex items-center gap-1">
                                <Calendar size={10} /> {formattedDate}
                              </span>
                              <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform text-zinc-400" />
                            </div>
                          </div>
                        </SpotlightCard>
                      </Link>
                    );
                  })}
                </motion.div>
              ) : (
                // Empty state
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center py-20 text-center space-y-4 border border-dashed border-white/10 rounded-3xl bg-[#050507]"
                >
                  <AlertCircle size={32} className="text-zinc-600 animate-bounce" />
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white">No inquiries matching filter parameters</h3>
                    <p className="text-xs text-zinc-500 max-w-sm">
                      Check your search query, change filter criteria, or transmit a new inquiry from the contact terminal page.
                    </p>
                  </div>
                  <Link 
                    href="/contact" 
                    className="mt-2 text-xs text-[#00F0FF] hover:underline font-mono"
                  >
                    [ Go submit a test inquiry ]
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
