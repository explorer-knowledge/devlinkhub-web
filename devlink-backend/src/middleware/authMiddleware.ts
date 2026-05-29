import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { createHash } from "crypto";
import redis, { CacheKeys } from "../db/redisClient.js";

const JWT_SECRET = process.env.JWT_SECRET || "devlink_secret_signature_key_2026";

export interface AuthRequest extends Request {
  user?: { userId: string };
  token?: string;  // raw token, stored for LogoutController to blacklist
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Token required" });
    return;
  }

  // ── 1. Verify JWT signature ─────────────────────────────────────────────────
  let decoded: { userId: string };
  try {
    decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    res.status(403).json({ error: "Invalid token" });
    return;
  }

  // ── 2. Check Redis blacklist (logout invalidation) ──────────────────────────
  try {
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const isBlacklisted = await redis.exists(CacheKeys.tokenBlacklist(tokenHash));
    if (isBlacklisted) {
      res.status(401).json({ error: "Token has been revoked. Please log in again." });
      return;
    }
  } catch (redisErr) {
    // If Redis is down, fail open — don't block legitimate users
    console.error("Auth middleware Redis error:", redisErr);
  }

  req.user = decoded;
  req.token = token;  // pass raw token to LogoutController
  next();
};
