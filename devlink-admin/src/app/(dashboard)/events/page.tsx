"use client";

import { useState, useEffect } from "react";
import { Calendar, MapPin, Users, Plus, X } from "lucide-react";
import { getEvents, addEvent, updateEvent, deleteEvent, type Event } from "@/lib/api";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editingEventId, setEditingEventId] = useState<number | string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "Workshop",
    date: "",
    time: "",
    venue: "",
    capacity: 100,
  });
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    type: "Workshop",
    date: "",
    time: "",
    venue: "",
    capacity: 100,
    status: "Upcoming",
  });

  useEffect(() => {
    setLoading(true);
    getEvents(typeFilter)
      .then(setEvents)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [typeFilter]);

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      const newEvent = await addEvent({ ...formData, capacity: Number(formData.capacity) });
      setEvents((prev) => [newEvent, ...prev]);
      setIsModalOpen(false);
      setFormData({ title: "", description: "", type: "Workshop", date: "", time: "", venue: "", capacity: 100 });
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteEvent = async (id: number | string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteEvent(id as any);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenEditModal = (event: Event) => {
    let formattedDate = "";
    if (event.date) {
      const d = new Date(event.date);
      if (d.toString() !== "Invalid Date") {
        formattedDate = d.toISOString().split("T")[0];
      }
    }
    setEditFormData({
      title: event.title,
      description: event.description || "",
      type: event.type,
      date: formattedDate,
      time: event.time || "",
      venue: event.venue || "",
      capacity: event.capacity,
      status: event.status,
    });
    setEditingEventId(event.id);
    setIsEditModalOpen(true);
  };

  const handleEditEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEventId) return;
    setEditing(true);
    try {
      const updated = await updateEvent(editingEventId, {
        ...editFormData,
        capacity: Number(editFormData.capacity),
      });
      setEvents((prev) =>
        prev.map((ev) => (ev.id === editingEventId ? updated : ev))
      );
      setIsEditModalOpen(false);
      setEditingEventId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setEditing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Event Management</h1>
          <p className="text-text-muted mt-1">Manage and track all DevLink community events.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium shadow-lg shadow-primary/20 transition-all neon-glow"
        >
          <Plus size={16} />
          Create Event
        </button>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-text-primary">All Events ({events.length})</h3>
          <div className="flex gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-background/50 border border-border text-sm rounded-md px-3 py-1.5 outline-none focus:border-primary text-text-primary"
            >
              <option>All Types</option>
              <option>Hackathon</option>
              <option>Webinar</option>
              <option>Tech Talk</option>
              <option>Bootcamp</option>
              <option>Workshop</option>
              <option>Conference</option>
              <option>Summit</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <svg className="animate-spin h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-text-muted uppercase bg-surface/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Event Details</th>
                  <th className="px-6 py-4 font-medium">Date & Time</th>
                  <th className="px-6 py-4 font-medium">Venue</th>
                  <th className="px-6 py-4 font-medium">Registrations</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-surface/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-text-primary">{event.title}</div>
                      <div className="text-xs text-text-muted mt-1">{event.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-text-primary">
                        <Calendar size={14} className="text-text-muted" />
                        {event.date}
                      </div>
                      <div className="text-xs text-text-muted mt-1 ml-5">{event.time}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-text-muted" />
                        <span className="truncate max-w-[150px]">{event.venue}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-primary" />
                        <div className="w-full max-w-[100px]">
                          <div className="flex justify-between text-xs mb-1">
                            <span>{event.registered}</span>
                            <span className="text-text-muted">/ {event.capacity}</span>
                          </div>
                          <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${event.registered >= event.capacity ? "bg-error" : "bg-primary"}`}
                              style={{ width: `${Math.min((event.registered / event.capacity) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${
                        event.status === "Upcoming" ? "bg-info/10 text-info border-info/20" :
                        event.status === "Full" ? "bg-error/10 text-error border-error/20" :
                        "bg-warning/10 text-warning border-warning/20"
                      }`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(event)}
                          className="px-2.5 py-1 text-xs bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 rounded-lg font-medium transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="px-2.5 py-1 text-xs bg-error/10 hover:bg-error text-error hover:text-white border border-error/20 rounded-lg font-medium transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-surface border border-border w-full max-w-lg rounded-xl shadow-2xl p-6 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-text-primary mb-6">Create New Event</h2>

            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1.5">Event Title</label>
                <input
                  type="text" required value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-sm text-text-primary"
                  placeholder="e.g. Next.js Masterclass"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-muted mb-1.5">Description</label>
                <textarea
                  required rows={3} value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-sm text-text-primary resize-none"
                  placeholder="Briefly describe what this event is about..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1.5">Event Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-sm text-text-primary"
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Webinar">Webinar</option>
                    <option value="Tech Talk">Tech Talk</option>
                    <option value="Bootcamp">Bootcamp</option>
                    <option value="Conference">Conference</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1.5">Max Capacity</label>
                  <input
                    type="number" required min="1" value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-sm text-text-primary"
                    placeholder="e.g. 100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1.5">Date</label>
                  <input
                    type="date" required value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-sm text-text-primary [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1.5">Time</label>
                  <input
                    type="time" required value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-sm text-text-primary [color-scheme:dark]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-muted mb-1.5">Venue / Online Link</label>
                <input
                  type="text" required value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-sm text-text-primary"
                  placeholder="e.g. Main Auditorium or Zoom Link"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-transparent text-text-muted hover:text-text-primary font-medium text-sm transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={adding} className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium text-sm shadow-md transition-colors neon-glow disabled:opacity-60">
                  {adding ? "Creating..." : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-surface border border-border w-full max-w-lg rounded-xl shadow-2xl p-6 relative">
            <button
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingEventId(null);
              }}
              className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-text-primary mb-6">Edit Event</h2>

            <form onSubmit={handleEditEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1.5">Event Title</label>
                <input
                  type="text"
                  required
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-sm text-text-primary"
                  placeholder="e.g. Next.js Masterclass"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-muted mb-1.5">Description</label>
                <textarea
                  required
                  rows={3}
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-sm text-text-primary resize-none"
                  placeholder="Briefly describe what this event is about..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1.5">Event Type</label>
                  <select
                    value={editFormData.type}
                    onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-sm text-text-primary"
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Webinar">Webinar</option>
                    <option value="Tech Talk">Tech Talk</option>
                    <option value="Bootcamp">Bootcamp</option>
                    <option value="Conference">Conference</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1.5">Max Capacity (Limit)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={editFormData.capacity}
                    onChange={(e) => setEditFormData({ ...editFormData, capacity: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-sm text-text-primary"
                    placeholder="e.g. 100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1.5">Date</label>
                  <input
                    type="date"
                    required
                    value={editFormData.date}
                    onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-sm text-text-primary [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1.5">Time</label>
                  <input
                    type="time"
                    required
                    value={editFormData.time}
                    onChange={(e) => setEditFormData({ ...editFormData, time: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-sm text-text-primary [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1.5">Venue / Online Link</label>
                  <input
                    type="text"
                    required
                    value={editFormData.venue}
                    onChange={(e) => setEditFormData({ ...editFormData, venue: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-sm text-text-primary"
                    placeholder="e.g. Main Auditorium or Zoom Link"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1.5">Registration Status</label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-sm text-text-primary"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Live">Live</option>
                    <option value="Full">Full (Closed)</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingEventId(null);
                  }}
                  className="px-4 py-2 bg-transparent text-text-muted hover:text-text-primary font-medium text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editing}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium text-sm shadow-md transition-colors neon-glow disabled:opacity-60"
                >
                  {editing ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
