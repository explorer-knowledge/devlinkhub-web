import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "devlink_secret_signature_key_2026";

// Middleware
app.use(cors({ origin: "*" })); // Allow all origins for local testing convenience
app.use(express.json());

// Helper function to verify token (optional, stubs can bypass)
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access token required" });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
};

// ─── AUTHENTICATION ENDPOINTS ───────────────────────────────────────

app.post("/api/auth/register", async (req: any, res: any) => {
  try {
    const { name, username, email, password, role, skills, bio, githubUrl, avatar } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Username, email, and password are required" });
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (existingUser) {
      return res.status(400).json({ error: "Email or username already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name: name || username,
        username: username.replace("@", ""),
        email,
        passwordHash,
        role: role || "Fullstack Developer",
        skills: skills ? (typeof skills === "string" ? skills : JSON.stringify(skills)) : "[]",
        bio: bio || "",
        githubUrl: githubUrl || "",
        avatar: avatar || (name ? name.substring(0, 2).toUpperCase() : "U"),
      },
    });

    const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, JWT_SECRET);
    return res.status(201).json({ token, user: { id: user.id, name: user.name, username: user.username, email: user.email } });
  } catch (error: any) {
    console.error("Register error:", error);
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/auth/login", async (req: any, res: any) => {
  try {
    const { username, password, email } = req.body;
    
    // Support login via email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          email ? { email } : undefined,
          username ? { username: username.replace("@", "") } : undefined
        ].filter(Boolean) as any
      }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // If password is provided, verify it. If mock credentials bypass password check, allow it.
    if (password) {
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, JWT_SECRET);
    return res.json({ token, user: { id: user.id, name: user.name, username: user.username, email: user.email } });
  } catch (error: any) {
    console.error("Login error:", error);
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/admin/auth/login", async (req: any, res: any) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user || user.role !== "Administrator") {
      return res.status(401).json({ error: "Unauthorized. Admin credentials required." });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user.id, username: user.username, email: user.email, isAdmin: true }, JWT_SECRET);
    return res.json({ token, success: true });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ─── PROJECTS ENDPOINTS ─────────────────────────────────────────────

app.get("/api/projects", async (req: any, res: any) => {
  try {
    const dbProjects = await prisma.project.findMany({
      include: {
        issues: true,
        openings: true,
      },
    });

    // Format fields correctly for the frontend (parse JSON strings)
    const formatted = dbProjects.map(p => ({
      ...p,
      tech: JSON.parse(p.tech),
      issues: p.issues.map(i => ({ ...i, tags: JSON.parse(i.tags) })),
    }));

    return res.json(formatted);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/api/projects/:id", async (req: any, res: any) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: { issues: true, openings: true },
    });

    if (!project) return res.status(404).json({ error: "Project not found" });

    const formatted = {
      ...project,
      tech: JSON.parse(project.tech),
      issues: project.issues.map(i => ({ ...i, tags: JSON.parse(i.tags) })),
    };

    return res.json(formatted);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/projects", async (req: any, res: any) => {
  try {
    const { name, category, description, longDescription, tech, color, githubUrl, username } = req.body;
    
    // Find creator user if username is passed
    let userId = null;
    if (username) {
      const user = await prisma.user.findFirst({ where: { username: username.replace("@", "") } });
      if (user) userId = user.id;
    }

    const project = await prisma.project.create({
      data: {
        name,
        category,
        description,
        longDescription: longDescription || description,
        tech: JSON.stringify(tech || []),
        color: color || "#00F0FF",
        githubUrl: githubUrl || "",
        userId,
        stars: 1,
        forks: 0,
        contributors: 1,
      },
    });

    // Create default issues and openings to match the frontend mock behavior
    await prisma.projectIssue.create({
      data: {
        projectId: project.id,
        title: "Setup codebase diagnostics pipeline",
        difficulty: "Easy",
        tags: JSON.stringify(tech ? tech.slice(0, 2) : []),
      },
    });

    await prisma.projectIssue.create({
      data: {
        projectId: project.id,
        title: "Optimize entry handler algorithms",
        difficulty: "Medium",
        tags: JSON.stringify(tech ? tech.slice(0, 3) : []),
      },
    });

    await prisma.projectOpening.create({
      data: {
        projectId: project.id,
        role: "Founding Collaborator",
        commitment: "10 hrs/wk",
        equity: "3% - 6%",
      },
    });

    return res.status(201).json(project);
  } catch (error: any) {
    console.error("Create project error:", error);
    return res.status(500).json({ error: error.message });
  }
});

app.put("/api/projects/:id", async (req: any, res: any) => {
  try {
    const { name, category, description, longDescription, tech, color, githubUrl, status, stars, forks, contributors } = req.body;
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        name,
        category,
        description,
        longDescription,
        tech: tech ? JSON.stringify(tech) : undefined,
        color,
        githubUrl,
        status,
        stars: stars ? Number(stars) : undefined,
        forks: forks ? Number(forks) : undefined,
        contributors: contributors ? Number(contributors) : undefined,
      },
    });
    return res.json(project);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.delete("/api/projects/:id", async (req: any, res: any) => {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    return res.json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ─── STARTUPS ENDPOINTS ─────────────────────────────────────────────

app.get("/api/startups", async (req: any, res: any) => {
  try {
    const dbStartups = await prisma.startup.findMany({ include: { jobs: true } });
    const formatted = dbStartups.map(s => ({
      ...s,
      tech: JSON.parse(s.tech),
      founder: {
        name: s.founderName,
        avatar: s.founderAvatar,
        handle: s.founderHandle,
      },
    }));
    return res.json(formatted);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/startups", async (req: any, res: any) => {
  try {
    const { name, tagline, description, sector, stage, raised, teamSize, tech, color, logoText, founderName, founderAvatar, founderHandle, jobs } = req.body;
    const startup = await prisma.startup.create({
      data: {
        name,
        tagline,
        description,
        sector,
        stage,
        raised,
        teamSize: Number(teamSize || 1),
        tech: JSON.stringify(tech || []),
        color: color || "#00F0FF",
        logoText: logoText || "",
        founderName: founderName || "",
        founderAvatar: founderAvatar || "",
        founderHandle: founderHandle || "",
      },
    });

    if (jobs && Array.isArray(jobs)) {
      for (const j of jobs) {
        await prisma.startupJob.create({
          data: {
            startupId: startup.id,
            role: j.role,
            salary: j.salary,
            equity: j.equity,
            type: j.type,
          },
        });
      }
    }

    return res.status(201).json(startup);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ─── EVENTS ENDPOINTS ───────────────────────────────────────────────

app.get("/api/events", async (req: any, res: any) => {
  try {
    const dbEvents = await prisma.event.findMany({
      include: { speakers: true, agenda: true, projects: true, rsvps: true },
    });

    const formatted = dbEvents.map(e => ({
      ...e,
      tags: JSON.parse(e.tags),
      requirements: e.requirements ? JSON.parse(e.requirements) : [],
      images: e.images ? JSON.parse(e.images) : [],
      speakers: e.speakers,
      agenda: e.agenda,
      projects: e.projects.map(p => ({ ...p, contributors: JSON.parse(p.contributors) })),
      rsvps: e.rsvps,
    }));

    return res.json(formatted);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/api/events/:id", async (req: any, res: any) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: { speakers: true, agenda: true, projects: true, rsvps: true },
    });

    if (!event) return res.status(404).json({ error: "Event not found" });

    const formatted = {
      ...event,
      tags: JSON.parse(event.tags),
      requirements: event.requirements ? JSON.parse(event.requirements) : [],
      images: event.images ? JSON.parse(event.images) : [],
      speakers: event.speakers,
      agenda: event.agenda,
      projects: event.projects.map(p => ({ ...p, contributors: JSON.parse(p.contributors) })),
      rsvps: event.rsvps,
    };

    return res.json(formatted);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/events", async (req: any, res: any) => {
  try {
    const { id, title, desc, longDesc, date, month, time, location, type, color, tags, capacity, requirements, status, speakers, agenda } = req.body;
    
    const eventId = id || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    
    const event = await prisma.event.create({
      data: {
        id: eventId,
        title,
        desc,
        longDesc,
        date,
        month: month || "NOV",
        time,
        location,
        type,
        color: color || "#FF1CF7",
        tags: JSON.stringify(tags || []),
        capacity: Number(capacity || 100),
        requirements: JSON.stringify(requirements || []),
        status: status || "open",
      },
    });

    if (speakers && Array.isArray(speakers)) {
      for (const s of speakers) {
        await prisma.eventSpeaker.create({
          data: {
            eventId: event.id,
            name: s.name,
            role: s.role,
            avatar: s.avatar || "",
            bio: s.bio || "",
          },
        });
      }
    }

    if (agenda && Array.isArray(agenda)) {
      for (const a of agenda) {
        await prisma.eventAgenda.create({
          data: {
            eventId: event.id,
            time: a.time,
            title: a.title,
            description: a.description || "",
            speaker: a.speaker || "",
          },
        });
      }
    }

    return res.status(201).json(event);
  } catch (error: any) {
    console.error("Create event error:", error);
    return res.status(500).json({ error: error.message });
  }
});

app.put("/api/events/:id", async (req: any, res: any) => {
  try {
    const { title, desc, longDesc, date, month, time, location, type, color, tags, capacity, requirements, status } = req.body;
    
    const event = await prisma.event.update({
      where: { id: req.params.id },
      data: {
        title,
        desc,
        longDesc,
        date,
        month,
        time,
        location,
        type,
        color,
        tags: tags ? JSON.stringify(tags) : undefined,
        capacity: capacity ? Number(capacity) : undefined,
        requirements: requirements ? JSON.stringify(requirements) : undefined,
        status,
      },
    });
    return res.json(event);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.delete("/api/events/:id", async (req: any, res: any) => {
  try {
    await prisma.event.delete({ where: { id: req.params.id } });
    return res.json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/events/:id/rsvp", async (req: any, res: any) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: "Username is required for RSVP handshake" });

    const user = await prisma.user.findFirst({ where: { username: username.replace("@", "") } });
    if (!user) return res.status(404).json({ error: "Builder session not found" });

    const event = await prisma.event.findUnique({ where: { id: req.params.id } });
    if (!event) return res.status(404).json({ error: "Event node not found" });

    const existingRsvp = await prisma.eventRSVP.findUnique({
      where: { userId_eventId: { userId: user.id, eventId: event.id } },
    });

    let registered = false;
    if (existingRsvp) {
      await prisma.eventRSVP.delete({ where: { id: existingRsvp.id } });
    } else {
      await prisma.eventRSVP.create({ data: { userId: user.id, eventId: event.id } });
      registered = true;
    }

    return res.json({ registered });
  } catch (error: any) {
    console.error("RSVP error:", error);
    return res.status(500).json({ error: error.message });
  }
});

// ─── BUILDERS (COMMUNITY MEMBERS) ENDPOINTS ─────────────────────────

app.get("/api/builders", async (req: any, res: any) => {
  try {
    const dbUsers = await prisma.user.findMany({
      where: { NOT: { role: "Administrator" } }
    });
    
    // Format to match the builder matcher records expected by frontend
    const formatted = dbUsers.map((u, idx) => ({
      name: u.name,
      role: u.role,
      avatar: u.avatar || u.name.substring(0, 2).toUpperCase(),
      bio: u.bio || `Developer profile syncing on Devlink network.`,
      skills: JSON.parse(u.skills || "[]"),
      status: idx % 2 === 0 ? "Available" : "Active",
      matchScore: 90 - (idx * 3),
      projectSpecs: {
        title: "Incubating Core Projects",
        equity: "2% - 5%",
        commitment: "20 hrs/wk",
      },
      socials: {
        github: u.githubUrl || "https://github.com",
        linkedin: "https://linkedin.com",
      },
    }));
    
    return res.json(formatted);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ─── INQUIRIES ENDPOINTS ────────────────────────────────────────────

app.get("/api/inquiries", async (req: any, res: any) => {
  try {
    const dbInquiries = await prisma.inquiry.findMany({
      include: { replies: true },
      orderBy: { timestamp: "desc" },
    });
    return res.json(dbInquiries);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/api/inquiries/:id", async (req: any, res: any) => {
  try {
    const inquiry = await prisma.inquiry.findUnique({
      where: { id: req.params.id },
      include: { replies: true },
    });
    if (!inquiry) return res.status(404).json({ error: "Inquiry not found" });
    return res.json(inquiry);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/inquiries", async (req: any, res: any) => {
  try {
    const { name, email, category, subject, message, organization } = req.body;
    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        category: category.toUpperCase(),
        subject: subject || `${category} Inquiry`,
        message,
        organization: organization || "",
        status: "New",
      },
    });
    return res.status(201).json(inquiry);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.put("/api/inquiries/:id/status", async (req: any, res: any) => {
  try {
    const { status } = req.body;
    const inquiry = await prisma.inquiry.update({
      where: { id: req.params.id },
      data: { status },
    });
    return res.json(inquiry);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/inquiries/:id/reply", async (req: any, res: any) => {
  try {
    const { sender, text } = req.body;
    const reply = await prisma.inquiryReply.create({
      data: {
        inquiryId: req.params.id,
        sender,
        text,
      },
    });
    return res.status(201).json(reply);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.delete("/api/inquiries/:id", async (req: any, res: any) => {
  try {
    await prisma.inquiry.delete({ where: { id: req.params.id } });
    return res.json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ─── ADMIN CONFIGURATION SETTINGS ENDPOINTS ─────────────────────────

app.get("/api/admin/settings", async (req: any, res: any) => {
  try {
    const allSettings = await prisma.adminSetting.findMany();
    // Return key-value object map
    const map: Record<string, any> = {};
    allSettings.forEach(s => {
      map[s.key] = JSON.parse(s.value);
    });
    return res.json(map);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/admin/settings", async (req: any, res: any) => {
  try {
    const { key, value } = req.body;
    
    const setting = await prisma.adminSetting.upsert({
      where: { key },
      update: { value: JSON.stringify(value) },
      create: { key, value: JSON.stringify(value) },
    });
    
    return res.json({ success: true, setting: { key, value: JSON.parse(setting.value) } });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/api/admin/announcements", async (req: any, res: any) => {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { timestamp: "desc" },
    });
    return res.json(announcements);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/admin/announcements", async (req: any, res: any) => {
  try {
    const { title, message, status, active } = req.body;
    
    // If setting active to true, turn off other active announcements
    if (active) {
      await prisma.announcement.updateMany({
        where: { active: true },
        data: { active: false },
      });
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        message,
        status: status || "draft",
        active: active || false,
      },
    });
    return res.status(201).json(announcement);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.put("/api/admin/announcements/:id", async (req: any, res: any) => {
  try {
    const { title, message, status, active } = req.body;
    
    if (active) {
      await prisma.announcement.updateMany({
        where: { active: true, NOT: { id: req.params.id } },
        data: { active: false },
      });
    }

    const announcement = await prisma.announcement.update({
      where: { id: req.params.id },
      data: { title, message, status, active },
    });
    return res.json(announcement);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.delete("/api/admin/announcements/:id", async (req: any, res: any) => {
  try {
    await prisma.announcement.delete({ where: { id: req.params.id } });
    return res.json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Start listening
app.listen(PORT, () => {
  console.log(`🚀 Devlink central node API listening on http://localhost:${PORT}`);
});
