import { Router } from "express";
import {
  adminLogin,
  getSettings, upsertSetting,
  getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement,
} from "../controllers/adminController.js";

const router = Router();

// Auth
router.post("/auth/login", adminLogin);

// Settings
router.get("/settings", getSettings);
router.post("/settings", upsertSetting);

// Announcements
router.get("/announcements", getAnnouncements);
router.post("/announcements", createAnnouncement);
router.put("/announcements/:id", updateAnnouncement);
router.delete("/announcements/:id", deleteAnnouncement);

export default router;
