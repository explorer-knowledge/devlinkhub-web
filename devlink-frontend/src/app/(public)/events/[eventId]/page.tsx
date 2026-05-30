"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence, useMotionTemplate, useMotionValue } from "framer-motion";
import { 
  ArrowLeft, Calendar, MapPin, Clock, Globe, ArrowRight, Ticket, 
  PlayCircle, Image as ImageIcon, CheckCircle2, ChevronRight, 
  Users, Terminal, Sparkles, AlertTriangle, ShieldAlert, Award,
  Cpu, FileCode, Check, Play, X, User
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getEventById, getUserRegisteredEvents, toggleEventRSVP, Event } from "@/utils/eventsData";

// ─── LOCAL UTILITY COMPONENT ─────────────────────────────────────────

function SpotlightCard({ children, className = "", accent = "#00F0FF" }: { children: React.ReactNode, className?: string, accent?: string }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div 
      onMouseMove={handleMouseMove} 
      className={`relative group overflow-hidden bg-[#050505] border border-white/10 rounded-2xl transition-all duration-500 hover:border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.05)] ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-500 group-hover:opacity-100 z-0"
        style={{ background: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, ${accent}15, transparent 40%)` }}
      />
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

// ─── MAIN EVENT DETAILS PAGE ─────────────────────────────────────────

export default function EventDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  // RSVP Terminal Animation State
  const [isRSVPing, setIsRSVPing] = useState(false);
  const [rsvpActionType, setRsvpActionType] = useState<"register" | "cancel">("register");
  const [rsvpLogs, setRsvpLogs] = useState<string[]>([]);

  // Lightbox Modal State
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  // Load event details and local auth user
  useEffect(() => {
    if (typeof window !== "undefined") {
      const authUser = localStorage.getItem("devlinkhub_auth_user");
      if (authUser) {
        setCurrentUser(JSON.parse(authUser));
      }

      getEventById(eventId).then((matched) => {
        if (matched) {
          setEvent(matched);
          const registeredList = getUserRegisteredEvents();
          setIsRegistered(registeredList.includes(eventId));
        }
        setLoading(false);
      });
    }
  }, [eventId]);

  const handleRSVPAction = () => {
    if (!currentUser) {
      // Redirect to sign in page
      router.push(`/signin?redirect=/events/${eventId}`);
      return;
    }

    const type = isRegistered ? "cancel" : "register";
    setRsvpActionType(type);
    setIsRSVPing(true);

    const logSteps = type === "register" ? [
      "Connecting to DevLinkHub core node...",
      "Resolving developer credentials for @" + currentUser.username + "...",
      "Allocating capacity slot for: " + event?.title + "...",
      "Generating unique cryptographically signed ticket...",
      "Broadcasting registration to ecosystem indexers...",
      "RSVP Registration Complete!"
    ] : [
      "Resolving registered nodes catalog...",
      "Locating secure credential release signature...",
      "Freeing slot allocation in the decentralized repository...",
      "Updating community registration metadata index...",
      "RSVP Cancelled."
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < logSteps.length) {
        setRsvpLogs(prev => [...prev, `[system] ${logSteps[step]}`]);
        step++;
      } else {
        clearInterval(interval);
        
        // Actually toggle state in local storage
        toggleEventRSVP(eventId).then((registered) => {
          setIsRegistered(registered);
          
          // End loader
          setTimeout(() => {
            setIsRSVPing(false);
            setRsvpLogs([]);
          }, 300);
        });
      }
    }, 250);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-mono text-xs gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-t-[#00F0FF] border-white/5 animate-spin" />
        Compiling event registry telemetry data...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-black text-zinc-300 flex flex-col justify-center items-center px-4 text-center">
        <ShieldAlert size={40} className="text-[#FF1CF7] mb-4 animate-bounce" />
        <h2 className="text-xl font-bold text-white mb-2">Event Registry Unresolved</h2>
        <p className="text-xs text-zinc-500 max-w-sm mb-6 leading-relaxed">
          The requested event record does not exist or has been archived outside the accessible memory indexes.
        </p>
        <Link 
          href="/events" 
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors font-mono text-xs cursor-pointer bg-white/5 border border-white/10 px-5 py-2.5 rounded-full"
        >
          <ArrowLeft size={13} /> Return to Calendar
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
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[90vw] max-w-[1000px] h-[500px] blur-[150px] rounded-full opacity-[0.07] pointer-events-none mix-blend-screen"
          style={{ backgroundColor: event.color }}
        />

        <div className="max-w-[1200px] mx-auto w-full px-6 relative z-10 space-y-10">
          
          {/* Breadcrumbs & Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Link 
              href="/events" 
              className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors font-mono text-xs cursor-pointer bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md"
            >
              <ArrowLeft size={13} /> Back to directory
            </Link>
            <div className="text-zinc-500 font-mono text-[10px] hidden sm:block">
              NODE // EVENT // {event.id.toUpperCase()}
            </div>
          </div>

          {/* ─── HERO HEADER ─── */}
          <div className="border-b border-white/5 pb-10 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-2.5 py-1 rounded-md text-[9px] font-mono font-bold uppercase tracking-widest border ${
                event.status === "completed" 
                  ? "bg-zinc-900 border-zinc-800 text-zinc-400" 
                  : event.status === "live"
                  ? "bg-red-500/10 border-red-500/25 text-red-400 animate-pulse"
                  : "bg-[#00FFA3]/10 border-[#00FFA3]/20 text-[#00FFA3]"
              }`}>
                {event.status === "completed" ? "✓ Completed" : event.status === "live" ? "● Live Now" : "● Open"}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{event.type}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-none">
              {event.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-4 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <Calendar size={16} style={{ color: event.color }} />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} style={{ color: event.color }} />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} style={{ color: event.color }} />
                <span>{event.location}</span>
              </div>
            </div>
          </div>

          {/* ─── GRID LAYOUT ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column (8 cols): Info, Speakers, Agenda, Media, Projects */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* About section */}
              <div className="bg-[#08080a] border border-white/5 rounded-3xl p-8 space-y-6 shadow-xl">
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest border-b border-white/5 pb-3">
                  Overview
                </h3>
                <p className="text-base text-zinc-400 leading-relaxed font-light">
                  {event.longDesc || event.desc}
                </p>
              </div>

              {/* Speakers Section */}
              {event.speakers && event.speakers.length > 0 && (
                <div className="bg-[#08080a] border border-white/5 rounded-3xl p-8 space-y-6 shadow-xl">
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest border-b border-white/5 pb-3">
                    Hosts & Presenters
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {event.speakers.map((speaker, index) => (
                      <div key={index} className="flex gap-4 p-4 rounded-2xl bg-black/40 border border-white/5">
                        <img 
                          src={speaker.avatar} 
                          alt={speaker.name} 
                          className="w-14 h-14 rounded-xl object-cover border border-white/10 shrink-0" 
                        />
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-white leading-tight">{speaker.name}</h4>
                          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{speaker.role}</p>
                          <p className="text-xs text-zinc-400 leading-relaxed font-light mt-1">{speaker.bio}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Agenda Section */}
              {event.agenda && event.agenda.length > 0 && (
                <div className="bg-[#08080a] border border-white/5 rounded-3xl p-8 space-y-6 shadow-xl">
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest border-b border-white/5 pb-3">
                    Schedule Agenda
                  </h3>
                  <div className="relative border-l border-white/10 pl-6 ml-3 space-y-6 pt-2">
                    {event.agenda.map((item, index) => (
                      <div key={index} className="relative group">
                        <div 
                          className="absolute -left-[30px] top-1.5 w-2 h-2 rounded-full border bg-black transition-all group-hover:scale-125"
                          style={{ borderColor: event.color, boxShadow: `0 0 6px ${event.color}` }}
                        />
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-[10px] font-mono font-bold text-zinc-500">{item.time}</span>
                          {item.speaker && (
                            <span className="text-[9px] font-mono text-zinc-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded flex items-center gap-1">
                              <User size={10} /> {item.speaker}
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1 group-hover:text-white transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-xs text-zinc-400 font-light mt-1.5 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Media Gallery / Video (Completed events) */}
              {event.status === "completed" && (
                <>
                  {/* YouTube Recap */}
                  {event.videoRecap && event.videoUrl && (
                    <div className="bg-[#08080a] border border-white/5 rounded-3xl p-8 space-y-6 shadow-xl">
                      <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest border-b border-white/5 pb-3 flex items-center gap-2">
                        <PlayCircle size={15} style={{ color: event.color }} /> Video recap
                      </h3>
                      
                      <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                        <iframe 
                          src={event.videoUrl} 
                          title={`${event.title} Recap`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                          className="absolute inset-0 w-full h-full border-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Photo Collage Lightbox */}
                  {event.images && event.images.length > 0 && (
                    <div className="bg-[#08080a] border border-white/5 rounded-3xl p-8 space-y-6 shadow-xl">
                      <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest border-b border-white/5 pb-3 flex items-center gap-2">
                        <ImageIcon size={15} style={{ color: event.color }} /> Captured Moments ({event.photosCount || event.images.length})
                      </h3>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {event.images.map((img, i) => (
                          <div 
                            key={i} 
                            onClick={() => setActivePhoto(img)}
                            className="aspect-square rounded-xl overflow-hidden bg-zinc-900 border border-white/10 hover:border-white/20 transition-all cursor-zoom-in relative group"
                          >
                            <img 
                              src={img} 
                              alt={`Event capture ${i + 1}`} 
                              className="w-full h-full object-cover opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-100 group-hover:opacity-0 transition-opacity pointer-events-none" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Projects showcase */}
                  {event.projects && event.projects.length > 0 && (
                    <div className="bg-[#08080a] border border-white/5 rounded-3xl p-8 space-y-6 shadow-xl">
                      <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest border-b border-white/5 pb-3 flex items-center gap-2">
                        <Cpu size={15} style={{ color: event.color }} /> Projects Created
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {event.projects.map((proj, i) => (
                          <div key={i} className="p-5 rounded-2xl bg-black border border-white/5 hover:border-white/10 transition-colors flex flex-col justify-between space-y-4">
                            <div className="space-y-2">
                              <h4 className="text-sm font-bold text-white tracking-tight flex items-center justify-between">
                                {proj.name}
                                {proj.link && (
                                  <a href={proj.link} className="text-zinc-500 hover:text-white transition-colors">
                                    <ArrowRight size={14} className="-rotate-45" />
                                  </a>
                                )}
                              </h4>
                              <p className="text-xs text-zinc-400 leading-relaxed font-light">{proj.description}</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/5">
                              <span className="text-[8px] font-mono uppercase text-zinc-600 mr-1.5">Contributors</span>
                              {proj.contributors.map((c, idx) => (
                                <span key={idx} className="text-[9px] font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

            </div>

            {/* Right Column (4 cols): RSVP registry dashboard, capacity limits */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* RSVP Action widget */}
              <div className="bg-[#08080a] border border-white/5 rounded-3xl p-6 space-y-6 shadow-xl relative overflow-hidden">
                {/* Visual Glow */}
                <div 
                  className="absolute -right-20 -top-20 w-44 h-44 blur-[80px] rounded-full opacity-[0.1] pointer-events-none"
                  style={{ backgroundColor: event.color }}
                />

                {/* Submitting console simulator */}
                <AnimatePresence>
                  {isRSVPing && (
                    <div className="absolute inset-0 bg-[#050505]/98 z-30 p-6 flex flex-col justify-center items-center text-center space-y-4">
                      <div className="w-10 h-10 rounded-full border-4 border-t-2 border-white/5 animate-spin mb-2" 
                           style={{ borderTopColor: event.color }} />
                      <div className="space-y-1">
                        <span className="block text-[10px] font-mono text-white tracking-widest uppercase animate-pulse">
                          {rsvpActionType === "register" ? "Broadcasting RSVP" : "Releasing Spot"}
                        </span>
                        <span className="block text-[8px] text-zinc-500">Updating decentralized state nodes...</span>
                      </div>
                      
                      <div className="w-full bg-black border border-white/10 rounded-xl p-3 font-mono text-[8px] text-left min-h-[90px] flex flex-col justify-end overflow-hidden relative shadow-2xl"
                           style={{ color: event.color }}>
                        <div className="absolute inset-0 pointer-events-none opacity-5" style={{ backgroundColor: event.color }} />
                        <div className="flex flex-col gap-0.5 overflow-y-auto">
                          {rsvpLogs.map((log, idx) => (
                            <div key={idx} className="truncate">{log}</div>
                          ))}
                          <div className="w-1.5 h-3 animate-pulse ml-0.5 inline-block" style={{ backgroundColor: event.color }} />
                        </div>
                      </div>
                    </div>
                  )}
                </AnimatePresence>

                <div className="space-y-2 border-b border-white/5 pb-4">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">EVENT REGISTRY</span>
                  <h3 className="text-sm font-bold text-white">RSVP Management</h3>
                </div>

                {event.status === "completed" ? (
                  <div className="space-y-4 text-center py-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 mx-auto">
                      <CheckCircle2 size={18} className="text-[#00FFA3]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Event Archive Loaded</h4>
                      <p className="text-[11px] text-zinc-500 font-light mt-1">This node has successfully run and is officially compiled.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Capacity Indicator */}
                    {event.capacity && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-zinc-500 font-mono">Node Capacity:</span>
                          <span className="text-white font-bold font-mono">
                            {isRegistered ? "149" : "148"} / {event.capacity}
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-white/5 border border-white/5 overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500" 
                            style={{ 
                              backgroundColor: event.color,
                              width: `${((isRegistered ? 149 : 148) / event.capacity) * 100}%` 
                            }} 
                          />
                        </div>
                        <span className="block text-[9px] text-zinc-500 italic">Slots are limited and assigned chronologically.</span>
                      </div>
                    )}

                    {/* Requirements / Prep list */}
                    {event.requirements && event.requirements.length > 0 && (
                      <div className="space-y-2.5 pt-2">
                        <span className="block text-[8px] font-mono text-zinc-600 uppercase tracking-wider">Required Specs</span>
                        <div className="space-y-1">
                          {event.requirements.map((req, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-zinc-400">
                              <Check size={11} className="text-[#00FFA3]" />
                              <span>{req}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <button 
                      onClick={handleRSVPAction}
                      className="w-full h-12 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                      style={{ 
                        backgroundColor: isRegistered ? "transparent" : event.color,
                        color: isRegistered ? event.color : "#000000",
                        border: isRegistered ? `1px solid ${event.color}` : "none",
                        boxShadow: isRegistered ? "none" : `0 0 25px ${event.color}40`
                      }}
                    >
                      {isRegistered ? (
                        <>✓ RSVP Confirmed (Cancel)</>
                      ) : (
                        <>
                          <Ticket size={15} /> 
                          {currentUser ? "RSVP & Claim Ticket" : "Sign In to RSVP"}
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Node Stats details for past events */}
              {event.status === "completed" && event.stats && (
                <div className="bg-[#08080a] border border-white/5 rounded-3xl p-6 space-y-4 shadow-xl">
                  <h3 className="text-[10px] font-mono font-bold text-white uppercase tracking-widest border-b border-white/5 pb-2">
                    Event Metrics
                  </h3>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500 font-mono">Total Attendees:</span>
                      <span className="text-white font-bold font-mono">{event.stats.attendees} devs</span>
                    </div>
                    {event.stats.projectsBuilt !== undefined && (
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500 font-mono">MVPs Created:</span>
                        <span className="text-white font-bold font-mono">{event.stats.projectsBuilt} builds</span>
                      </div>
                    )}
                    {event.stats.commitsLine && (
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500 font-mono">Registry Updates:</span>
                        <span className="text-white font-bold font-mono">{event.stats.commitsLine}</span>
                      </div>
                    )}
                    {event.stats.linesOfCode && (
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500 font-mono">Code Contributed:</span>
                        <span className="text-white font-bold font-mono">{event.stats.linesOfCode}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      </main>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activePhoto && (
          <div 
            onClick={() => setActivePhoto(null)}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-4xl w-full max-h-[85vh] flex items-center justify-center"
            >
              <img 
                src={activePhoto} 
                alt="Event capture fullscreen" 
                className="max-w-full max-h-[85vh] object-contain rounded-2xl border border-white/10 shadow-2xl" 
              />
              <button 
                onClick={() => setActivePhoto(null)}
                className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
