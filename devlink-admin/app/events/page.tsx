"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";

interface EventItem {
  id: string;
  title: string;
  date: string;
  type: string;
  location: string;
  status: "open" | "live" | "completed";
  capacity: number;
  desc: string;
  color: string;
}

const DEFAULT_UPCOMING: EventItem[] = [
  {
    id: "ai-agriculture-summit-2026",
    title: "AI Agriculture Summit",
    date: "Nov 05",
    type: "Workshop",
    location: "Virtual Audio Stage",
    status: "open",
    capacity: 500,
    desc: "A deep dive into how AI and precision tech are reshaping agriculture.",
    color: "#00FFA3",
  },
  {
    id: "open-source-contrib-night-nov",
    title: "Open Source Contrib Night",
    date: "Nov 12",
    type: "Community Meetup",
    location: "Discord Voice Channel",
    status: "open",
    capacity: 100,
    desc: "Live pairing session on DevLink repo issues.",
    color: "#00F0FF",
  },
  {
    id: "founders-pitch-session-q4",
    title: "Founders Pitch Session",
    date: "Nov 20",
    type: "Startup Event",
    location: "Virtual Video Stage",
    status: "open",
    capacity: 300,
    desc: "Early-stage founders present MVPs to the community.",
    color: "#F59E0B",
  },
];

const EMPTY_EVENT: Omit<EventItem, "id"> = {
  title: "",
  date: "",
  type: "Workshop",
  location: "",
  status: "open",
  capacity: 100,
  desc: "",
  color: "#00F0FF",
};

const STATUS_COLORS: Record<EventItem["status"], string> = {
  open: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  live: "text-[#FF1CF7] bg-[#FF1CF7]/10 border-[#FF1CF7]/20",
  completed: "text-zinc-400 bg-white/5 border-white/10",
};

export default function EventsAdminPage() {
  const [upcoming, setUpcoming] = useState<EventItem[]>(DEFAULT_UPCOMING);
  const [editing, setEditing] = useState<EventItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch("http://localhost:5000/api/events");
        if (res.ok) {
          const data = await res.json();
          setUpcoming(data);
          return;
        }
      } catch (e) {
        console.warn("Backend events API unavailable, falling back to local storage", e);
      }

      try {
        const stored = JSON.parse(localStorage.getItem("devlink_upcoming_events") || "null");
        if (stored) setUpcoming(stored);
      } catch {}
    }
    loadEvents();
  }, []);

  async function deleteEvent(id: string) {
    try {
      const res = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setUpcoming(prev => prev.filter(e => e.id !== id));
        const stored = upcoming.filter(e => e.id !== id);
        localStorage.setItem("devlink_upcoming_events", JSON.stringify(stored));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        return;
      }
    } catch (e) {
      console.error("Failed to delete event on backend:", e);
    }

    const stored = upcoming.filter(e => e.id !== id);
    setUpcoming(stored);
    localStorage.setItem("devlink_upcoming_events", JSON.stringify(stored));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function saveEdit(data: EventItem) {
    if (isNew) {
      const newSlug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || Date.now().toString();
      const payload = { ...data, id: newSlug };
      try {
        const res = await fetch("http://localhost:5000/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const created = await res.json();
          setUpcoming(prev => [...prev, created]);
          const stored = [...upcoming, created];
          localStorage.setItem("devlink_upcoming_events", JSON.stringify(stored));
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
          setEditing(null);
          setIsNew(false);
          return;
        }
      } catch (e) {
        console.error("Failed to create event on backend:", e);
      }

      const stored = [...upcoming, payload];
      setUpcoming(stored);
      localStorage.setItem("devlink_upcoming_events", JSON.stringify(stored));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      try {
        const res = await fetch(`http://localhost:5000/api/events/${data.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const updated = await res.json();
          setUpcoming(prev => prev.map(e => e.id === updated.id ? updated : e));
          const stored = upcoming.map(e => e.id === updated.id ? updated : e);
          localStorage.setItem("devlink_upcoming_events", JSON.stringify(stored));
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
          setEditing(null);
          setIsNew(false);
          return;
        }
      } catch (e) {
        console.error("Failed to update event on backend:", e);
      }

      const stored = upcoming.map(e => e.id === data.id ? data : e);
      setUpcoming(stored);
      localStorage.setItem("devlink_upcoming_events", JSON.stringify(stored));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setEditing(null);
    setIsNew(false);
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-white">Events Manager</h1>
            <p className="text-sm text-zinc-500 mt-1">Manage upcoming events shown on the DevLink events page</p>
          </div>
          <div className="flex items-center gap-3">
            {saved && <span className="text-xs text-emerald-400 font-semibold">✓ Event saved successfully</span>}
            <button
              onClick={() => { setEditing({ ...EMPTY_EVENT, id: "" }); setIsNew(true); }}
              className="px-4 py-2 rounded-xl bg-[#FF1CF7] text-white text-sm font-bold hover:brightness-110 transition"
            >
              + Add Event
            </button>
          </div>
        </div>

        {/* Events table */}
        <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl overflow-hidden mb-6">
          <div className="grid grid-cols-12 px-5 py-3 border-b border-white/[0.06] text-[10px] font-black uppercase tracking-widest text-zinc-600">
            <div className="col-span-4">Event</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Actions</div>
          </div>
          {upcoming.map(event => (
            <div key={event.id} className="grid grid-cols-12 px-5 py-4 border-b border-white/[0.04] hover:bg-white/[0.02] transition items-center">
              <div className="col-span-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: event.color }} />
                  <span className="text-sm font-semibold text-white truncate">{event.title}</span>
                </div>
                <p className="text-[11px] text-zinc-600 mt-0.5 pl-4 truncate">{event.location}</p>
              </div>
              <div className="col-span-2 text-sm text-zinc-400 font-mono">{event.date}</div>
              <div className="col-span-2 text-xs text-zinc-400">{event.type}</div>
              <div className="col-span-2">
                <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${STATUS_COLORS[event.status]}`}>
                  {event.status}
                </span>
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <button
                  onClick={() => { setEditing(event); setIsNew(false); }}
                  className="text-xs px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-zinc-300 hover:border-white/20 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteEvent(event.id)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition"
                >
                  Del
                </button>
              </div>
            </div>
          ))}
          {upcoming.length === 0 && (
            <div className="text-center py-12 text-zinc-600 text-sm">No events. Add one above.</div>
          )}
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
              <h3 className="text-lg font-black text-white mb-6">{isNew ? "Add New Event" : "Edit Event"}</h3>
              <div className="space-y-4">
                {(
                  [
                    { key: "title", label: "Title", type: "text" },
                    { key: "date", label: "Date (e.g. Nov 05)", type: "text" },
                    { key: "location", label: "Location", type: "text" },
                    { key: "desc", label: "Description", type: "text" },
                    { key: "color", label: "Accent Color (hex)", type: "text" },
                  ] as { key: keyof EventItem; label: string; type: string }[]
                ).map(f => (
                  <div key={f.key}>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">{f.label}</label>
                    <input
                      type={f.type}
                      value={String(editing[f.key] ?? "")}
                      onChange={e => setEditing({ ...editing, [f.key]: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#FF1CF7]/50 transition"
                    />
                  </div>
                ))}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">Type</label>
                    <select
                      value={editing.type}
                      onChange={e => setEditing({ ...editing, type: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none"
                    >
                      {["Workshop", "Community Meetup", "Startup Event", "Hackathon", "Conference"].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">Status</label>
                    <select
                      value={editing.status}
                      onChange={e => setEditing({ ...editing, status: e.target.value as EventItem["status"] })}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none"
                    >
                      <option value="open">Open</option>
                      <option value="live">Live</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">Capacity</label>
                    <input
                      type="number"
                      value={editing.capacity}
                      onChange={e => setEditing({ ...editing, capacity: Number(e.target.value) })}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => saveEdit(editing)}
                  className="flex-1 h-11 rounded-xl bg-[#FF1CF7] text-white font-bold text-sm hover:brightness-110 transition"
                >
                  {isNew ? "Add Event" : "Save Changes"}
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
