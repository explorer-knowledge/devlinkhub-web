"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Calendar, Mail, Building2, ShieldAlert, 
  Trash2, Send, CheckCircle2, AlertCircle, Clock, Info, User, Reply
} from "lucide-react";
import SpotlightCard from "@/components/community/SpotlightCard";
import { 
  getInquiryById, 
  updateInquiryStatus, 
  addInquiryReply, 
  deleteInquiry, 
  Inquiry 
} from "@/utils/inquiriesData";

const CATEGORY_COLORS: Record<string, string> = {
  PARTNERSHIPS: "#00F0FF",
  SPONSORSHIPS: "#7B61FF",
  COLLABORATIONS: "#FF1CF7",
  SUPPORT: "#00FFA3",
  EVENTS: "#F59E0B",
  "GENERAL INQUIRY": "#B4BCD0"
};

export default function InquiryDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);
  
  // State for form reply
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [mounted, setMounted] = useState(false);

  // Load inquiry details
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      // Look for devlinkhub auth user
      const authUser = localStorage.getItem("devlinkhub_auth_user");
      if (authUser) {
        try {
          setCurrentUser(JSON.parse(authUser));
        } catch (e) {
          console.error(e);
        }
      }

      const loadData = async () => {
        const match = await getInquiryById(id);
        if (match) {
          setInquiry(match);
        }
        setLoading(false);
      };
      loadData();
    }
  }, [id]);

  const isAdmin = currentUser && (
    currentUser.username === "admin" || 
    currentUser.isAdmin === true || 
    currentUser.email === "admin@devlinkhub.dev"
  );

  const handleSimulateAdminLogin = () => {
    const adminPayload = {
      name: "Admin Coordinator",
      username: "admin",
      email: "admin@devlinkhub.dev",
      isAdmin: true
    };
    localStorage.setItem("devlinkhub_auth_user", JSON.stringify(adminPayload));
    setCurrentUser(adminPayload);
  };

  // Handle status update
  const handleStatusChange = async (newStatus: Inquiry["status"]) => {
    if (!inquiry) return;
    const updated = await updateInquiryStatus(inquiry.id, newStatus);
    if (updated) {
      setInquiry(updated);
    }
  };

  // Handle posting reply
  const handlePostReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !inquiry) return;

    setReplying(true);
    try {
      const senderName = currentUser 
        ? `@${currentUser.username} (Staff)` 
        : "DevLinkHub Core Node";

      const updated = await addInquiryReply(inquiry.id, senderName, replyText.trim());
      if (updated) {
        setInquiry(updated);
        setReplyText("");
      }
    } catch (err) {
      console.error("Failed to post reply:", err);
    } finally {
      setReplying(false);
    }
  };

  // Handle deletion
  const handleDelete = async () => {
    if (!inquiry) return;
    if (confirm("Are you sure you want to permanently delete this inquiry record? This action is irreversible.")) {
      const success = await deleteInquiry(inquiry.id);
      if (success) {
        router.push("/contact/inquiries");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono text-xs">
        Connecting core telemetry nodes...
      </div>
    );
  }

  if (mounted && !isAdmin) {
    return (
      <div className="relative min-h-screen bg-[#030303] text-zinc-100 font-sans flex flex-col">
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
                This terminal is cataloged under secure coordinator operations. Standard builder nodes are not authorized to view the communications telemetry matrix.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button 
                onClick={handleSimulateAdminLogin}
                className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-mono text-xs font-bold transition-all cursor-pointer shadow-[0_4px_20px_rgba(239,68,68,0.15)] active:scale-98 border-none"
              >
                [ ELEVATE SESSION TO ADMIN ]
              </button>
              
              <Link 
                href="/contact"
                className="w-full py-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-1.5 active:scale-98"
              >
                <ArrowLeft size={13} /> Return to Contact Page
              </Link>
            </div>
          </motion.div>
        </main>
        </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="min-h-screen bg-black text-zinc-300 flex flex-col justify-center items-center px-4 text-center">
        <ShieldAlert size={40} className="text-[#FF1CF7] mb-4 animate-bounce" />
        <h2 className="text-xl font-bold text-white mb-2">Inquiry Telemetry Node Unresolved</h2>
        <p className="text-xs text-zinc-500 max-w-sm mb-6 leading-relaxed">
          The requested inquiry transmission identifier does not match any registered packages in the local telemetry storage.
        </p>
        <Link 
          href="/contact/inquiries" 
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors font-mono text-xs cursor-pointer bg-white/5 border border-white/10 px-5 py-2.5 rounded-full"
        >
          <ArrowLeft size={13} /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const categoryColor = CATEGORY_COLORS[inquiry.category.toUpperCase()] || "#B4BCD0";
  const formattedDate = new Date(inquiry.timestamp).toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <div className="relative min-h-screen bg-[#030303] text-zinc-100 font-sans selection:bg-[#00F0FF]/30 flex flex-col">
      <main className="flex-1 flex flex-col relative pt-24 pb-20 z-10">
        
        {/* Glow behind layout */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[90vw] max-w-[1000px] h-[350px] blur-[150px] rounded-full opacity-[0.05] pointer-events-none mix-blend-screen"
          style={{ backgroundColor: categoryColor }}
        />

        <div className="max-w-[1200px] mx-auto w-full px-6 relative z-10 space-y-8">
          
          {/* Top navigation actions */}
          <div className="flex items-center justify-between mt-8">
            <Link 
              href="/contact/inquiries" 
              className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors font-mono text-xs cursor-pointer bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md"
            >
              <ArrowLeft size={13} /> Back to Dashboard
            </Link>
            <button 
              onClick={handleDelete}
              className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors font-mono text-xs cursor-pointer bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 px-4 py-2 rounded-full backdrop-blur-md"
            >
              <Trash2 size={13} /> Delete inquiry
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ─── LEFT COLUMN: TELEMETRY SIDEBAR ─── */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#08080a] border border-white/5 rounded-2xl p-6 space-y-6 shadow-xl relative overflow-hidden">
                
                {/* Visual Category Block */}
                <div className="space-y-4">
                  <span 
                    className="inline-block px-3 py-1 rounded-full font-mono text-[9px] font-bold tracking-widest uppercase border"
                    style={{ 
                      color: categoryColor, 
                      borderColor: `${categoryColor}25`, 
                      backgroundColor: `${categoryColor}05` 
                    }}
                  >
                    {inquiry.category}
                  </span>

                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight leading-tight">{inquiry.subject}</h2>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mt-2">
                      Inquiry ID: <span className="text-zinc-400 font-mono">{inquiry.id}</span>
                    </span>
                  </div>
                </div>

                <hr className="border-white/5" />

                {/* Status Triage Controls */}
                <div className="space-y-3">
                  <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest pl-1">
                    Telemetry Status
                  </span>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {(["New", "In Progress", "Resolved"] as Inquiry["status"][]).map((st) => {
                      const isActive = inquiry.status === st;
                      const activeColor = 
                        st === "New" ? "#00F0FF" : 
                        st === "In Progress" ? "#F59E0B" : 
                        "#00FFA3";

                      return (
                        <button
                          key={st}
                          onClick={() => handleStatusChange(st)}
                          className={`py-2 rounded-xl text-[10px] font-mono font-bold transition-all border cursor-pointer active:scale-95 text-center ${
                            isActive
                              ? "text-black border-transparent"
                              : "text-zinc-500 border-white/5 hover:border-white/10 hover:text-zinc-300 bg-transparent"
                          }`}
                          style={{
                            backgroundColor: isActive ? activeColor : "transparent",
                            boxShadow: isActive ? `0 0 15px ${activeColor}30` : "none"
                          }}
                        >
                          {st}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <hr className="border-white/5" />

                {/* Sender Details */}
                <div className="space-y-4">
                  <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest pl-1">
                    Sender Credentials
                  </span>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-black border border-white/5">
                      <User size={14} className="text-zinc-500" />
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono text-zinc-500 block uppercase">Name</span>
                        <span className="font-semibold text-white">{inquiry.name}</span>
                      </div>
                    </div>

                    <a 
                      href={`mailto:${inquiry.email}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-black border border-white/5 hover:border-white/20 transition-all group block"
                    >
                      <Mail size={14} className="text-zinc-500 group-hover:text-[#00F0FF] transition-colors" />
                      <div className="space-y-0.5 overflow-hidden">
                        <span className="text-[10px] font-mono text-zinc-500 block uppercase">Email</span>
                        <span className="font-semibold text-white group-hover:text-[#00F0FF] transition-colors truncate block">
                          {inquiry.email}
                        </span>
                      </div>
                    </a>

                    {inquiry.organization && (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-black border border-white/5">
                        <Building2 size={14} className="text-zinc-500" />
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-mono text-zinc-500 block uppercase">Organization</span>
                          <span className="font-semibold text-white">{inquiry.organization}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-black border border-white/5">
                      <Calendar size={14} className="text-zinc-500" />
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono text-zinc-500 block uppercase">Timestamp</span>
                        <span className="font-semibold text-white">{formattedDate}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* ─── RIGHT COLUMN: CONTENT & DISCUSSION ─── */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Inquiry Main Message */}
              <div className="bg-[#08080a] border border-white/5 rounded-3xl p-8 space-y-6 shadow-xl relative overflow-hidden">
                <div className="border-b border-white/5 pb-4 flex justify-between items-center">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Info size={12} className="text-[#00F0FF]" /> Decrypted Transmission Packet
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[9px] font-mono text-zinc-600">SECURE SHELL</span>
                  </div>
                </div>

                <div className="relative p-6 rounded-2xl bg-black/60 border border-white/5 font-light text-zinc-300 leading-relaxed text-sm whitespace-pre-wrap min-h-[150px]">
                  {inquiry.message}
                </div>
              </div>

              {/* Triage Replies Log */}
              <div className="bg-[#08080a] border border-white/5 rounded-3xl p-8 space-y-6 shadow-xl">
                
                <div className="border-b border-white/5 pb-4">
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <Reply size={13} className="text-[#7B61FF]" /> Correspondence Response Log
                  </h3>
                </div>

                {/* Reply list entries */}
                <div className="space-y-4">
                  {inquiry.replies.length > 0 ? (
                    inquiry.replies.map((rep) => {
                      const repDate = new Date(rep.timestamp).toLocaleString("en-US", {
                        month: "short",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit"
                      });

                      const isSystem = rep.sender.includes("Core") || rep.sender.includes("System") || rep.sender.includes("Staff");

                      return (
                        <div 
                          key={rep.id} 
                          className={`p-4 rounded-2xl border flex flex-col gap-2 max-w-[85%] ${
                            isSystem 
                              ? "bg-[#090b14]/50 border-[#00F0FF]/15 text-zinc-300 ml-auto" 
                              : "bg-[#050505] border-white/5 text-zinc-300 mr-auto"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-6 text-[9px] font-mono">
                            <span className={isSystem ? "text-[#00F0FF] font-bold" : "text-zinc-500 font-bold"}>
                              {rep.sender}
                            </span>
                            <span className="text-zinc-600 font-light">{repDate}</span>
                          </div>
                          <p className="text-xs font-light leading-relaxed whitespace-pre-wrap">{rep.text}</p>
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-8 text-center border border-dashed border-white/5 rounded-2xl bg-black/30">
                      <p className="text-xs text-zinc-600 font-mono italic">No communication history logged on this channel.</p>
                    </div>
                  )}
                </div>

                {/* Reply Form */}
                <form onSubmit={handlePostReply} className="space-y-3 pt-4 border-t border-white/5">
                  <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">
                    Queue outgoing reply
                  </label>
                  
                  <div className="relative">
                    <textarea
                      required
                      rows={3}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type response to coordinate with this inquiry node..."
                      className="w-full p-4 pr-12 rounded-2xl border border-white/10 bg-black text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-[#7B61FF]/50 transition-all resize-none"
                    />
                    
                    <button
                      type="submit"
                      disabled={replying || !replyText.trim()}
                      className="absolute right-4 bottom-4 w-9 h-9 rounded-xl bg-white text-black hover:scale-105 disabled:opacity-30 disabled:pointer-events-none active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-lg"
                    >
                      {replying ? (
                        <div className="w-3.5 h-3.5 border-2 border-t-transparent border-black rounded-full animate-spin" />
                      ) : (
                        <Send size={13} />
                      )}
                    </button>
                  </div>
                </form>

              </div>

            </div>

          </div>

        </div>
      </main>

      </div>
  );
}
