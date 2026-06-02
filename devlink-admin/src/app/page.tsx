"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { GrowthChart } from "@/components/dashboard/GrowthChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { getDashboard, type DashboardData } from "@/lib/api";
import {
  Users,
  CalendarDays,
  Award,
  Wallet,
  Plus,
  MessageSquare,
  ArrowUpRight,
  Crown,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";

const now = new Date();
const hour = now.getHours();
const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-text-muted text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="glass-card p-6 text-center max-w-sm">
          <p className="text-error font-medium">Failed to load dashboard</p>
          <p className="text-text-muted text-sm mt-1">{error}</p>
          <p className="text-text-muted text-xs mt-3">Make sure the API server is running on <code className="bg-surface px-1 rounded">localhost:4000</code></p>
        </div>
      </div>
    );
  }

  const { stats, leaderboard, upcomingEvents } = data;

  const rankIcons = [Crown, Star, Star];

  return (
    <div className="space-y-6">
      {/* Premium Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-surface/40 via-surface/20 to-primary/5 p-6 backdrop-blur-md"
      >
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span>
              <span className="text-[10px] font-bold text-success uppercase tracking-widest font-mono">
                System Status Nominal • Node Secured
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
              {greeting}, <span className="text-gradient">Admin</span> <span className="inline-block animate-bounce">👋</span>
            </h1>
            <p className="text-text-muted text-xs md:text-sm">
              DevLink core operations control deck. Today is <span className="font-semibold text-text-secondary font-mono">{now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</span>.
            </p>
          </div>

          {/* Quick Stats Summary Widgets in Banner */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-background/50 border border-border px-3 py-1.5 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-[10px] text-text-muted font-mono uppercase">API: <strong className="text-text-primary">Live</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-background/50 border border-border px-3 py-1.5 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="text-[10px] text-text-muted font-mono uppercase">Node latency: <strong className="text-success">14ms</strong></span>
            </div>
            <button
              onClick={() => {
                window.location.href = "/events";
              }}
              className="flex items-center gap-1.5 px-4.5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all neon-glow-sm cursor-pointer hover:scale-[1.02] transform active:scale-95"
            >
              <Plus size={14} /> Create Event
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Members"
          value={stats.totalMembers.toLocaleString()}
          numericValue={stats.totalMembers}
          trend="+12.5%"
          trendUp={true}
          icon={Users}
          delay={0.05}
          accentClass="stat-border-blue"
          iconBgClass="bg-primary/10 text-primary"
          sparkData={stats.memberSpark}
          sparkColor="#3b82f6"
        />
        <StatCard
          title="Events Hosted"
          value={stats.eventsHosted.toString()}
          numericValue={stats.eventsHosted}
          trend="+4 this month"
          trendUp={true}
          icon={CalendarDays}
          delay={0.1}
          accentClass="stat-border-purple"
          iconBgClass="bg-secondary/10 text-secondary"
          sparkData={stats.eventSpark}
          sparkColor="#8b5cf6"
        />
        <StatCard
          title="Active Partnerships"
          value={stats.activePartnerships.toString()}
          numericValue={stats.activePartnerships}
          trend="-1"
          trendUp={false}
          icon={Award}
          delay={0.15}
          accentClass="stat-border-emerald"
          iconBgClass="bg-success/10 text-success"
          sparkData={stats.partnerSpark}
          sparkColor="#10b981"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          numericValue={stats.totalRevenue}
          trend="+22.4%"
          trendUp={true}
          icon={Wallet}
          delay={0.2}
          accentClass="stat-border-amber"
          iconBgClass="bg-warning/10 text-warning"
          sparkData={stats.revenueSpark}
          sparkColor="#f59e0b"
        />
      </div>

      {/* Chart + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GrowthChart />
        <ActivityFeed />
      </div>

      {/* Bottom row: Events table + Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="glass-panel overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h3 className="text-base font-semibold text-text-primary">Upcoming Events</h3>
              <p className="text-xs text-text-muted mt-0.5">Registration nodes progress</p>
            </div>
            <button
              onClick={() => {
                window.location.href = "/events";
              }}
              className="flex items-center gap-1 text-xs text-primary hover:text-primary-dark transition-colors font-medium cursor-pointer"
            >
              View all <ArrowUpRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-border/60">
            {upcomingEvents.map((event: any, i) => {
              const pct = Math.round((event.registrations / event.capacity) * 100);
              const statusColor =
                event.status === "Live" || event.status === "Open" ? "text-success bg-success/10 border-success/20"
                : event.status === "Almost Full" || event.status === "Full" ? "text-warning bg-warning/10 border-warning/20"
                : "text-text-muted bg-surface border-border";
              return (
                <motion.div
                  key={event.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i + 0.5 }}
                  onClick={() => {
                    if (event.id) {
                      localStorage.setItem("selected-event-id", String(event.id));
                    }
                    window.location.href = "/registrations";
                  }}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-hover/60 transition-all cursor-pointer group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors truncate">{event.name}</p>
                      <span className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border font-medium ${statusColor}`}>{event.status}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2.5">
                      <div className="w-full h-1.5 rounded-full bg-background border border-border overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${pct >= 100 ? "bg-error" : "bg-primary"}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(pct, 100)}%` }}
                          transition={{ delay: 0.1 * i + 0.6, duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                      <span className="text-[10px] text-text-muted font-mono whitespace-nowrap">{event.registrations} / {event.capacity}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-text-primary">{pct}%</p>
                    <p className="text-[10px] text-text-muted mt-1 font-mono">{event.date}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Member Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="glass-panel overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h3 className="text-base font-semibold text-text-primary">Member Leaderboard</h3>
              <p className="text-xs text-text-muted mt-0.5">Top contributors by score</p>
            </div>
            <button
              onClick={() => {
                window.location.href = "/team";
              }}
              className="flex items-center gap-1 text-xs text-primary hover:text-primary-dark transition-colors font-medium cursor-pointer"
            >
              View all <ArrowUpRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-border/60">
            {leaderboard.map((member, i) => {
              const maxScore = leaderboard[0].score;
              const pct = Math.round((member.score / maxScore) * 100);
              const rankColors = ["text-yellow-400 font-bold", "text-slate-300 font-bold", "text-amber-600 font-bold"];
              const borderColors = ["border-yellow-400/40 shadow-yellow-400/10", "border-slate-300/40 shadow-slate-300/10", "border-amber-600/40 shadow-amber-600/10"];
              const RankIcon = i < 3 ? rankIcons[i] : null;

              return (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i + 0.55 }}
                  className={`flex items-center gap-3 px-5 py-3 hover:bg-surface-hover/50 transition-all border-l-2 ${
                    i === 0 ? "border-yellow-400/50 bg-yellow-400/[0.02]" :
                    i === 1 ? "border-slate-400/30 bg-slate-400/[0.01]" :
                    i === 2 ? "border-amber-600/30 bg-amber-600/[0.01]" :
                    "border-transparent"
                  }`}
                >
                  <div className={`w-8 text-center text-xs shrink-0 flex items-center justify-center ${rankColors[i] || "text-text-muted"}`}>
                    {RankIcon ? (
                      <motion.div animate={i === 0 ? { rotate: [0, -5, 5, 0] } : {}} transition={{ repeat: Infinity, duration: 4, repeatDelay: 2 }}>
                        <RankIcon size={16} />
                      </motion.div>
                    ) : (
                      <span className="font-mono">#{member.rank}</span>
                    )}
                  </div>
                  <div className={`w-9 h-9 rounded-full border p-[1.5px] shrink-0 ${borderColors[i] || "border-border"}`}>
                    <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full bg-background/50" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary truncate">{member.name}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="w-full h-1 bg-background border border-border/40 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${
                            i === 0 ? "bg-yellow-400" :
                            i === 1 ? "bg-slate-300" :
                            i === 2 ? "bg-amber-600" :
                            "bg-primary"
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.08 * i + 0.65, duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-sm font-bold font-mono ${rankColors[i] || "text-primary"}`}>{member.score.toLocaleString()}</p>
                    <p className="text-[9px] uppercase tracking-wider font-semibold text-text-muted mt-0.5">{member.role}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
