import { Request, Response } from "express";
import prisma from "../db/prismaInstance.js";

// ─── GET /api/startups ───────────────────────────────────────────────────────

export const getStartups = async (_req: Request, res: Response): Promise<void> => {
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
    res.json(formatted);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ─── POST /api/startups ──────────────────────────────────────────────────────

export const createStartup = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name, tagline, description, sector, stage, raised,
      teamSize, tech, color, logoText,
      founderName, founderAvatar, founderHandle, jobs,
    } = req.body;

    const startup = await prisma.startup.create({
      data: {
        name, tagline, description, sector, stage, raised,
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

    res.status(201).json(startup);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
