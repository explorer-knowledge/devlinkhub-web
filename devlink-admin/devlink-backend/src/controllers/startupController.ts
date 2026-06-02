import { Request, Response } from "express";
import prisma from "../db/prismaInstance.js";
import redis, { CacheKeys, CACHE_TTL } from "../db/redisClient.js";

// ─── GET /api/startups ───────────────────────────────────────────────────────

export const getStartups = async (_req: Request, res: Response): Promise<void> => {
  const cacheKey = CacheKeys.startupsAll();

  try {
    const cached = await redis.get(cacheKey);
    if (cached) { res.json(JSON.parse(cached)); return; }
  } catch (err) { console.error("Startups cache read error:", err); }

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

    await redis.setex(cacheKey, CACHE_TTL.STARTUPS, JSON.stringify(formatted)).catch(() => {});
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

    // Invalidate list cache
    await redis.del(CacheKeys.startupsAll()).catch(() => {});

    res.status(201).json(startup);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
