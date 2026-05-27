"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";

interface Announcement {
  id: string;
  message: string;
  ctaText?: string;
  ctaLink?: string;
  color: string;
  active: boolean;
  createdAt: string;
}

const DEFAULT_ANNOUNCEMENT: Omit<Announcement, "id" | "createdAt"> = {
  message: "",
  ctaText: "",
  ctaLink: "",
  color: "#FF1CF7",
  active: true,
};

const PRESET_COLORS = ["#FF1CF7", "#00FFA3", "#00F0FF", "#F59E0B", "#7B61FF", "#FF5F56"];

export default function AnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    async function loadAnnouncements() {
      try {
        const res = await fetch("http://localhost:5000/api/admin/settings");
        if (res.ok) {
          const map = await res.json();
          const stored = map["devlink_announcements"];
          if (stored) {
            setItems(stored);
            return;
          }
        }
      } catch (e) {
        console.warn("Backend settings API unavailable, falling back to local storage", e);
      }

      try {
        setItems(JSON.parse(localStorage.getItem("devlink_announcements") || "[]"));
      } catch {}
    }
    loadAnnouncements();
  }, []);

  async function saveItems(next: Announcement[]) {
    setItems(next);
    const active = next.find(a => a.active);
    try {
      await fetch("http://localhost:5000/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "devlink_announcements", value: next }),
      });
      await fetch("http://localhost:5000/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "devlink_active_announcement", value: active || null }),
      });
    } catch (e) {
      console.error("Failed to save announcements to backend:", e);
    }
    localStorage.setItem("devlink_announcements", JSON.stringify(next));
    if (active) localStorage.setItem("devlink_active_announcement", JSON.stringify(active));
    else localStorage.removeItem("devlink_active_announcement");
  }

  function toggleActive(id: string) {
    saveItems(items.map(a => ({ ...a, active: a.id === id ? !a.active : a.active })));
  }

  function deleteItem(id: string) {
    saveItems(items.filter(a => a.id !== id));
  }

  function saveEdit(data: Announcement) {
    if (isNew) {
      saveItems([...items, { ...data, id: Date.now().toString(), createdAt: new Date().toISOString() }]);
    } else {
      saveItems(items.map(a => a.id === data.id ? data : a));
    }
    setEditing(null);
    setIsNew(false);
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-white">Announcements</h1>
            <p className="text-sm text-zinc-500 mt-1">Manage sitewide announcement banners</p>
          </div>
          <button
            onClick={() => { setEditing({ ...DEFAULT_ANNOUNCEMENT, id: "", createdAt: "" }); setIsNew(true); }}
            className="px-4 py-2 rounded-xl bg-[#FF1CF7] text-white text-sm font-bold hover:brightness-110 transition"
          >
            + New Banner
          </button>
        </div>

        {/* Live preview */}
        {items.some(a => a.active) && (
          <div className="mb-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2">Live Preview</p>
            {items.filter(a => a.active).slice(0, 1).map(ann => (
              <div key={ann.id} className="rounded-xl px-4 py-3 flex items-center justify-between gap-4 text-sm font-semibold text-black" style={{ background: ann.color }}>
                <span>{ann.message || "No message set"}</span>
                {ann.ctaText && (
                  <span className="text-xs font-black underline shrink-0">{ann.ctaText} →</span>
                )}
              </div>
            ))}
          </div>
        )}

        {items.length === 0 && (
          <div className="text-center py-20 text-zinc-600 text-sm bg-[#0a0a0a] border border-white/[0.06] rounded-2xl">
            No announcements yet. Create one above.
          </div>
        )}

        <div className="space-y-3">
          {items.map(ann => (
            <div key={ann.id} className={`bg-[#0a0a0a] border rounded-2xl p-5 transition-all ${ann.active ? "border-white/20" : "border-white/[0.06]"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ background: ann.color }} />
                    {ann.active && (
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">LIVE</span>
                    )}
                    <span className="text-[10px] text-zinc-700 font-mono">{ann.createdAt ? new Date(ann.createdAt).toLocaleDateString() : ""}</span>
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {ann.message || <span className="text-zinc-600 italic">No message</span>}
                  </p>
                  {ann.ctaText && (
                    <p className="text-xs text-zinc-500 mt-1">CTA: {ann.ctaText} → {ann.ctaLink}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleActive(ann.id)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition ${
                      ann.active
                        ? "text-red-400 border-red-500/20 bg-red-500/10 hover:bg-red-500/20"
                        : "text-emerald-400 border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20"
                    }`}
                  >
                    {ann.active ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => { setEditing(ann); setIsNew(false); }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-zinc-300 hover:border-white/20 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteItem(ann.id)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Modal */}
        {editing && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => { setEditing(null); setIsNew(false); }}
          >
            <div
              className="bg-[#0d0d0d] border border-white/10 rounded-2xl w-full max-w-lg p-7 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-lg font-black text-white mb-6">{isNew ? "New Announcement" : "Edit Announcement"}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">Message</label>
                  <textarea
                    value={editing.message}
                    onChange={e => setEditing({ ...editing, message: e.target.value })}
                    placeholder="🚀 DevLink v2.0 is launching soon! Join the waitlist."
                    rows={3}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#FF1CF7]/50 transition resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">CTA Text</label>
                    <input
                      type="text"
                      value={editing.ctaText || ""}
                      onChange={e => setEditing({ ...editing, ctaText: e.target.value })}
                      placeholder="Join Waitlist"
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#FF1CF7]/50 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">CTA Link</label>
                    <input
                      type="text"
                      value={editing.ctaLink || ""}
                      onChange={e => setEditing({ ...editing, ctaLink: e.target.value })}
                      placeholder="/waitlist"
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#FF1CF7]/50 transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2">Accent Color</label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {PRESET_COLORS.map(c => (
                      <button
                        key={c}
                        onClick={() => setEditing({ ...editing, color: c })}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${editing.color === c ? "border-white scale-110" : "border-transparent"}`}
                        style={{ background: c }}
                      />
                    ))}
                    <input
                      type="text"
                      value={editing.color}
                      onChange={e => setEditing({ ...editing, color: e.target.value })}
                      className="flex-1 min-w-0 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none font-mono"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setEditing({ ...editing, active: !editing.active })}
                    className={`relative w-10 h-5 rounded-full border transition-all duration-200 ${
                      editing.active ? "bg-[#FF1CF7] border-[#FF1CF7]" : "bg-white/[0.06] border-white/[0.1]"
                    }`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${editing.active ? "left-5" : "left-0.5"}`} />
                  </button>
                  <span className="text-sm text-zinc-400 font-semibold">{editing.active ? "Active (live on site)" : "Inactive"}</span>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => saveEdit(editing)}
                  className="flex-1 h-11 rounded-xl bg-[#FF1CF7] text-white font-bold text-sm hover:brightness-110 transition"
                >
                  {isNew ? "Create Banner" : "Save Changes"}
                </button>
                <button
                  onClick={() => { setEditing(null); setIsNew(false); }}
                  className="px-6 h-11 rounded-xl border border-white/10 text-zinc-400 text-sm font-semibold hover:border-white/20 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
