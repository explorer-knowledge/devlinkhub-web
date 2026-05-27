"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import Link from "next/link";

const PUBLIC_PAGES = [
  "about","apply","blog","build","careers","community","contact",
  "events","guilds","hackathons","join","leadership","mission",
  "onboarding","opensource","partners","projects","referral",
  "resources","signin","sponsors","startups","team","waitlist"
];

const DASH_PAGES = ["dashboard","leaderboard","notifications","profile","projects","settings","tasks"];

const SITE_MODES = [
  { key: "live", label: "🟢 Live", desc: "Site fully live", color: "#00FFA3" },
  { key: "maintenance", label: "🟡 Maintenance", desc: "Maintenance mode", color: "#F59E0B" },
  { key: "coming_soon", label: "🔵 Coming Soon", desc: "Coming soon overlay", color: "#00F0FF" },
];

export default function DashboardPage() {
  const [siteMode, setSiteMode] = useState("live");
  const [pageVis, setPageVis] = useState<Record<string, boolean>>({});
  const [announcements, setAnnouncements] = useState<{ active: boolean }[]>([]);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const res = await fetch("http://localhost:5000/api/admin/settings");
        if (res.ok) {
          const map = await res.json();
          setSiteMode(map["devlink_site_mode"] || "live");
          setPageVis(map["devlink_page_visibility"] || {});
          setAnnouncements(map["devlink_announcements"] || []);
          setCurrentTime(new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }));
          return;
        }
      } catch (e) {
        console.warn("Backend settings API unavailable, falling back to local storage", e);
      }

      const mode = localStorage.getItem("devlink_site_mode") || "live";
      setSiteMode(mode);
      try {
        const vis = JSON.parse(localStorage.getItem("devlink_page_visibility") || "{}");
        setPageVis(vis);
      } catch {}
      try {
        const ann = JSON.parse(localStorage.getItem("devlink_announcements") || "[]");
        setAnnouncements(ann);
      } catch {}
      setCurrentTime(new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }));
    }
    loadDashboardData();
  }, []);

  async function setMode(mode: string) {
    setSiteMode(mode);
    try {
      await fetch("http://localhost:5000/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "devlink_site_mode", value: mode }),
      });
    } catch (e) {
      console.error("Failed to save site mode to backend:", e);
    }
    localStorage.setItem("devlink_site_mode", mode);
  }

  const visibleCount = PUBLIC_PAGES.filter(p => pageVis[p] !== false).length;
  const hiddenCount = PUBLIC_PAGES.length - visibleCount;
  const activeAnn = announcements.filter(a => a.active).length;

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-white">Dashboard</h1>
            <p className="text-sm text-zinc-500 mt-1 font-mono">{currentTime} IST</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00FFA3]/10 border border-[#00FFA3]/20">
            <span className="w-2 h-2 rounded-full bg-[#00FFA3] animate-pulse" />
            <span className="text-xs font-bold text-[#00FFA3]">Admin Active</span>
          </div>
        </div>

        {/* Site Mode */}
        <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-6 mb-6">
          <h2 className="text-sm font-bold text-white mb-1">🌐 Site Mode</h2>
          <p className="text-xs text-zinc-500 mb-4">Controls the global state of the DevLink frontend</p>
          <div className="flex flex-wrap gap-3">
            {SITE_MODES.map(m => (
              <button
                key={m.key}
                onClick={() => setMode(m.key)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold border transition-all duration-200 ${
                  siteMode === m.key
                    ? "text-black border-transparent"
                    : "bg-transparent text-zinc-400 border-white/[0.08] hover:border-white/20"
                }`}
                style={siteMode === m.key ? { background: m.color } : {}}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Pages", value: PUBLIC_PAGES.length + DASH_PAGES.length, sub: "across all routes", color: "#FF1CF7" },
            { label: "Pages Visible", value: visibleCount, sub: `${hiddenCount} hidden`, color: "#00FFA3" },
            { label: "Active Banners", value: activeAnn, sub: `${announcements.length} total`, color: "#F59E0B" },
            { label: "Site Mode", value: siteMode.replace("_", " "), sub: "current status", color: "#00F0FF" },
          ].map(s => (
            <div key={s.label} className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2">{s.label}</p>
              <p className="text-2xl font-black capitalize" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[11px] text-zinc-600 mt-1">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {[
            { href: "/pages", label: "Manage Pages", icon: "📄", color: "#FF1CF7" },
            { href: "/events", label: "Edit Events", icon: "🎫", color: "#00F0FF" },
            { href: "/announcements", label: "Announcements", icon: "📢", color: "#F59E0B" },
            { href: "/settings", label: "Site Settings", icon: "⚙️", color: "#7B61FF" },
          ].map(q => (
            <Link key={q.href} href={q.href} className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-5 hover:border-white/20 transition-all group">
              <div className="text-2xl mb-3">{q.icon}</div>
              <p
                className="text-sm font-bold text-white group-hover:text-transparent group-hover:bg-clip-text transition-all"
                style={{ backgroundImage: `linear-gradient(90deg, ${q.color}, white)` }}
              >
                {q.label}
              </p>
            </Link>
          ))}
        </div>

        {/* Pages Overview */}
        <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white">📄 Public Pages Overview</h2>
            <Link href="/pages" className="text-xs text-[#FF1CF7] hover:underline">Manage All →</Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
            {PUBLIC_PAGES.map(page => {
              const visible = pageVis[page] !== false;
              return (
                <Link key={page} href="/pages" className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg border text-[11px] font-semibold transition-all hover:border-white/20 ${
                  visible
                    ? "border-white/[0.06] text-zinc-300 bg-white/[0.02]"
                    : "border-red-500/20 text-red-400 bg-red-500/[0.04]"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${visible ? "bg-emerald-400" : "bg-red-400"}`} />
                  /{page}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Dashboard Pages */}
        <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white">🖥️ Dashboard Pages</h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {DASH_PAGES.map(page => (
              <div key={page} className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg border border-white/[0.06] text-[11px] font-semibold text-zinc-300 bg-white/[0.02]">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                /dash/{page}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
