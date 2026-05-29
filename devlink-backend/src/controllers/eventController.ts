import { Request, Response } from "express";
import prisma from "../db/prismaInstance.js";

// ─── GET /api/events ─────────────────────────────────────────────────────────

export const getEvents = async (_req: Request, res: Response): Promise<void> => {
  try {
    const dbEvents = await prisma.event.findMany({
      include: { speakers: true, agenda: true, projects: true, rsvps: true },
    });
    const formatted = dbEvents.map(e => ({
      ...e,
      tags: JSON.parse(e.tags),
      requirements: e.requirements ? JSON.parse(e.requirements) : [],
      images: e.images ? JSON.parse(e.images) : [],
      projects: e.projects.map(p => ({ ...p, contributors: JSON.parse(p.contributors) })),
    }));
    res.json(formatted);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ─── GET /api/events/:id ─────────────────────────────────────────────────────

export const getEventById = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: { speakers: true, agenda: true, projects: true, rsvps: true },
    });
    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }
    const formatted = {
      ...event,
      tags: JSON.parse(event.tags),
      requirements: event.requirements ? JSON.parse(event.requirements) : [],
      images: event.images ? JSON.parse(event.images) : [],
      projects: event.projects.map(p => ({ ...p, contributors: JSON.parse(p.contributors) })),
    };
    res.json(formatted);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ─── POST /api/events ────────────────────────────────────────────────────────

export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      id, title, desc, longDesc, date, month, time,
      location, type, color, tags, capacity,
      requirements, status, speakers, agenda,
    } = req.body;

    const eventId = id || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const event = await prisma.event.create({
      data: {
        id: eventId, title, desc, longDesc, date,
        month: month || "NOV", time, location, type,
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
          data: { eventId: event.id, name: s.name, role: s.role, avatar: s.avatar || "", bio: s.bio || "" },
        });
      }
    }

    if (agenda && Array.isArray(agenda)) {
      for (const a of agenda) {
        await prisma.eventAgenda.create({
          data: { eventId: event.id, time: a.time, title: a.title, description: a.description || "", speaker: a.speaker || "" },
        });
      }
    }

    res.status(201).json(event);
  } catch (error: any) {
    console.error("Create event error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ─── PUT /api/events/:id ─────────────────────────────────────────────────────

export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, desc, longDesc, date, month, time, location, type, color, tags, capacity, requirements, status } = req.body;
    const event = await prisma.event.update({
      where: { id: req.params.id },
      data: {
        title, desc, longDesc, date, month, time, location, type, color,
        tags: tags ? JSON.stringify(tags) : undefined,
        capacity: capacity ? Number(capacity) : undefined,
        requirements: requirements ? JSON.stringify(requirements) : undefined,
        status,
      },
    });
    res.json(event);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ─── DELETE /api/events/:id ──────────────────────────────────────────────────

export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.event.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ─── POST /api/events/:id/rsvp ───────────────────────────────────────────────

export const rsvpEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.body;
    if (!username) {
      res.status(400).json({ error: "Username is required for RSVP" });
      return;
    }

    const user = await prisma.user.findFirst({ where: { username: username.replace("@", "") } });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const event = await prisma.event.findUnique({ where: { id: req.params.id } });
    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

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
    res.json({ registered });
  } catch (error: any) {
    console.error("RSVP error:", error);
    res.status(500).json({ error: error.message });
  }
};
