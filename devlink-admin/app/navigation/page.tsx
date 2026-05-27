"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";

interface NavItem {
  id: string;
  label: string;
  href: string;
  visible: boolean;
  order: number;
  badge?: string;
  external?: boolean;
}

const DEFAULT_NAV: NavItem[] = [
  { id: "1", label: "Build", href: "/build", visible: true, order: 1 },
  { id: "2", label: "Events", href: "/events", visible: true, order: 2 },
  { id: "3", label: "Guilds", href: "/guilds", visible: true, order: 3 },
  { id: "4", label: "Hackathons", href: "/hackathons", visible: true, order: 4, badge: "New" },
  { id: "5", label: "Blog", href: "/blog", visible: true, order: 5 },
  { id: "6", label: "Community", href: "/community", visible: true, order: 6 },
  { id: "7", label: "About", href: "/about", visible: true, order: 7 },
  { id: "8", label: "Partners", href: "/partners", visible: false, order: 8 },
  { id: "9", label: "Careers", href: "/careers", visible: true, order: 9 },
  { id: "10", label: "Sign In", href: "/signin", visible: true, order: 10 },
];

export default function NavigationPage() {
  const [items, setItems] = useState<NavItem[]>(DEFAULT_NAV);
  const [editing, setEditing] = useState<NavItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadNavItems() {
      try {
        const res = await fetch("http://localhost:5000/api/admin/settings");
        if (res.ok) {
          const map = await res.json();
          const stored = map["devlink_nav_items"];
          if (stored) {
            setItems(stored);
            return;
          }
        }
      } catch (e) {
        console.warn("Backend settings API unavailable, falling back to local storage", e);
      }

      try {
        const stored = JSON.parse(localStorage.getItem("devlink_nav_items") || "null");
        if (stored) setItems(stored);
      } catch {}
    }
    loadNavItems();
  }, []);

  async function saveItems(next: NavItem[]) {
    const sorted = [...next].sort((a, b) => a.order - b.order);
    setItems(sorted);
    try {
      await fetch("http://localhost:5000/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "devlink_nav_items", value: sorted }),
      });
    } catch (e) {
      console.error("Failed to save nav items to backend:", e);
    }
    localStorage.setItem("devlink_nav_items", JSON.stringify(sorted));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function toggleVisible(id: string) {
    saveItems(items.map(i => i.id === id ? { ...i, visible: !i.visible } : i));
  }

  function deleteItem(id: string) {
    saveItems(items.filter(i => i.id !== id));
  }

  function saveEdit(data: NavItem) {
    if (isNew) {
      const maxOrder = Math.max(...items.map(i => i.order), 0);
      saveItems([...items, { ...data, id: Date.now().toString(), order: maxOrder + 1 }]);
    } else {
      saveItems(items.map(i => i.id === data.id ? data : i));
    }
    setEditing(null);
    setIsNew(false);
  }

  function moveUp(id: string) {
    const idx = items.findIndex(i => i.id === id);
    if (idx <= 0) return;
    const next = [...items];
    const temp = next[idx].order;
    next[idx] = { ...next[idx], order: next[idx - 1].order };
    next[idx - 1] = { ...next[idx - 1], order: temp };
    saveItems(next);
  }

  function moveDown(id: string) {
    const idx = items.findIndex(i => i.id === id);
    if (idx >= items.length - 1) return;
    const next = [...items];
    const temp = next[idx].order;
    next[idx] = { ...next[idx], order: next[idx + 1].order };
    next[idx + 1] = { ...next[idx + 1], order: temp };
    saveItems(next);
  }

  const EMPTY_ITEM: NavItem = { id: "", label: "", href: "", visible: true, order: 0, badge: "", external: false };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-white">Navigation Manager</h1>
            <p className="text-sm text-zinc-500 mt-1">Control which links appear in the DevLink site navigation</p>
          </div>
          <div className="flex items-center gap-3">
            {saved && <span className="text-xs text-emerald-400 font-semibold">✓ Saved</span>}
            <button
              onClick={() => { setEditing({ ...EMPTY_ITEM }); setIsNew(true); }}
              className="px-4 py-2 rounded-xl bg-[#FF1CF7] text-white text-sm font-bold hover:brightness-110 transition"
            >
              + Add Link
            </button>
          </div>
        </div>

        {/* Nav preview */}
        <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-5 mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-3">Site Nav Preview</p>
          <div className="flex items-center gap-1 flex-wrap">
            {items.filter(i => i.visible).map(i => (
              <div key={i.id} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-zinc-300 font-semibold">
                {i.label}
                {i.badge && <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[#FF1CF7] text-[9px] text-white font-black">{i.badge}</span>}
                {i.external && <span className="ml-1 text-zinc-600">↗</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Nav table */}
        <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 px-5 py-3 border-b border-white/[0.06] text-[10px] font-black uppercase tracking-widest text-zinc-600">
            <div className="col-span-1">#</div>
            <div className="col-span-3">Label</div>
            <div className="col-span-3">Path</div>
            <div className="col-span-2">Badge</div>
            <div className="col-span-1">Visible</div>
            <div className="col-span-2">Actions</div>
          </div>
          {items.map((item, idx) => (
            <div key={item.id} className="grid grid-cols-12 px-5 py-3.5 border-b border-white/[0.04] hover:bg-white/[0.02] transition items-center">
              <div className="col-span-1">
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => moveUp(item.id)} className="text-zinc-600 hover:text-zinc-300 text-xs leading-none">▲</button>
                  <button onClick={() => moveDown(item.id)} className="text-zinc-600 hover:text-zinc-300 text-xs leading-none">▼</button>
                </div>
              </div>
              <div className="col-span-3 text-sm font-bold text-white">{item.label}</div>
              <div className="col-span-3 text-xs text-zinc-500 font-mono">{item.href}</div>
              <div className="col-span-2">
                {item.badge && (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#FF1CF7]/10 text-[#FF1CF7] border border-[#FF1CF7]/20">{item.badge}</span>
                )}
              </div>
              <div className="col-span-1">
                <button
                  onClick={() => toggleVisible(item.id)}
                  className={`relative w-9 h-5 rounded-full border transition-all duration-200 ${
                    item.visible ? "bg-[#FF1CF7] border-[#FF1CF7]" : "bg-white/[0.06] border-white/[0.1]"
                  }`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${item.visible ? "left-4" : "left-0.5"}`} />
                </button>
              </div>
              <div className="col-span-2 flex items-center gap-1.5">
                <button
                  onClick={() => { setEditing(item); setIsNew(false); }}
                  className="text-xs px-2.5 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-zinc-300 hover:border-white/20 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="text-xs px-2.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition"
                >
                  Del
                </button>
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
              className="bg-[#0d0d0d] border border-white/10 rounded-2xl w-full max-w-md p-7 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-lg font-black text-white mb-6">{isNew ? "Add Nav Link" : "Edit Nav Link"}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">Label</label>
                  <input
                    type="text"
                    value={editing.label}
                    onChange={e => setEditing({ ...editing, label: e.target.value })}
                    placeholder="Events"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#FF1CF7]/50 transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">Path / URL</label>
                  <input
                    type="text"
                    value={editing.href}
                    onChange={e => setEditing({ ...editing, href: e.target.value })}
                    placeholder="/events"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#FF1CF7]/50 transition"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">Badge (optional)</label>
                    <input
                      type="text"
                      value={editing.badge || ""}
                      onChange={e => setEditing({ ...editing, badge: e.target.value })}
                      placeholder="New"
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#FF1CF7]/50 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">Order</label>
                    <input
                      type="number"
                      value={editing.order}
                      onChange={e => setEditing({ ...editing, order: Number(e.target.value) })}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#FF1CF7]/50 transition"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <button
                      type="button"
                      onClick={() => setEditing({ ...editing, visible: !editing.visible })}
                      className={`relative w-9 h-5 rounded-full border transition-all duration-200 ${editing.visible ? "bg-[#FF1CF7] border-[#FF1CF7]" : "bg-white/[0.06] border-white/[0.1]"}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${editing.visible ? "left-4" : "left-0.5"}`} />
                    </button>
                    <span className="text-sm text-zinc-400">Visible</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <button
                      type="button"
                      onClick={() => setEditing({ ...editing, external: !editing.external })}
                      className={`relative w-9 h-5 rounded-full border transition-all duration-200 ${editing.external ? "bg-[#FF1CF7] border-[#FF1CF7]" : "bg-white/[0.06] border-white/[0.1]"}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${editing.external ? "left-4" : "left-0.5"}`} />
                    </button>
                    <span className="text-sm text-zinc-400">External link</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => saveEdit(editing)}
                  className="flex-1 h-11 rounded-xl bg-[#FF1CF7] text-white font-bold text-sm hover:brightness-110 transition"
                >
                  {isNew ? "Add Link" : "Save Changes"}
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
