"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Mail,
  Download,
  Plus,
  X,
  Search,
  CheckCircle,
  Clock,
  Users,
  ChevronLeft,
  Trash2,
  CreditCard,
  Calendar,
  MapPin,
  Sparkles,
  ArrowRight,
  Clipboard,
  Check,
  ShieldCheck,
  UserCheck,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getRegistrations,
  addRegistration,
  updateRegistrationPayment,
  deleteRegistration,
  getEvents,
  type Registration,
  type Event,
} from "@/lib/api";

export default function RegistrationsPage() {
  const [data, setData] = useState<Registration[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedEventId, setSelectedEventId] = useState<number | string | null>(null);
  const [activeRegDetails, setActiveRegDetails] = useState<Registration | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    college: "",
    ticketType: "Standard",
    type: "Individual",
    teamName: "",
    teamMembers: "",
    payment: "Unpaid",
    eventId: "",
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      // We pass "All" as eventFilter to fetch all registrations, then filter client-side
      // to display stats in the master view, and filter by selectedEventId in the detail view.
      const res = await getRegistrations(search, statusFilter, "All");
      setData(res);
    } catch (err) {
      console.error("Error fetching registrations:", err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await getEvents();
      setEvents(res);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchEvents();
  }, [fetchData, fetchEvents]);

  useEffect(() => {
    const storedEventId = localStorage.getItem("selected-event-id");
    if (storedEventId) {
      setSelectedEventId(storedEventId);
      localStorage.removeItem("selected-event-id");
    }
  }, []);

  const handlePaymentUpdate = async (id: string, newPayment: "Paid" | "Unpaid" | "Refunded") => {
    try {
      await updateRegistrationPayment(id, newPayment);
      fetchData();
      fetchEvents(); // Refresh event registration counts
    } catch (err) {
      console.error("Error updating payment status:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this registration?")) return;
    try {
      await deleteRegistration(id);
      fetchData();
      fetchEvents(); // Refresh event registration counts
    } catch (err) {
      console.error("Error deleting registration:", err);
    }
  };

  const handleDownloadCSV = () => {
    if (!selectedEventId) return;
    const selectedEvent = events.find((e) => String(e.id) === String(selectedEventId));
    const eventTitle = selectedEvent ? selectedEvent.title : "Event";
    const filteredData = data.filter((r) => String(r.eventId) === String(selectedEventId));

    const headers = [
      "Registration ID",
      "Name",
      "Email",
      "College",
      "Ticket Type",
      "Registration Type",
      "Team Name",
      "Role",
      "Payment Status",
      "Registration Status",
    ];
    const rows: string[][] = [];

    filteredData.forEach((r) => {
      const status = r.payment === "Paid" ? "Registered" : r.payment === "Unpaid" ? "Pending Payment" : "Refunded";

      if (r.type === "Team") {
        rows.push([
          r.id,
          `"${r.name}"`,
          `"${r.email}"`,
          `"${r.college}"`,
          `"${r.ticketType}"`,
          "Team",
          `"${r.teamName || ""}"`,
          "Team Leader",
          r.payment,
          status,
        ]);

        if (r.teamMembers && r.teamMembers.length > 0) {
          r.teamMembers.forEach((member, index) => {
            const emailMatch = member.match(/\(([^)]+)\)/);
            const cleanName = member.replace(/\s*\([^)]+\)/g, "").trim();
            const memberEmail = emailMatch ? emailMatch[1] : `${cleanName.toLowerCase().replace(/\s+/g, ".")}@example.com`;

            rows.push([
              `${r.id}-M${index + 1}`,
              `"${cleanName}"`,
              `"${memberEmail}"`,
              `"${r.college}"`,
              `"${r.ticketType}"`,
              "Team",
              `"${r.teamName || ""}"`,
              "Team Member",
              r.payment,
              status,
            ]);
          });
        }
      } else {
        rows.push([
          r.id,
          `"${r.name}"`,
          `"${r.email}"`,
          `"${r.college}"`,
          `"${r.ticketType}"`,
          "Individual",
          "",
          "Attendee",
          r.payment,
          status,
        ]);
      }
    });

    const csvContent = [headers.join(",")].concat(rows.map((row) => row.join(","))).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${eventTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-registrations.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const membersArray =
      formData.type === "Team" ? formData.teamMembers.split(",").map((m) => m.trim()).filter(Boolean) : [];

    const activeEventId = selectedEventId || formData.eventId;

    try {
      await addRegistration({
        name: formData.name,
        email: formData.email,
        college: formData.college,
        ticketType: formData.ticketType,
        type: formData.type as "Individual" | "Team",
        teamName: formData.type === "Team" ? formData.teamName : "",
        teamMembers: membersArray,
        payment: formData.payment as "Paid" | "Unpaid",
        eventId: activeEventId,
      });
      setIsModalOpen(false);
      setFormData({
        name: "",
        email: "",
        college: "",
        ticketType: "Standard",
        type: "Individual",
        teamName: "",
        teamMembers: "",
        payment: "Unpaid",
        eventId: "",
      });
      fetchData();
      fetchEvents();
    } catch (err) {
      console.error("Error adding registration:", err);
    }
  };

  const copyEmails = () => {
    if (!activeRegDetails) return;
    if (activeRegDetails.type === "Team") {
      const emails = [activeRegDetails.email];
      if (activeRegDetails.teamMembers) {
        activeRegDetails.teamMembers.forEach((member) => {
          const emailMatch = member.match(/\(([^)]+)\)/);
          if (emailMatch) {
            emails.push(emailMatch[1]);
          } else {
            const cleanName = member.replace(/\s*\([^)]+\)/g, "").trim();
            emails.push(`${cleanName.toLowerCase().replace(/\s+/g, ".")}@example.com`);
          }
        });
      }
      navigator.clipboard.writeText(emails.join(", "));
    } else {
      navigator.clipboard.writeText(activeRegDetails.email);
    }
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Get active event details
  const activeEvent = events.find((e) => String(e.id) === String(selectedEventId));

  // Filter registrations for the selected event in Detail View
  const filteredRegistrations = data.filter((r) => String(r.eventId) === String(selectedEventId));

  // Get counts for each event card in Master View
  const getEventStats = (eventId: number | string) => {
    const eventRegs = data.filter((r) => String(r.eventId) === String(eventId));
    return {
      total: eventRegs.length,
      paid: eventRegs.filter((r) => r.payment === "Paid").length,
      unpaid: eventRegs.filter((r) => r.payment === "Unpaid").length,
      refunded: eventRegs.filter((r) => r.payment === "Refunded").length,
    };
  };

  const statusStyles: Record<string, string> = {
    Paid: "bg-success/10 text-success border-success/20",
    Unpaid: "bg-warning/10 text-warning border-warning/20",
    Refunded: "bg-error/10 text-error border-error/20",
  };

  const paymentStyles: Record<string, string> = {
    Paid: "text-success",
    Unpaid: "text-warning",
    Refunded: "text-text-muted",
  };

  const paymentDots: Record<string, string> = {
    Paid: "bg-success",
    Unpaid: "bg-warning",
    Refunded: "bg-text-muted",
  };

  // Group events by active vs archived
  const activeEventsList = events.filter((e) => e.status !== "Completed");
  const archivedEventsList = events.filter((e) => e.status === "Completed");

  return (
    <div className="space-y-6">
      {/* ════════════════════════════════════════════════════════════
          MASTER VIEW: ACTIVE EVENTS DASHBOARD
          ════════════════════════════════════════════════════════════ */}
      <AnimatePresence mode="wait">
        {selectedEventId === null ? (
          <motion.div
            key="master-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                  <UserCheck className="text-primary" /> Event Registrations
                </h1>
                <p className="text-text-muted mt-1 text-sm">
                  Select an active event node to manage registrations, payments, and team specs.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium shadow-lg shadow-primary/20 transition-all neon-glow-sm self-start sm:self-auto"
              >
                <Plus size={15} /> Add Registration
              </button>
            </div>

            {/* Active Sprints */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <Sparkles size={16} className="text-primary animate-pulse" />
                <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                  Active Sprints & Meetups
                </h2>
              </div>

              {loading && events.length === 0 ? (
                <div className="flex justify-center items-center py-12">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {activeEventsList.map((event) => {
                    const stats = getEventStats(event.id);
                    return (
                      <motion.div
                        key={event.id}
                        whileHover={{ y: -4 }}
                        onClick={() => setSelectedEventId(event.id)}
                        className="glass-card p-5 border border-border/60 hover:border-primary/40 bg-surface/40 hover:bg-surface/65 transition-all cursor-pointer flex flex-col justify-between h-[230px]"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted bg-surface-hover border border-border px-2.5 py-0.5 rounded-full">
                              {event.type}
                            </span>
                            <span
                              className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-md border ${
                                event.status === "Live"
                                  ? "bg-red-500/10 border-red-500/20 text-red-400 animate-pulse"
                                  : event.status === "Full"
                                  ? "bg-warning/10 border-warning/20 text-warning"
                                  : "bg-primary/10 border-primary/20 text-primary"
                              }`}
                            >
                              ● {event.status}
                            </span>
                          </div>
                          <h3 className="font-bold text-text-primary text-base line-clamp-1 mt-1 group-hover:text-primary transition-colors">
                            {event.title}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-text-muted mt-2">
                            <Calendar size={13} />
                            <span>{event.date}</span>
                          </div>
                        </div>

                        {/* Capacity progress */}
                        <div className="space-y-1.5 mt-3">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-text-muted">Node Capacity:</span>
                            <span className="text-text-primary font-bold">
                              {event.registered} / {event.capacity}
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-background border border-border overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                event.registered >= event.capacity ? "bg-error" : "bg-primary"
                              }`}
                              style={{ width: `${Math.min((event.registered / event.capacity) * 100, 100)}%` }}
                            />
                          </div>
                        </div>

                        {/* Mini Stats Grid */}
                        <div className="grid grid-cols-3 gap-2 border-t border-border/40 pt-3 mt-3 text-center text-[10px] font-mono">
                          <div>
                            <span className="text-text-muted block">Registered</span>
                            <span className="text-success font-bold block text-xs mt-0.5">{stats.paid}</span>
                          </div>
                          <div>
                            <span className="text-text-muted block">Pending</span>
                            <span className="text-warning font-bold block text-xs mt-0.5">{stats.unpaid}</span>
                          </div>
                          <div>
                            <span className="text-text-muted block">Refunded</span>
                            <span className="text-text-muted font-bold block text-xs mt-0.5">{stats.refunded}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                  {activeEventsList.length === 0 && (
                    <div className="col-span-full text-center py-10 glass-card bg-surface/20">
                      <p className="text-text-muted text-sm">No active sprints on the calendar.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Archived Nodes */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <ShieldCheck size={16} className="text-text-muted" />
                <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider">
                  Archived Nodes (Completed Events)
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {archivedEventsList.map((event) => {
                  const stats = getEventStats(event.id);
                  return (
                    <div
                      key={event.id}
                      onClick={() => setSelectedEventId(event.id)}
                      className="glass-card p-5 border border-border/40 bg-surface/15 hover:bg-surface/25 transition-all cursor-pointer flex flex-col justify-between h-[150px] opacity-75 hover:opacity-100"
                    >
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] uppercase font-bold text-text-muted bg-surface border border-border px-2 py-0.5 rounded">
                            {event.type}
                          </span>
                          <span className="text-[9px] font-bold text-text-muted">✓ Compiled</span>
                        </div>
                        <h3 className="font-bold text-text-muted text-base line-clamp-1 mt-1">{event.title}</h3>
                        <p className="text-xs text-text-muted mt-1">{event.date}</p>
                      </div>

                      <div className="flex justify-between items-center border-t border-border/40 pt-3 text-[11px] font-mono text-text-muted">
                        <span>Total RSVPs: <strong className="text-text-primary">{stats.paid + stats.unpaid}</strong></span>
                        <span className="text-primary flex items-center gap-1 hover:underline">
                          View details <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : (
          /* ════════════════════════════════════════════════════════════
             DETAIL VIEW: EVENT REGISTRATIONS TABLE
             ════════════════════════════════════════════════════════════ */
          <motion.div
            key="detail-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Header / Breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedEventId(null)}
                  className="flex items-center gap-1.5 text-xs text-primary hover:text-primary-dark font-medium transition-colors mb-2 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full w-fit hover:scale-105 transform active:scale-95 cursor-pointer"
                >
                  <ChevronLeft size={13} /> Back to Events
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider font-mono">
                    Node ID: {activeEvent?.id}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <span className="text-xs font-mono text-primary font-bold uppercase">{activeEvent?.type}</span>
                </div>
                <h1 className="text-2xl font-bold text-text-primary tracking-tight leading-tight">
                  {activeEvent?.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 text-xs text-text-muted mt-1">
                  <span className="flex items-center gap-1"><Calendar size={13} /> {activeEvent?.date}</span>
                  <span className="flex items-center gap-1"><MapPin size={13} /> {activeEvent?.venue}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 self-start sm:self-center">
                <button
                  onClick={handleDownloadCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-surface hover:bg-surface-hover border border-border rounded-lg text-sm font-medium transition-all cursor-pointer"
                >
                  <Download size={15} /> Export CSV
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium shadow-lg shadow-primary/20 transition-all neon-glow-sm cursor-pointer"
                >
                  <Plus size={15} /> Add Registration
                </button>
              </div>
            </div>

            {/* Quick Stats Chips */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Total Registrations", value: filteredRegistrations.length, icon: Users, color: "text-text-primary", bg: "bg-surface" },
                { label: "Registered (Paid)", value: filteredRegistrations.filter((r) => r.payment === "Paid").length, icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
                { label: "Pending Payment", value: filteredRegistrations.filter((r) => r.payment === "Unpaid").length, icon: Clock, color: "text-warning", bg: "bg-warning/10" },
                { label: "Refunded Slots", value: filteredRegistrations.filter((r) => r.payment === "Refunded").length, icon: CreditCard, color: "text-error", bg: "bg-error/10" },
              ].map((c, i) => (
                <div key={i} className="glass-card px-4 py-3 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center shrink-0`}>
                    <c.icon size={16} className={c.color} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-text-primary leading-none">{c.value}</p>
                    <p className="text-[11px] text-text-muted mt-0.5">{c.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Registrations List table */}
            <div className="glass-panel overflow-hidden">
              <div className="flex items-center justify-between flex-wrap gap-3 p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search attendee or team..."
                      className="pl-8 pr-3 py-1.5 bg-background/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-all text-text-primary w-[240px]"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-background/50 border border-border text-sm rounded-lg px-3 py-1.5 outline-none focus:border-primary text-text-primary"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Paid">Registered (Paid)</option>
                    <option value="Unpaid">Pending Payment</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
                <span className="text-xs text-text-muted">{filteredRegistrations.length} registrations</span>
              </div>

              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-text-muted uppercase bg-surface/50 border-b border-border">
                      <tr>
                        <th className="px-5 py-3">Attendee (Leader)</th>
                        <th className="px-5 py-3">College</th>
                        <th className="px-5 py-3">Registration Type</th>
                        <th className="px-5 py-3">Ticket Pass</th>
                        <th className="px-5 py-3">Payment</th>
                        <th className="px-5 py-3">Registration Status</th>
                        <th className="px-5 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredRegistrations.map((reg) => (
                        <tr
                          key={reg.id}
                          onClick={() => setActiveRegDetails(reg)}
                          className="hover:bg-surface/30 transition-colors cursor-pointer group"
                        >
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(reg.name)}`}
                                alt={reg.name}
                                className="w-7 h-7 rounded-full border border-border"
                              />
                              <div>
                                <p className="font-medium text-text-primary group-hover:text-primary transition-colors">{reg.name}</p>
                                <p className="text-[10px] text-text-muted leading-tight">{reg.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-text-muted text-xs">{reg.college}</td>
                          <td className="px-5 py-3.5">
                            {reg.type === "Team" ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveRegDetails(reg);
                                }}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-primary/10 hover:bg-primary/25 text-primary border border-primary/20 hover:border-primary/40 rounded-lg transition-all cursor-pointer uppercase animate-pulse-subtle"
                                title="Click to view full team specs"
                              >
                                <Users size={12} /> Team: {reg.teamName}
                              </button>
                            ) : (
                              <span className="text-text-muted text-xs flex items-center gap-1">
                                <User size={12} /> Individual
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-text-primary text-xs font-semibold">{reg.ticketType}</td>
                          <td className="px-5 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${paymentStyles[reg.payment]}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${paymentDots[reg.payment]}`} />
                              {reg.payment}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`px-2.5 py-0.5 text-[11px] font-medium rounded-full border ${statusStyles[reg.payment]}`}>
                              {reg.payment === "Paid" ? "Registered" : reg.payment === "Unpaid" ? "Pending" : "Refunded"}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-2">
                              {reg.payment === "Unpaid" && (
                                <button
                                  onClick={() => handlePaymentUpdate(reg.id, "Paid")}
                                  className="px-2.5 py-1 text-xs bg-success/15 hover:bg-success hover:text-white border border-success/35 rounded-lg text-success font-medium transition-all flex items-center gap-1 hover:shadow-lg hover:shadow-success/15 cursor-pointer"
                                >
                                  <CheckCircle size={12} /> Mark Paid
                                </button>
                              )}
                              {reg.payment === "Paid" && (
                                <button
                                  onClick={() => handlePaymentUpdate(reg.id, "Refunded")}
                                  className="px-2.5 py-1 text-xs bg-error/15 hover:bg-error hover:text-white border border-error/35 rounded-lg text-error font-medium transition-all flex items-center gap-1 hover:shadow-lg hover:shadow-error/15 cursor-pointer"
                                >
                                  <CreditCard size={12} /> Refund
                                </button>
                              )}
                              <button
                                className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-md transition-colors cursor-pointer"
                                title="Send Mail Invitation"
                              >
                                <Mail size={14} />
                              </button>
                              <button
                                onClick={() => handleDelete(reg.id)}
                                className="p-1.5 text-text-muted hover:text-error hover:bg-error/10 rounded-md transition-colors cursor-pointer"
                                title="Delete Registration"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {!loading && filteredRegistrations.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-text-muted text-sm">No registrations found matching your filters.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════════════
          REGISTRATION DETAILS MODAL (POPUP ON ROW CLICK)
          ════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {activeRegDetails && (() => {
          const registrationEvent = events.find((e) => String(e.id) === String(activeRegDetails.eventId));
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-surface border border-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative"
              >
                {/* Header block */}
                <div className="p-5 border-b border-border flex items-center justify-between bg-primary/5">
                  <div className="flex items-center gap-2">
                    {activeRegDetails.type === "Team" ? (
                      <Users size={20} className="text-primary animate-pulse" />
                    ) : (
                      <User size={20} className="text-primary animate-pulse" />
                    )}
                    <div>
                      <h3 className="text-lg font-bold text-text-primary leading-none">
                        {activeRegDetails.type === "Team" ? activeRegDetails.teamName : activeRegDetails.name}
                      </h3>
                      <span className="text-[10px] text-text-muted font-mono block mt-1 uppercase">
                        Pass: {activeRegDetails.ticketType} — {activeRegDetails.id}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveRegDetails(null);
                      setIsCopied(false);
                    }}
                    className="text-text-muted hover:text-text-primary transition-colors p-1.5 rounded-lg hover:bg-surface-hover cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-5 max-h-[380px] overflow-y-auto">
                  {activeRegDetails.type === "Team" ? (
                    <>
                      {/* Leader Details Card */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                          Team Leader
                        </span>
                        <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl p-3.5">
                          <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(activeRegDetails.name)}`}
                            alt={activeRegDetails.name}
                            className="w-10 h-10 rounded-full border border-primary/35 shadow-sm"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <p className="text-sm font-bold text-text-primary truncate">{activeRegDetails.name}</p>
                              <span className="px-1.5 py-0.5 text-[8px] bg-primary/20 text-primary border border-primary/30 rounded font-extrabold uppercase tracking-wide">
                                Leader
                              </span>
                            </div>
                            <p className="text-xs text-text-muted truncate mt-0.5">{activeRegDetails.email}</p>
                            <p className="text-[10px] text-text-muted truncate mt-1">College: {activeRegDetails.college}</p>
                          </div>
                        </div>
                      </div>

                      {/* Team Members List */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                          Members ({(activeRegDetails.teamMembers?.length || 0)})
                        </span>
                        <div className="space-y-2">
                          {activeRegDetails.teamMembers && activeRegDetails.teamMembers.length > 0 ? (
                            activeRegDetails.teamMembers.map((member, idx) => {
                              const emailMatch = member.match(/\(([^)]+)\)/);
                              const cleanName = member.replace(/\s*\([^)]+\)/g, "").trim();
                              const memberEmail = emailMatch
                                ? emailMatch[1]
                                : `${cleanName.toLowerCase().replace(/\s+/g, ".")}@example.com`;

                              return (
                                <div
                                  key={idx}
                                  className="flex items-center gap-3 bg-surface/40 border border-border/50 rounded-xl p-3 hover:border-border hover:bg-surface/60 transition-all"
                                >
                                  <img
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanName)}`}
                                    alt={cleanName}
                                    className="w-9 h-9 rounded-full border border-border"
                                  />
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold text-text-primary truncate">{cleanName}</p>
                                    <p className="text-[10px] text-text-muted truncate mt-0.5">{memberEmail}</p>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <p className="text-xs text-text-muted italic py-2">No other members listed.</p>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Individual Details Card */}
                      <div className="flex flex-col items-center text-center py-4 bg-primary/5 border border-primary/20 rounded-2xl p-4">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(activeRegDetails.name)}`}
                          alt={activeRegDetails.name}
                          className="w-16 h-16 rounded-full border-2 border-primary/35 shadow-md mb-3"
                        />
                        <h4 className="text-base font-bold text-text-primary">{activeRegDetails.name}</h4>
                        <span className="px-2.5 py-0.5 text-[9px] bg-primary/10 text-primary border border-primary/20 rounded-full font-bold uppercase tracking-wider mt-1">
                          Individual Attendee
                        </span>
                      </div>

                      {/* Registration Info Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-surface/40 border border-border/50 rounded-xl p-3 min-w-0">
                          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">
                            Email Address
                          </span>
                          <p className="text-xs font-semibold text-text-primary truncate">{activeRegDetails.email}</p>
                        </div>

                        <div className="bg-surface/40 border border-border/50 rounded-xl p-3 min-w-0">
                          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">
                            College / Institution
                          </span>
                          <p className="text-xs font-semibold text-text-primary truncate">{activeRegDetails.college}</p>
                        </div>

                        <div className="bg-surface/40 border border-border/50 rounded-xl p-3 min-w-0">
                          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">
                            Ticket Pass Type
                          </span>
                          <p className="text-xs font-semibold text-text-primary truncate">{activeRegDetails.ticketType}</p>
                        </div>

                        <div className="bg-surface/40 border border-border/50 rounded-xl p-3 min-w-0">
                          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">
                            Associated Event
                          </span>
                          <p className="text-xs font-semibold text-text-primary truncate">
                            {registrationEvent?.title || "Unknown Event"}
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Payment & Ticket Status Action Block */}
                  <div className="bg-surface/40 border border-border/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-0.5">
                        Payment & Ticket Status
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${paymentStyles[activeRegDetails.payment]}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${paymentDots[activeRegDetails.payment]}`} />
                          {activeRegDetails.payment}
                        </span>
                        <span className="text-text-muted text-[11px] font-mono">
                          ({activeRegDetails.payment === "Paid" ? "Access Granted" : activeRegDetails.payment === "Unpaid" ? "Awaiting Payment" : "Revoked"})
                        </span>
                      </div>
                    </div>

                    {/* Quick status updates in modal */}
                    <div className="flex items-center gap-2">
                      {activeRegDetails.payment === "Unpaid" && (
                        <button
                          onClick={async () => {
                            await handlePaymentUpdate(activeRegDetails.id, "Paid");
                            setActiveRegDetails((prev) => (prev ? { ...prev, payment: "Paid" } : null));
                          }}
                          className="px-3 py-1.5 text-xs bg-success/15 hover:bg-success hover:text-white border border-success/35 rounded-lg text-success font-semibold transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle size={12} /> Mark Paid
                        </button>
                      )}
                      {activeRegDetails.payment === "Paid" && (
                        <button
                          onClick={async () => {
                            await handlePaymentUpdate(activeRegDetails.id, "Refunded");
                            setActiveRegDetails((prev) => (prev ? { ...prev, payment: "Refunded" } : null));
                          }}
                          className="px-3 py-1.5 text-xs bg-error/15 hover:bg-error hover:text-white border border-error/35 rounded-lg text-error font-semibold transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <CreditCard size={12} /> Refund Slot
                        </button>
                      )}
                      {activeRegDetails.payment === "Refunded" && (
                        <button
                          onClick={async () => {
                            await handlePaymentUpdate(activeRegDetails.id, "Unpaid");
                            setActiveRegDetails((prev) => (prev ? { ...prev, payment: "Unpaid" } : null));
                          }}
                          className="px-3 py-1.5 text-xs bg-warning/15 hover:bg-warning hover:text-white border border-warning/35 rounded-lg text-warning font-semibold transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Clock size={12} /> Revert Unpaid
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="p-4 border-t border-border flex justify-end gap-3 bg-surface-hover">
                  <button
                    onClick={copyEmails}
                    className="flex items-center gap-1.5 px-4 py-2 bg-surface border border-border rounded-lg text-xs font-semibold hover:bg-surface-hover hover:text-text-primary transition-all text-text-muted cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <Check size={14} className="text-success" /> Email(s) Copied!
                      </>
                    ) : (
                      <>
                        <Clipboard size={14} /> {activeRegDetails.type === "Team" ? "Copy Team Emails" : "Copy Email"}
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setActiveRegDetails(null);
                      setIsCopied(false);
                    }}
                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-bold transition-all hover:shadow-lg hover:shadow-primary/10 active:scale-[0.98] cursor-pointer"
                  >
                    Close Profile
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════════════
          ADD REGISTRATION MODAL
          ════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface border border-border w-full max-w-md rounded-2xl shadow-2xl p-6 relative"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors p-1 rounded-lg hover:bg-surface-hover cursor-pointer"
              >
                <X size={18} />
              </button>
              <div className="mb-5">
                <h2 className="text-xl font-bold text-text-primary">Add Registration</h2>
                <p className="text-xs text-text-muted mt-0.5">Fill in attendee credential vectors.</p>
              </div>

              <form onSubmit={handleAdd} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {/* Select Event dropdown (only shown if not currently in Detail View) */}
                  {!selectedEventId && (
                    <div>
                      <label className="block text-xs font-medium text-text-muted mb-1.5">Select Event</label>
                      <select
                        required
                        value={formData.eventId}
                        onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-sm text-text-primary"
                      >
                        <option value="">Choose event node...</option>
                        {events.map((ev) => (
                          <option key={ev.id} value={ev.id}>
                            {ev.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1.5">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-sm text-text-primary"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1.5">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-sm text-text-primary"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1.5">College</label>
                    <input
                      type="text"
                      required
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-sm text-text-primary"
                      placeholder="MIT"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-text-muted mb-1.5">Type</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-sm text-text-primary"
                      >
                        <option value="Individual">Individual</option>
                        <option value="Team">Team</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-muted mb-1.5">Ticket</label>
                      <select
                        value={formData.ticketType}
                        onChange={(e) => setFormData({ ...formData, ticketType: e.target.value })}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-sm text-text-primary"
                      >
                        <option>Standard</option>
                        <option>VIP Pass</option>
                        <option>Student Pass</option>
                      </select>
                    </div>
                  </div>
                  {formData.type === "Team" && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-text-muted mb-1.5">Team Name</label>
                        <input
                          type="text"
                          required
                          value={formData.teamName}
                          onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-sm text-text-primary"
                          placeholder="Cyber Ninjas"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text-muted mb-1.5">
                          Team Members (comma-separated names/emails)
                        </label>
                        <textarea
                          value={formData.teamMembers}
                          onChange={(e) => setFormData({ ...formData, teamMembers: e.target.value })}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-sm text-text-primary h-20"
                          placeholder="David Miller (david@example.com), Jessica Taylor"
                        />
                      </div>
                    </>
                  )}
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1.5">Payment Status</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Paid", "Unpaid"].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setFormData({ ...formData, payment: opt })}
                          className={`py-2 rounded-lg border text-sm font-medium transition-all ${
                            formData.payment === opt
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border text-text-muted hover:border-border-hover"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-text-muted mt-1.5">
                      {formData.payment === "Paid" ? "✓ Registered status immediately" : "→ Pending Payment status"}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-text-muted hover:text-text-primary text-sm font-medium transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium shadow-md transition-colors neon-glow-sm cursor-pointer"
                  >
                    Add Registration
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
