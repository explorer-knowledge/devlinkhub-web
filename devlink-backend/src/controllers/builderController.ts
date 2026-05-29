import { Request, Response } from "express";
import prisma from "../db/prismaInstance.js";
import redis, { CacheKeys, CACHE_TTL } from "../db/redisClient.js";

// ─── GET /api/builders ───────────────────────────────────────────────────────

export const getBuilders = async (_req: Request, res: Response): Promise<void> => {
  const cacheKey = CacheKeys.buildersAll();

  try {
    const cached = await redis.get(cacheKey);
    if (cached) { res.json(JSON.parse(cached)); return; }
  } catch (err) { console.error("Builders cache read error:", err); }

  try {
    const dbUsers = await prisma.user.findMany({
      where: { NOT: { role: "Administrator" } },
    });

    const formatted = dbUsers.map((u, idx) => ({
      name: u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.username,
      role: u.role,
      avatar: u.avatar || (u.name || u.username || "U").substring(0, 2).toUpperCase(),
      bio: u.bio || "Developer profile on the Devlink network.",
      skills: JSON.parse(u.skills || "[]"),
      status: idx % 2 === 0 ? "Available" : "Active",
      matchScore: 90 - idx * 3,
      projectSpecs: { title: "Incubating Core Projects", equity: "2% - 5%", commitment: "20 hrs/wk" },
      socials: { github: u.githubUrl || "https://github.com", linkedin: "https://linkedin.com" },
    }));

    await redis.setex(cacheKey, CACHE_TTL.BUILDERS, JSON.stringify(formatted)).catch(() => {});
    res.json(formatted);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
