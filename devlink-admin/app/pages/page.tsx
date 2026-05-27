"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";

const ALL_PAGES = [
  { path: "about", label: "About", group: "Public" },
  { path: "apply", label: "Apply", group: "Public" },
  { path: "blog", label: "Blog", group: "Public" },
  { path: "build", label: "Build", group: "Public" },
  { path: "careers", label: "Careers", group: "Public" },
  { path: "community", label: "Community", group: "Public" },
  { path: "contact", label: "Contact", group: "Public" },
  { path: "events", label: "Events", group: "Public" },
  { path: "guilds", label: "Guilds", group: "Public" },
  { path: "hackathons", label: "Hackathons", group: "Public" },
  { path: "join", label: "Join", group: "Public" },
  { path: "leadership", label: "Leadership", group: "Public" },
  { path: "mission", label: "Mission", group: "Public" },
  { path: "onboarding", label: "Onboarding", group: "Public" },
  { path: "opensource", label: "Open Source", group: "Public" },
  { path: "partners", label: "Partners", group: "Public" },
  { path: "projects", label: "Projects", group: "Public" },
  { path: "referral", label: "Referral", group: "Public" },
  { path: "resources", label: "Resources", group: "Public" },
  { path: "signin", label: "Sign In", group: "Public" },
  { path: "sponsors", label: "Sponsors", group: "Public" },
  { path: "startups", label: "Startups", group: "Public" },
  { path: "team", label: "Team", group: "Public" },
  { path: "waitlist", label: "Waitlist", group: "Public" },
  { path: "dashboard", label: "Dashboard", group: "Dashboard" },
  { path: "leaderboard", label: "Leaderboard", group: "Dashboard" },
  { path: "notifications", label: "Notifications", group: "Dashboard" },
  { path: "profile", label: "Profile", group: "Dashboard" },
  { path: "projects-dash", label: "Projects", group: "Dashboard" },
  { path: "settings-dash", label: "Settings", group: "Dashboard" },
  { path: "tasks", label: "Tasks", group: "Dashboard" },
];

const PAGE_MODES = ["visible", "hidden", "coming_soon", "maintenance"] as const;
type PageMode = typeof PAGE_MODES[number];

const MODE_CONFIG: Record<PageMode, { label: string; color: string; bg: string; border: string }> = {
  visible: { label: "Visible", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
  hidden: { label: "Hidden", color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20" },
  coming_soon: { label: "Coming Soon", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
  maintenance: { label: "Maintenance", color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20" },
};

export default function PagesPage() {
  const [modes, setModes] = useState<Record<string, PageMode>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState("All");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadPagesData() {
      try {
        const res = await fetch("http://localhost:5000/api/admin/settings");
        if (res.ok) {
          const map = await res.json();
          const vis = map["devlink_page_modes"] || {};
          const n = map["devlink_page_notes"] || {};
          setModes(vis);
          setNotes(n);
          return;
        }
      } catch (e) {
        console.warn("Backend settings API unavailable, falling back to local storage", e);
      }

      try {
        const vis = JSON.parse(localStorage.getItem("devlink_page_modes") || "{}");
        setModes(vis);
        const n = JSON.parse(localStorage.getItem("devlink_page_notes") || "{}");
        setNotes(n);
      } catch {}
    }
    loadPagesData();
  }, []);

  async function setPageMode(path: string, mode: PageMode) {
    const next = { ...modes, [path]: mode };
    setModes(next);
    const vis: Record<string, boolean> = {};
    Object.entries(next).forEach(([k, v]) => { vis[k] = v === "visible"; });

    try {
      await fetch("http://localhost:5000/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "devlink_page_modes", value: next }),
      });
      await fetch("http://localhost:5000/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "devlink_page_visibility", value: vis }),
      });
    } catch (e) {
      console.error("Failed to save page mode to backend:", e);
    }

    localStorage.setItem("devlink_page_modes", JSON.stringify(next));
    localStorage.setItem("devlink_page_visibility", JSON.stringify(vis));
  }

  async function setNote(path: string, note: string) {
    const next = { ...notes, [path]: note };
    setNotes(next);
    try {
      await fetch("http://localhost:5000/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "devlink_page_notes", value: next }),
      });
    } catch (e) {
      console.error("Failed to save page notes to backend:", e);
    }
    localStorage.setItem("devlink_page_notes", JSON.stringify(next));
  }

  async function showAll() {
    const next: Record<string, PageMode> = {};
    ALL_PAGES.forEach(p => { next[p.path] = "visible"; });
    setModes(next);
    const vis: Record<string, boolean> = {};
    ALL_PAGES.forEach(p => { vis[p.path] = true; });

    try {
      await fetch("http://localhost:5000/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "devlink_page_modes", value: next }),
      });
      await fetch("http://localhost:5000/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "devlink_page_visibility", value: vis }),
      });
    } catch (e) {
      console.error("Failed to save page modes to backend:", e);
    }

    localStorage.setItem("devlink_page_modes", JSON.stringify(next));
    localStorage.setItem("devlink_page_visibility", JSON.stringify(vis));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const filtered = filter === "All" ? ALL_PAGES : ALL_PAGES.filter(p => p.group === filter);

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-white">Pages Manager</h1>
            <p className="text-sm text-zinc-500 mt-1">Control visibility of every page on DevLink</p>
          </div>
          <div className="flex items-center gap-3">
            {saved && <span className="text-xs text-emerald-400 font-semibold">✓ Saved</span>}
            <button onClick={showAll} className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/20 transition-all">
              Show All Pages
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-6">
          {["All", "Public", "Dashboard"].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
              filter === f ? "bg-[#FF1CF7] text-white border-[#FF1CF7]" : "text-zinc-400 border-white/10 hover:border-white/20"
            }`}>{f}</button>
          ))}
          <span className="text-xs text-zinc-600 ml-auto font-mono">{filtered.length} pages</span>
        </div>

        {/* Pages list */}
        <div className="space-y-2">
          {filtered.map(page => {
            const mode: PageMode = modes[page.path] || "visible";
            const cfg = MODE_CONFIG[mode];
            return (
              <div key={page.path} className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-white">/{page.path}</span>
                    <span className="text-[10px] font-semibold text-zinc-600 bg-white/5 border border-white/[0.06] px-2 py-0.5 rounded-full">{page.group}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                      {cfg.label}
                    </span>
                  </div>
                  <input
                    value={notes[page.path] || ""}
                    onChange={e => setNote(page.path, e.target.value)}
                    placeholder="Add a note (internal only)..."
                    className="text-xs text-zinc-500 bg-transparent outline-none w-full placeholder-zinc-700"
                  />
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {PAGE_MODES.map(m => {
                    const c = MODE_CONFIG[m];
                    return (
                      <button
                        key={m}
                        onClick={() => setPageMode(page.path, m)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                          mode === m ? `${c.color} ${c.bg} ${c.border}` : "text-zinc-600 border-white/[0.06] hover:border-white/20"
                        }`}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
