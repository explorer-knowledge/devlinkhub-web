"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal, Users, Mail, CheckCircle2, ArrowRight, ShieldCheck, 
  Sparkles, Award, Calendar, Timer, Ticket
} from "lucide-react";

export default function HackathonPage() {
  // Form states
  const [teamName, setTeamName] = useState("");
  const [teamSize, setTeamSize] = useState<number>(1);
  const [memberEmails, setMemberEmails] = useState<string[]>(["", "", ""]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Pricing Logic
  const registrationFee = teamSize === 1 ? 149 : 449;

  const handleEmailChange = (index: number, value: string) => {
    const updatedEmails = [...memberEmails];
    updatedEmails[index] = value;
    setMemberEmails(updatedEmails);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API registration
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#020205] text-zinc-300 font-sans selection:bg-[#00F0FF]/30 overflow-hidden flex flex-col relative">
      
      {/* ─── Ambient Light Layer ─── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay" />
        <div className="absolute top-[-10%] left-[20%] w-[60vw] h-[600px] bg-[#00F0FF]/[0.06] blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[10%] right-[10%] w-[50vw] h-[500px] bg-[#FF1CF7]/[0.04] blur-[130px] rounded-full pointer-events-none" />
      </div>

      <main className="flex-1 relative z-10 w-full max-w-[1280px] mx-auto px-6 pt-32 pb-32 flex flex-col justify-center">
        
        {/* Header Block */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-widest uppercase text-zinc-400 shadow-sm backdrop-blur-md">
            <Sparkles size={12} className="text-[#00F0FF]" /> Ecosystem Sprint
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] via-[#FF1CF7] to-[#FFFF00] tracking-tight uppercase drop-shadow-[0_0_30px_rgba(0,255,255,0.2)]">
            DevLinkHub Hackathon
          </h1>
          <p className="text-zinc-400 text-base md:text-lg max-w-xl mx-auto font-light leading-relaxed">
            Welcome to the DevLinkHub Ecosystem Sprint. Form your team, register below, and let the coding begin.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Info Card */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="rounded-3xl border border-white/5 bg-zinc-950/60 p-8 backdrop-blur-xl flex-1 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
              <div>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Terminal size={18} className="text-[#00F0FF]" /> Sprint Telemetry
                </h3>
                
                <div className="space-y-6">
                  {/* Item 1 */}
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Calendar size={16} className="text-[#00F0FF]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Date & Timeline</h4>
                      <p className="text-xs text-zinc-500 mt-1 font-light">48-hour global marathon. Commencing Friday, Dec 5.</p>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Timer size={16} className="text-[#FF1CF7]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Minimum Requirements</h4>
                      <p className="text-xs text-zinc-500 mt-1 font-light">Teams of 1 to 4 members. Projects must use Next.js or React.</p>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Award size={16} className="text-[#FFFF00]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">₹5,00,000 Prize Pool</h4>
                      <p className="text-xs text-zinc-500 mt-1 font-light">Direct investment options, exclusive dev kits, and global badges.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative terminal log preview */}
              <div className="mt-12 p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-[10px] text-zinc-500 space-y-1">
                <p className="text-emerald-500">&gt; devlinkhub-hackathon init --sprint</p>
                <p>Status: Accepting Entries</p>
                <p>Registration Fee Structure Loaded:</p>
                <p> - Solo (1 Member): ₹149</p>
                <p> - Team (2-4 Members): ₹449</p>
              </div>
            </div>
          </div>

          {/* Right Column: Registration Form Card */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-white/10 bg-[#08080c]/80 p-8 backdrop-blur-xl h-full shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.05)] relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#00F0FF]/5 via-transparent to-[#FF1CF7]/5" />
              
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-8">
                      <h2 className="text-2xl font-black text-white tracking-tight uppercase flex items-center gap-2">
                        <Ticket size={20} className="text-[#00F0FF]" /> Secure Registration
                      </h2>
                      <p className="text-xs text-zinc-500 mt-1.5">Fill out your squad details to obtain your Sprint Access Token.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      
                      {/* Team Name Input */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Team Name</label>
                        <input
                          type="text"
                          required
                          value={teamName}
                          onChange={(e) => setTeamName(e.target.value)}
                          placeholder="e.g. Code Wizards"
                          className="w-full h-12 px-4 rounded-xl bg-white/[0.03] border border-white/10 text-white font-medium text-sm focus:outline-none focus:border-[#00F0FF] focus:bg-white/[0.05] transition-all"
                        />
                      </div>

                      {/* Number of Members Dropdown */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Number of Members</label>
                        <div className="relative">
                          <select
                            value={teamSize}
                            onChange={(e) => setTeamSize(Number(e.target.value))}
                            className="w-full h-12 px-4 rounded-xl bg-zinc-900 border border-white/10 text-white font-medium text-sm appearance-none focus:outline-none focus:border-[#00F0FF] cursor-pointer transition-all"
                          >
                            <option value={1}>1 (Solo Builder)</option>
                            <option value={2}>2 Members</option>
                            <option value={3}>3 Members</option>
                            <option value={4}>4 Members</option>
                          </select>
                          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">
                            <Users size={16} />
                          </div>
                        </div>
                      </div>

                      {/* Dynamic Member Emails */}
                      {teamSize > 1 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4 pt-2"
                        >
                          <div className="border-t border-white/5 pt-4">
                            <h4 className="text-xs font-bold text-[#00F0FF] uppercase tracking-widest mb-3">Team Member Details</h4>
                            <div className="flex flex-col gap-4">
                              {Array.from({ length: teamSize - 1 }).map((_, index) => (
                                <div key={index} className="flex flex-col gap-2">
                                  <label className="text-xs font-medium text-zinc-400">Member {index + 2} Email</label>
                                  <div className="relative">
                                    <input
                                      type="email"
                                      required
                                      value={memberEmails[index] || ""}
                                      onChange={(e) => handleEmailChange(index, e.target.value)}
                                      placeholder={`member${index + 2}@example.com`}
                                      className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/[0.03] border border-white/10 text-white font-medium text-sm focus:outline-none focus:border-[#00F0FF] transition-all"
                                    />
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600">
                                      <Mail size={14} />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Price Display Widget */}
                      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 flex items-center justify-between mt-8 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#00F0FF]/5 to-transparent pointer-events-none" />
                        <div>
                          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Registration Amount</p>
                          <p className="text-xs text-zinc-400 font-light">
                            {teamSize === 1 ? "Solo Entry Rate" : `Team Entry Rate (${teamSize} Members)`}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 font-mono">
                            ₹{registrationFee}
                          </span>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        className="w-full h-14 rounded-2xl bg-white hover:bg-zinc-200 text-black font-black text-sm transition-all duration-300 active:scale-[0.98] shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2 group cursor-pointer"
                      >
                        Register <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </button>

                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, type: "spring" }}
                    className="h-full flex flex-col items-center justify-center text-center p-8 space-y-6"
                  >
                    <div className="w-20 h-20 rounded-3xl bg-[#00FFA3]/10 border border-[#00FFA3]/20 flex items-center justify-center shadow-[0_0_45px_rgba(0,255,163,0.2)] animate-pulse">
                      <CheckCircle2 size={40} className="text-[#00FFA3]" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-white tracking-tight uppercase">Registration Confirmed</h3>
                      <p className="text-sm text-[#00FFA3] font-mono">Sprint Access Token Issued</p>
                    </div>

                    <div className="w-full p-5 rounded-2xl border border-white/5 bg-black/40 text-left font-mono text-xs text-zinc-400 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-zinc-600">SQUAD_ID:</span>
                        <span className="text-white font-bold">{teamName.toUpperCase().replace(/\s+/g, "_")}_{Math.floor(1000 + Math.random() * 9000)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-600">MEMBERS:</span>
                        <span className="text-white">{teamSize}</span>
                      </div>
                      {teamSize > 1 && (
                        <div className="flex justify-between items-start">
                          <span className="text-zinc-600">SQUAD_EMAILS:</span>
                          <span className="text-right text-[10px] text-zinc-300">
                            {memberEmails.slice(0, teamSize - 1).join(", ")}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-zinc-600">STATUS:</span>
                        <span className="text-emerald-500 font-bold">READY_TO_BUILD</span>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-500 leading-relaxed font-light">
                      A confirmation has been broadcast to all team members' interfaces. Let the coding begin!
                    </p>

                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="text-xs text-zinc-400 hover:text-white transition-colors underline font-medium cursor-pointer"
                    >
                      Register another team
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

      </main>
      
    </div>
  );
}
