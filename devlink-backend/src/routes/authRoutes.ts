import { Router } from "express";
import { RegisterController, LoginController, ProfileController } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import googleRoutes from "./googleRoutes.js";
import githubRoutes from "./githubRoutes.js";

const router = Router();

// ── OAuth routes ──────────────────────────────────────────────────────────────
router.use("/google", googleRoutes);
router.use("/github", githubRoutes);

// ── Local auth routes ─────────────────────────────────────────────────────────
router.post("/register", RegisterController);
router.post("/login", LoginController);
router.get("/profile", authenticateToken as any, ProfileController as any);

export default router;
