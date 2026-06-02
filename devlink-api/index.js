const express = require("express");
const cors = require("cors");

const { members } = require("./data/members");
const { events } = require("./data/events");
const { team } = require("./data/team");
const { activity } = require("./data/activity");
const { dashboard } = require("./data/dashboard");
const { registrations } = require("./data/registrations");

const app = express();
const PORT = process.env.PORT || 4000;

// ─── Middleware ─────────────────────────────────────────────────────────────
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// In-memory stores (replace with DB later)
let membersStore = [...members];
let eventsStore = [...events];
let teamStore = [...team];
let activityStore = [...activity];
let registrationsStore = [...registrations];

// ─── Dashboard ──────────────────────────────────────────────────────────────
app.get("/api/dashboard", (req, res) => {
  // 1. Compute total members dynamically (unique emails/names across members & registrations)
  const uniquePeople = new Set();
  membersStore.forEach(m => {
    if (m.email) uniquePeople.add(m.email.toLowerCase());
    else uniquePeople.add(m.name.toLowerCase());
  });
  registrationsStore.forEach(r => {
    if (r.email) uniquePeople.add(r.email.toLowerCase());
    if (r.teamMembers) {
      r.teamMembers.forEach(member => {
        const emailMatch = member.match(/\(([^)]+)\)/);
        if (emailMatch) {
          uniquePeople.add(emailMatch[1].toLowerCase());
        } else {
          uniquePeople.add(member.toLowerCase());
        }
      });
    }
  });
  const totalMembers = uniquePeople.size;

  // 2. Compute total events
  const totalEvents = eventsStore.length;

  // 3. Compute total revenue from all Paid registrations
  const totalRevenue = registrationsStore
    .filter(r => r.payment === "Paid")
    .reduce((acc, r) => {
      const price = r.ticketType === "VIP Pass" ? 150 : r.ticketType === "Student Pass" ? 25 : 50;
      const count = r.type === "Team" ? 1 + (r.teamMembers?.length || 0) : 1;
      return acc + (price * count);
    }, 0);

  // 4. Compute dynamic leaderboard from members database sorted by score
  const leaderboard = [...membersStore]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((member, index) => ({
      rank: index + 1,
      name: member.name,
      score: member.score,
      avatar: member.avatar,
      role: member.role
    }));

  // 5. Compute dynamic upcoming events list from events database
  const upcomingEvents = eventsStore
    .filter(e => e.status !== "Completed")
    .slice(0, 4)
    .map(e => ({
      id: e.id,
      name: e.title,
      date: e.date.replace(/, \d{4}/, ""), // Format to e.g. "Oct 22"
      registrations: e.registered,
      capacity: e.capacity,
      status: e.status
    }));

  // 6. Generate real stats history values ending with current dynamic totals
  const liveStats = {
    totalMembers,
    eventsHosted: totalEvents,
    activePartnerships: 24, // Baseline active partnerships
    totalRevenue,
    memberSpark: [0, 1, 2, 3, 4, 5, totalMembers],
    eventSpark: [0, 1, 2, 3, 4, 5, totalEvents],
    partnerSpark: [28, 26, 27, 25, 26, 25, 24],
    revenueSpark: [0, 100, 200, 300, 400, 500, totalRevenue],
  };

  res.json({
    stats: liveStats,
    leaderboard,
    upcomingEvents,
  });
});

// ─── Members ────────────────────────────────────────────────────────────────
app.get("/api/members", (req, res) => {
  const { search, role } = req.query;
  let result = [...membersStore];

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.skills.some((s) => s.toLowerCase().includes(q))
    );
  }

  if (role && role !== "All") {
    result = result.filter((m) => m.role === role);
  }

  res.json(result);
});

app.post("/api/members", (req, res) => {
  const { name, role, skills, email, github, linkedin } = req.body;
  if (!name || !role) {
    return res.status(400).json({ error: "name and role are required" });
  }
  const newMember = {
    id: Date.now(),
    name,
    role,
    skills: skills || [],
    email: email || "",
    github: github || "#",
    linkedin: linkedin || "#",
    score: 0,
    contributions: 0,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    joinDate: new Date().toLocaleString("en-US", { month: "short", year: "numeric" }),
    online: false,
  };
  membersStore.unshift(newMember);
  res.status(201).json(newMember);
});

app.delete("/api/members/:id", (req, res) => {
  const id = Number(req.params.id);
  membersStore = membersStore.filter((m) => m.id !== id);
  res.json({ success: true });
});

// ─── Events ─────────────────────────────────────────────────────────────────
app.get("/api/events", (req, res) => {
  const { type } = req.query;
  let result = [...eventsStore];
  if (type && type !== "All Types") {
    result = result.filter((e) => e.type === type);
  }
  res.json(result);
});

app.get("/api/events/:id", (req, res) => {
  const id = req.params.id;
  const event = eventsStore.find((e) => String(e.id) === String(id));
  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }
  res.json(event);
});

app.post("/api/events", (req, res) => {
  const { title, type, date, time, venue, capacity, description } = req.body;
  if (!title || !date) {
    return res.status(400).json({ error: "title and date are required" });
  }
  const dateObj = new Date(date);
  const formattedDate =
    dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) !== "Invalid Date"
      ? dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : date;

  const newEvent = {
    id: Date.now(),
    title,
    type: type || "Workshop",
    date: formattedDate,
    time: time || "",
    venue: venue || "",
    capacity: Number(capacity) || 100,
    registered: 0,
    status: "Upcoming",
    description: description || "",
  };
  eventsStore.unshift(newEvent);
  res.status(201).json(newEvent);
});

app.put("/api/events/:id", (req, res) => {
  const id = req.params.id;
  const { title, type, date, time, venue, capacity, description, status } = req.body;

  const eventIndex = eventsStore.findIndex((e) => String(e.id) === String(id));
  if (eventIndex === -1) {
    return res.status(404).json({ error: "Event not found" });
  }

  const event = eventsStore[eventIndex];
  const oldCapacity = event.capacity;
  const newCapacity = capacity !== undefined ? Number(capacity) : oldCapacity;

  event.title = title || event.title;
  event.type = type || event.type;
  if (date) {
    const dateObj = new Date(date);
    event.date =
      dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) !== "Invalid Date"
        ? dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : date;
  }
  event.time = time || event.time;
  event.venue = venue || event.venue;
  event.capacity = newCapacity;
  event.description = description || event.description;

  // Recalculate status based on new capacity
  if (event.registered >= newCapacity) {
    event.status = "Full";
  } else if (status) {
    event.status = status;
  } else if (event.status === "Full") {
    event.status = "Upcoming"; // Restart registration
  }

  eventsStore[eventIndex] = event;
  res.json(event);
});

app.delete("/api/events/:id", (req, res) => {
  const id = req.params.id;
  eventsStore = eventsStore.filter((e) => String(e.id) !== String(id));
  res.json({ success: true });
});

app.post("/api/events/:id/rsvp", (req, res) => {
  const eventId = req.params.id;
  const { username, email, name, college } = req.body;

  const event = eventsStore.find((e) => String(e.id) === String(eventId));
  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }

  // Check if user is already registered for this event
  const existingRegIndex = registrationsStore.findIndex(
    (r) => String(r.eventId) === String(eventId) && r.email === (email || `${username}@example.com`)
  );

  let registered = false;
  if (existingRegIndex >= 0) {
    // Cancel RSVP
    const reg = registrationsStore[existingRegIndex];
    registrationsStore.splice(existingRegIndex, 1);
    
    // Decrease registered count
    event.registered = Math.max(0, event.registered - 1);
    
    // If event status was Full and is now under capacity, reopen registration
    if (event.status === "Full" && event.registered < event.capacity) {
      event.status = "Upcoming";
    }

    // Add activity feed entry
    activityStore.unshift({
      id: Date.now(),
      type: "registration",
      icon: "UserMinus",
      color: "text-warning",
      bg: "bg-warning/10",
      title: "Registration Cancelled",
      desc: `${reg.name} cancelled RSVP for ${event.title}`,
      time: "Just now",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(reg.name)}`,
    });
  } else {
    // Create new RSVP
    if (event.registered >= event.capacity) {
      return res.status(400).json({ error: "Registration is full for this event" });
    }

    const regName = name || username || "Anonymous Builder";
    const newReg = {
      id: `REG-${String(registrationsStore.length + 1).padStart(3, "0")}`,
      name: regName,
      email: email || `${username}@example.com`,
      college: college || "DevLink Guild",
      ticketType: "Standard",
      type: "Individual",
      payment: "Paid",
      eventId: event.id,
    };
    registrationsStore.unshift(newReg);
    
    // Increase registered count
    event.registered += 1;
    
    // Check if full
    if (event.registered >= event.capacity) {
      event.status = "Full";
    }

    // Update activity feed
    activityStore.unshift({
      id: Date.now(),
      type: "registration",
      icon: "UserPlus",
      color: "text-primary",
      bg: "bg-primary/10",
      title: "New RSVP Registration",
      desc: `${regName} registered for ${event.title}`,
      time: "Just now",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(regName)}`,
    });

    registered = true;
  }

  res.json({ registered, eventRegisteredCount: event.registered, eventStatus: event.status });
});

// ─── Team ────────────────────────────────────────────────────────────────────
app.get("/api/team", (req, res) => {
  res.json(teamStore);
});

app.post("/api/team", (req, res) => {
  const { name, role, email, access } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "name and email are required" });
  }
  const newMember = {
    id: Date.now(),
    name,
    role: role || "Member",
    email,
    access: access || "Viewer",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    joinedAt: new Date().toISOString().split("T")[0],
  };
  teamStore.unshift(newMember);
  res.status(201).json(newMember);
});

app.delete("/api/team/:id", (req, res) => {
  const id = Number(req.params.id);
  teamStore = teamStore.filter((m) => m.id !== id);
  res.json({ success: true });
});

// ─── Registrations ──────────────────────────────────────────────────────────
app.get("/api/registrations", (req, res) => {
  const { search, statusFilter, eventId } = req.query;
  let result = [...registrationsStore];

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        (r.college && r.college.toLowerCase().includes(q)) ||
        (r.teamName && r.teamName.toLowerCase().includes(q))
    );
  }

  if (statusFilter && statusFilter !== "All") {
    if (statusFilter === "Approved" || statusFilter === "Paid") {
      result = result.filter((r) => r.payment === "Paid");
    } else if (statusFilter === "Pending" || statusFilter === "Unpaid") {
      result = result.filter((r) => r.payment === "Unpaid");
    } else if (statusFilter === "Rejected" || statusFilter === "Refunded") {
      result = result.filter((r) => r.payment === "Refunded");
    }
  }

  if (eventId && eventId !== "All") {
    result = result.filter((r) => String(r.eventId) === String(eventId));
  }

  res.json(result);
});

app.post("/api/registrations", (req, res) => {
  const { name, email, college, ticketType, type, teamName, teamMembers, payment, eventId } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "name and email are required" });
  }

  // Check if an eventId is specified and increment its registered count
  let targetEvent = null;
  if (eventId) {
    targetEvent = eventsStore.find((e) => String(e.id) === String(eventId));
    if (!targetEvent) {
      return res.status(404).json({ error: "Specified event not found" });
    }
    // Check capacity limit
    if (targetEvent.registered >= targetEvent.capacity) {
      return res.status(400).json({ error: "Registration is closed for this event. Capacity limit reached." });
    }
  }

  const newReg = {
    id: `REG-${String(registrationsStore.length + 1).padStart(3, "0")}`,
    name,
    email,
    college: college || "",
    ticketType: ticketType || "Standard",
    type: type || "Individual",
    payment: payment || "Unpaid",
    teamName: type === "Team" ? (teamName || "") : "",
    teamMembers: type === "Team" ? (teamMembers || []) : [],
    eventId: eventId || "",
  };
  registrationsStore.unshift(newReg);

  if (targetEvent) {
    targetEvent.registered += 1;
    if (targetEvent.registered >= targetEvent.capacity) {
      targetEvent.status = "Full";
    }
  }

  // Update activity feed
  const eventNameStr = targetEvent ? ` for ${targetEvent.title}` : "";
  const newActivity = {
    id: Date.now(),
    type: "registration",
    icon: "UserPlus",
    color: "text-primary",
    bg: "bg-primary/10",
    title: "New Registration",
    desc: `${name} registered${eventNameStr} (${type === "Team" ? `Team: ${teamName}` : "Individual"})`,
    time: "Just now",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
  };
  activityStore.unshift(newActivity);

  res.status(201).json(newReg);
});

app.patch("/api/registrations/:id", (req, res) => {
  const { id } = req.params;
  const { payment } = req.body;
  if (!payment) {
    return res.status(400).json({ error: "payment status is required" });
  }
  
  const regIndex = registrationsStore.findIndex((r) => r.id === id);
  if (regIndex === -1) {
    return res.status(404).json({ error: "Registration not found" });
  }

  const reg = registrationsStore[regIndex];
  const oldPayment = reg.payment;
  reg.payment = payment;

  // Adjust event registration count based on paid vs refunded transitions
  if (reg.eventId) {
    const targetEvent = eventsStore.find((e) => String(e.id) === String(reg.eventId));
    if (targetEvent) {
      if (oldPayment !== "Paid" && payment === "Paid") {
        targetEvent.registered += 1;
        if (targetEvent.registered >= targetEvent.capacity) {
          targetEvent.status = "Full";
        }
      } else if (oldPayment === "Paid" && payment !== "Paid") {
        targetEvent.registered = Math.max(0, targetEvent.registered - 1);
        if (targetEvent.status === "Full" && targetEvent.registered < targetEvent.capacity) {
          targetEvent.status = "Upcoming";
        }
      }
    }
  }

  // Add an activity feed entry
  const regName = reg.name;
  const activityIcon = payment === "Paid" ? "CheckCircle2" : payment === "Refunded" ? "CreditCard" : "Clock";
  const activityColor = payment === "Paid" ? "text-success" : payment === "Refunded" ? "text-error" : "text-warning";
  const activityBg = payment === "Paid" ? "bg-success/10" : payment === "Refunded" ? "bg-error/10" : "bg-warning/10";
  const activityDesc = payment === "Paid" ? `Payment approved for ${regName}` : `Refund issued for ${regName}`;

  activityStore.unshift({
    id: Date.now(),
    type: "payment",
    icon: activityIcon,
    color: activityColor,
    bg: activityBg,
    title: payment === "Paid" ? "Payment Approved" : "Payment Refunded",
    desc: activityDesc,
    time: "Just now",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(regName)}`,
  });

  res.json(reg);
});

app.delete("/api/registrations/:id", (req, res) => {
  const { id } = req.params;
  const reg = registrationsStore.find((r) => r.id === id);
  
  if (reg && reg.eventId) {
    const targetEvent = eventsStore.find((e) => String(e.id) === String(reg.eventId));
    if (targetEvent) {
      targetEvent.registered = Math.max(0, targetEvent.registered - 1);
      if (targetEvent.status === "Full" && targetEvent.registered < targetEvent.capacity) {
        targetEvent.status = "Upcoming";
      }
    }
  }

  registrationsStore = registrationsStore.filter((r) => r.id !== id);
  res.json({ success: true });
});

// ─── Activity ────────────────────────────────────────────────────────────────
app.get("/api/activity", (req, res) => {
  res.json(activityStore.slice(0, 10));
});

// ─── Health ──────────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// ─── Start ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀  DevLink API running at http://localhost:${PORT}`);
  console.log(`   GET  /api/dashboard`);
  console.log(`   GET  /api/members`);
  console.log(`   POST /api/members`);
  console.log(`   GET  /api/events`);
  console.log(`   POST /api/events`);
  console.log(`   GET  /api/team`);
  console.log(`   POST /api/team`);
  console.log(`   GET  /api/registrations`);
  console.log(`   POST /api/registrations`);
  console.log(`   PATCH/api/registrations/:id`);
  console.log(`   GET  /api/activity\n`);
});
