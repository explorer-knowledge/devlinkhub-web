"use client";

import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableRow, TableCell } from "@/components/ui/table";
import { 
  Zap, TrendingUp, FolderKanban, Users, 
  Calendar, MessageSquare, Terminal, Activity
} from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { localUser, firebaseUser } = useAuth();

  const userName = localUser?.name || firebaseUser?.displayName?.split(" ")[0] || "User";
  // Advanced Animation Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 60, damping: 15 } },
  };

  const scaleVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 50, damping: 15 } },
  };

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="show" 
      className="space-y-8 pb-10"
    >
      {/* =========================================
          WELCOME HEADER
      ========================================= */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">System Online</p>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[var(--highlight)]">{userName}</span>
          </h1>
          <p className="text-[var(--muted)] mt-1 text-sm md:text-base">Here's the telemetry on your projects today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="glass">
            <Calendar size={16} />
            Schedule
          </Button>
          <Button size="sm" className="shadow-[0_0_15px_rgba(58,190,255,0.3)]">
            <Terminal size={16} />
            New Instance
          </Button>
        </div>
      </motion.div>

      {/* =========================================
          TELEMETRY STATS GRID
      ========================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Active Projects", value: "4", icon: FolderKanban, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
          { label: "Total Commits", value: "128", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
          { label: "Team Members", value: "12", icon: Users, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" },
          { label: "Pending Tasks", value: "7", icon: Zap, color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20" },
        ].map((stat, i) => (
          <motion.div key={stat.label} variants={scaleVariants}>
            <Card className={`bg-[var(--surface)] hover:${stat.border} transition-colors duration-300 relative overflow-hidden group`}>
              <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bg} blur-3xl -mr-10 -mt-10 rounded-full opacity-50 group-hover:opacity-100 transition-opacity`} />
              <CardBody className="flex items-center gap-4 relative z-10">
                <div className={`p-3.5 rounded-xl ${stat.bg} ${stat.color} border border-white/5`}>
                  <stat.icon size={22} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] mb-1">
                    {stat.label}
                  </p>
                  <h3 className="text-2xl font-bold text-white tracking-tight">{stat.value}</h3>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* =========================================
            MAIN ACTIVITY / WORKSPACE
        ========================================= */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div variants={itemVariants}>
            <Card className="glass-strong">
              <CardHeader className="flex flex-row items-center justify-between border-b border-[var(--border)] bg-black/20">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Activity size={16} className="text-[var(--accent)]" />
                  Active Deployments
                </h3>
                <Button variant="ghost" size="sm" className="text-xs hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]">
                  View Repository
                </Button>
              </CardHeader>
              <Table headers={["Project", "Role", "Status", "Last Activity"]}>
                {[
                  { name: "QuantumStore", role: "Maintainer", status: "Active", time: "2h ago" },
                  { name: "NexusAuth", role: "Contributor", status: "Review", time: "5h ago" },
                  { name: "EtherFlow", role: "Lead", status: "Active", time: "Yesterday" },
                  { name: "DevLink UI", role: "Maintainer", status: "New", time: "2 days ago" },
                ].map((proj, i) => (
                  <TableRow key={proj.name} className="group cursor-pointer">
                    <TableCell className="font-bold text-white group-hover:text-[var(--accent)] transition-colors">
                      {proj.name}
                    </TableCell>
                    <TableCell className="text-[var(--muted)] text-sm">{proj.role}</TableCell>
                    <TableCell>
                      <Badge variant={proj.status === "Active" ? "green" : proj.status === "Review" ? "yellow" : "accent"}>
                        {proj.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[var(--muted)] text-xs font-medium">{proj.time}</TableCell>
                  </TableRow>
                ))}
              </Table>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-[var(--border)] overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface)] opacity-50 pointer-events-none" />
              <CardHeader className="relative z-10 border-b border-white/5">
                <h3 className="font-bold text-white">Velocity Chart</h3>
              </CardHeader>
              <CardBody className="relative z-10 h-56 flex items-end justify-between gap-3 px-8 pt-8">
                {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-3 group cursor-pointer h-full justify-end">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 1, delay: i * 0.1, type: "spring" }}
                      className="w-full max-w-[40px] bg-gradient-to-t from-[var(--accent)]/20 to-[var(--accent)]/80 rounded-t-md transition-all group-hover:from-[var(--accent)] group-hover:to-[var(--highlight)] group-hover:shadow-[0_0_15px_rgba(58,190,255,0.5)] relative"
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
                        {h} commits
                      </div>
                    </motion.div>
                    <span className="text-xs font-bold text-[var(--muted)] group-hover:text-white transition-colors">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                    </span>
                  </div>
                ))}
              </CardBody>
            </Card>
          </motion.div>
        </div>

        {/* =========================================
            SIDEBAR WIDGETS
        ========================================= */}
        <div className="space-y-8">
          <motion.div variants={scaleVariants}>
            <Card className="glass">
              <CardHeader className="border-b border-white/5">
                <h3 className="font-bold text-white">Incoming Comm</h3>
              </CardHeader>
              <CardBody className="space-y-5">
                {[
                  { title: "Web Guild Sync", time: "Today, 18:00 UTC", icon: Users, color: "text-blue-400" },
                  { title: "Hackathon Kickoff", time: "Tomorrow, 10:00 UTC", icon: Zap, color: "text-yellow-400" },
                  { title: "PR Review: NexusAuth", time: "In 2 hours", icon: MessageSquare, color: "text-purple-400" },
                ].map((event, i) => (
                  <div key={i} className="flex items-start gap-4 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
                    <div className={`p-2.5 rounded-lg bg-white/5 ${event.color} shrink-0 border border-white/10`}>
                      <event.icon size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white leading-tight">{event.title}</h4>
                      <p className="text-[11px] text-[var(--muted)] mt-1">{event.time}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full text-xs py-2 mt-2 border-white/10 hover:border-white/20">
                  Open Calendar Sync
                </Button>
              </CardBody>
            </Card>
          </motion.div>

          <motion.div variants={scaleVariants}>
             {/* Gamification / Rank Card */}
            <Card className="bg-gradient-to-br from-[#1a2234] to-[#0B0F19] border-[var(--accent)]/30 shadow-[0_0_30px_rgba(58,190,255,0.05)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <TrendingUp size={100} className="text-[var(--accent)]" />
              </div>
              <CardBody className="space-y-5 relative z-10 p-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--highlight)] flex items-center justify-center text-black shadow-lg">
                  <Terminal size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-white">Growth Milestone</h3>
                  <p className="text-sm text-[var(--muted)] leading-relaxed mt-1">
                    You've merged <span className="text-white font-bold">8 PRs</span> this week. You are currently operating in the top 5% of network contributors.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
                    <span>Current: Lvl 4</span>
                    <span className="text-[var(--accent)]">Next: Senior (Lvl 5)</span>
                  </div>
                  <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "80%" }}
                      transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--highlight)] glow-sm" 
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}