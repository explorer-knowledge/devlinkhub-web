import { Request, Response } from "express";
import prisma from "../db/prismaInstance.js";
import admin from "../config/firebaseAdmin.js";

// ─── POST /api/admin/auth/login ───────────────────────────────────────────────
// Expects: Authorization: Bearer <Firebase ID token>
// The Firebase user must have role=Administrator in the local DB.

export const adminLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers["authorization"];
    const idToken = authHeader && authHeader.split(" ")[1];

    if (!idToken) {
      res.status(401).json({ error: "Firebase ID token required in Authorization header." });
      return;
    }

    // Verify the Firebase token
    const decoded = await admin.auth().verifyIdToken(idToken);

    // Find the local user by Firebase UID
    const user = await prisma.user.findFirst({ where: { firebaseUid: decoded.uid } });

    if (!user || user.role !== "Administrator") {
      res.status(403).json({ error: "Forbidden. Admin role required." });
      return;
    }

    res.json({
      success: true,
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
    });
  } catch (error: any) {
    console.error("Admin login error:", error.message);
    res.status(401).json({ error: "Invalid or expired token." });
  }
};

// ─── GET /api/admin/settings ─────────────────────────────────────────────────

export const getSettings = async (_req: Request, res: Response): Promise<void> => {
  try {
    const allSettings = await prisma.adminSetting.findMany();
    const map: Record<string, any> = {};
    allSettings.forEach(s => { map[s.key] = JSON.parse(s.value); });
    res.json(map);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ─── POST /api/admin/settings ────────────────────────────────────────────────

export const upsertSetting = async (req: Request, res: Response): Promise<void> => {
  try {
    const { key, value } = req.body;
    const setting = await prisma.adminSetting.upsert({
      where: { key },
      update: { value: JSON.stringify(value) },
      create: { key, value: JSON.stringify(value) },
    });
    res.json({ success: true, setting: { key, value: JSON.parse(setting.value) } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ─── GET /api/admin/announcements ────────────────────────────────────────────

export const getAnnouncements = async (_req: Request, res: Response): Promise<void> => {
  try {
    const announcements = await prisma.announcement.findMany({ orderBy: { timestamp: "desc" } });
    res.json(announcements);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ─── POST /api/admin/announcements ───────────────────────────────────────────

export const createAnnouncement = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, message, status, active } = req.body;
    if (active) {
      await prisma.announcement.updateMany({ where: { active: true }, data: { active: false } });
    }
    const announcement = await prisma.announcement.create({
      data: { title, message, status: status || "draft", active: active || false },
    });
    res.status(201).json(announcement);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ─── PUT /api/admin/announcements/:id ────────────────────────────────────────

export const updateAnnouncement = async (req: Request, res: Response): Promise<void> => {
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
    res.json(announcement);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ─── DELETE /api/admin/announcements/:id ─────────────────────────────────────

export const deleteAnnouncement = async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.announcement.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
