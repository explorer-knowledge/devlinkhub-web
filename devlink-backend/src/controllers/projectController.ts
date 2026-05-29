import { Request, Response } from "express";
import prisma from "../db/prismaInstance.js";

// ─── GET /api/projects ───────────────────────────────────────────────────────

export const getProjects = async (_req: Request, res: Response): Promise<void> => {
  try {
    const dbProjects = await prisma.project.findMany({
      include: { issues: true, openings: true },
    });
    const formatted = dbProjects.map(p => ({
      ...p,
      tech: JSON.parse(p.tech),
      issues: p.issues.map(i => ({ ...i, tags: JSON.parse(i.tags) })),
    }));
    res.json(formatted);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ─── GET /api/projects/:id ───────────────────────────────────────────────────

export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: { issues: true, openings: true },
    });
    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    const formatted = {
      ...project,
      tech: JSON.parse(project.tech),
      issues: project.issues.map(i => ({ ...i, tags: JSON.parse(i.tags) })),
    };
    res.json(formatted);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ─── POST /api/projects ──────────────────────────────────────────────────────

export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, category, description, longDescription, tech, color, githubUrl, username } = req.body;

    let userId: string | null = null;
    if (username) {
      const user = await prisma.user.findFirst({
        where: { username: username.replace("@", "") },
      });
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

    // Seed default issues and an opening
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

    res.status(201).json(project);
  } catch (error: any) {
    console.error("Create project error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ─── PUT /api/projects/:id ───────────────────────────────────────────────────

export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name, category, description, longDescription,
      tech, color, githubUrl, status, stars, forks, contributors,
    } = req.body;

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
    res.json(project);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ─── DELETE /api/projects/:id ────────────────────────────────────────────────

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
