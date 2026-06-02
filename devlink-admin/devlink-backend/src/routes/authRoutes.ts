import { Router } from "express";
import { SyncController, ProfileController, LogoutController, CheckUsernameController } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

// GET /api/auth/check-username
// Public route to check if a username is available.
router.get("/check-username", CheckUsernameController as any);

// POST /api/auth/sync
// Called by frontend after every Firebase sign-in to create/update the local user record.
router.post("/sync", authenticateToken as any, SyncController as any);

// GET /api/auth/profile
// Returns the full local Prisma user record for the authenticated Firebase user.
router.get("/profile", authenticateToken as any, ProfileController as any);

// POST /api/auth/logout
// Revokes Firebase refresh tokens so the session cannot be extended.
router.post("/logout", authenticateToken as any, LogoutController as any);

export default router;
