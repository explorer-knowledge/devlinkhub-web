"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";

const PAGE_SECTIONS: Record<string, string[]> = {
  "Homepage (/)": ["Hero Banner", "Featured Stats", "Mission Statement", "How It Works", "Featured Events", "Community Showcase", "Testimonials", "CTA Banner", "Footer"],
  "Events (/events)": ["Hero", "Featured Event Ticket", "Upcoming Events Grid", "Past Events Archive", "Host a Node CTA"],
  "About (/about)": ["Hero", "Mission Section", "Team Grid", "Stats Counter", "Values Section"],
  "Build (/build)": ["Hero", "Roadmap", "Current Dev", "Future Initiatives", "Community Builds"],
  "Community (/community)": ["Hero", "Stats", "Members Grid", "Join CTA"],
  "Blog (/blog)": ["Hero", "Featured Post", "Post Grid", "Newsletter CTA"],
  "Guilds (/guilds)": ["Hero", "Guild Cards", "Join Guild CTA"],
  "Hackathons (/hackathons)": ["Hero", "Active Hackathons", "Past Hackathons", "Submit CTA"],
  "Projects (/projects)": ["Hero", "Projects Grid", "Submit Project CTA"],
  "Partners (/partners)": ["Hero", "Partner Logos", "Partner CTA"],
  "Sponsors (/sponsors)": ["Hero", "Sponsor Tiers", "Sponsor CTA"],
  "Careers (/careers)": ["Hero", "Open Roles", "Culture Section"],
  "Contact (/contact)": ["Hero", "Contact Form", "Social Links", "Map"],
  "Mission (/mission)": ["Hero", "Vision", "Goals", "Manifesto"],
};

export default function SectionsPage() {
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState<string>("Homepage (/)");

  useEffect(() => {
    async function loadVisibility() {
      try {
        const res = await fetch("http://localhost:5000/api/admin/settings");
        if (res.ok) {
          const map = await res.json();
          const stored = map["devlink_section_visibility"];
          if (stored) {
            setVisibility(stored);
            return;
          }
        }
      } catch (e) {
        console.warn("Backend settings API unavailable, falling back to local storage", e);
      }

      try {
        const v = JSON.parse(localStorage.getItem("devlink_section_visibility") || "{}");
        setVisibility(v);
      } catch {}
    }
    loadVisibility();
  }, []);

  function getSectionState(pageKey: string, section: string) {
    const key = `${pageKey}::${section}`;
    return visibility[key] !== false;
  }

  async function toggle(pageKey: string, section: string) {
    const key = `${pageKey}::${section}`;
    const next = { ...visibility, [key]: !getSectionState(pageKey, section) };
    setVisibility(next);
    try {
      await fetch("http://localhost:5000/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "devlink_section_visibility", value: next }),
      });
    } catch (e) {
      console.error("Failed to save visibility to backend:", e);
    }
    localStorage.setItem("devlink_section_visibility", JSON.stringify(next));
  }

  async function toggleAll(pageKey: string, state: boolean) {
    const sections = PAGE_SECTIONS[pageKey] || [];
    const next = { ...visibility };
    sections.forEach(s => { next[`${pageKey}::${s}`] = state; });
    setVisibility(next);
    try {
      await fetch("http://localhost:5000/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "devlink_section_visibility", value: next }),
      });
    } catch (e) {
      console.error("Failed to save visibility to backend:", e);
    }
    localStorage.setItem("devlink_section_visibility", JSON.stringify(next));
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white">Sections Manager</h1>
          <p className="text-sm text-zinc-500 mt-1">Toggle individual sections on/off per page</p>
        </div>

        <div className="space-y-3">
          {Object.entries(PAGE_SECTIONS).map(([pageKey, sections]) => {
            const isOpen = open === pageKey;
            const visibleCount = sections.filter(s => getSectionState(pageKey, s)).length;
            return (
              <div key={pageKey} className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? "" : pageKey)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white">{pageKey}</span>
                    <span className="text-[11px] text-zinc-500 font-mono">{visibleCount}/{sections.length} visible</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#FF1CF7] rounded-full transition-all"
                        style={{ width: `${(visibleCount / sections.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-zinc-500 text-sm">{isOpen ? "▲" : "▼"}</span>
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-white/[0.06] px-6 py-4">
                    <div className="flex gap-2 mb-4">
                      <button onClick={() => toggleAll(pageKey, true)} className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold hover:bg-emerald-500/20 transition">Show All</button>
                      <button onClick={() => toggleAll(pageKey, false)} className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 font-semibold hover:bg-red-500/20 transition">Hide All</button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {sections.map(section => {
                        const on = getSectionState(pageKey, section);
                        return (
                          <div key={section} className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                            on ? "border-white/[0.08] bg-white/[0.02]" : "border-red-500/10 bg-red-500/[0.02]"
                          }`}>
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${on ? "bg-emerald-400" : "bg-red-400"}`} />
                              <span className="text-sm font-semibold text-zinc-300">{section}</span>
                            </div>
                            <button
                              onClick={() => toggle(pageKey, section)}
                              className={`relative w-10 h-5 rounded-full border transition-all duration-200 ${
                                on ? "bg-[#FF1CF7] border-[#FF1CF7]" : "bg-white/[0.06] border-white/[0.1]"
                              }`}
                            >
                              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${
                                on ? "left-5" : "left-0.5"
                              }`} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
