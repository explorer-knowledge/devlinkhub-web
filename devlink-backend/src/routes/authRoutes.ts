import { Router } from "express";
import { RegisterController, LoginController, ProfileController, LogoutController } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { authRateLimiter } from "../middleware/rateLimitMiddleware.js";
import googleRoutes from "./googleRoutes.js";
import githubRoutes from "./githubRoutes.js";

const router = Router();

// ── OAuth routes ──────────────────────────────────────────────────────────────
router.use("/google", googleRoutes);
router.use("/github", githubRoutes);

// ── Local auth routes ─────────────────────────────────────────────────────────
// authRateLimiter: max 10 requests per IP per 15 minutes on sensitive endpoints
router.post("/register", authRateLimiter, RegisterController);
router.post("/login", authRateLimiter, LoginController);
router.get("/profile", authenticateToken as any, ProfileController as any);
router.post("/logout", authenticateToken as any, LogoutController as any);

export default router;
