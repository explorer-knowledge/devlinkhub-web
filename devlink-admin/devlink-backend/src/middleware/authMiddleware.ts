import { Request, Response, NextFunction } from "express";
import admin from "../config/firebaseAdmin.js";
import redis from "../db/redisClient.js";

// ─── AuthRequest ──────────────────────────────────────────────────────────────

export interface AuthRequest extends Request {
  user?: {
    uid: string;          // Firebase UID
    email?: string;
    name?: string;
    picture?: string;
  };
}

// ─── authenticateToken ────────────────────────────────────────────────────────
// Verifies the Firebase ID token sent in the Authorization: Bearer <token> header.
// On success, attaches the decoded token payload to req.user.

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Authorization token required" });
    return;
  }

  // ─── Check Token Blacklist ─────────────────────────────────────────────────
  try {
    const isBlacklisted = await redis.get(`blacklist:token:${token}`);
    if (isBlacklisted) {
      res.status(401).json({ error: "Token has been revoked/logged out." });
      return;
    }
  } catch (err) {
    console.error("Token blacklist check error:", err);
    // Fail open if Redis is down
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
    };
    next();
  } catch (err: any) {
    console.error("Firebase token verification failed:", err.message);
    res.status(403).json({ error: "Invalid or expired token" });
  }
};
