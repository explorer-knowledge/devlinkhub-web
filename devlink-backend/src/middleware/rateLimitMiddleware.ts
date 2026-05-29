import { Request, Response, NextFunction } from "express";
import redis, { CacheKeys } from "../db/redisClient.js";

// ─── Generic rate limiter factory ─────────────────────────────────────────────

interface RateLimitOptions {
  keyFn: (req: Request) => string;  // what to rate-limit on
  windowSec: number;                 // rolling window in seconds
  maxRequests: number;               // max requests per window
  message?: string;
}

const createRateLimiter = (opts: RateLimitOptions) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const ip = (req.headers["x-forwarded-for"] as string || req.ip || "unknown").split(",")[0].trim();
    const key = opts.keyFn(req);

    try {
      const current = await redis.incr(key);

      // Set TTL only on the very first request in this window
      if (current === 1) {
        await redis.expire(key, opts.windowSec);
      }

      // Attach informational headers
      res.setHeader("X-RateLimit-Limit", opts.maxRequests);
      res.setHeader("X-RateLimit-Remaining", Math.max(0, opts.maxRequests - current));

      if (current > opts.maxRequests) {
        const ttl = await redis.ttl(key);
        res.setHeader("Retry-After", ttl);
        res.status(429).json({
          error: opts.message || "Too many requests. Please try again later.",
          retryAfter: ttl,
        });
        return;
      }

      next();
    } catch (err) {
      // If Redis is down, fail open (don't block users)
      console.error("Rate limiter Redis error:", err);
      next();
    }
  };
};

// ─── Global IP rate limiter ────────────────────────────────────────────────────
// Applied globally in index.ts: 100 requests per 60 seconds per IP.

const RATE_LIMIT_WINDOW  = Number(process.env.RATE_LIMIT_WINDOW)  || 60;
const RATE_LIMIT_MAX     = Number(process.env.RATE_LIMIT_MAX)      || 100;

export const globalRateLimiter = createRateLimiter({
  keyFn: (req) => {
    const ip = (req.headers["x-forwarded-for"] as string || req.ip || "unknown").split(",")[0].trim();
    return CacheKeys.rateLimitIp(ip);
  },
  windowSec: RATE_LIMIT_WINDOW,
  maxRequests: RATE_LIMIT_MAX,
});

// ─── Auth-specific rate limiter ────────────────────────────────────────────────
// Applied only to POST /login and POST /register: 10 requests per 15 minutes per IP.
// Prevents brute-force login and registration spam.

export const authRateLimiter = createRateLimiter({
  keyFn: (req) => {
    const ip = (req.headers["x-forwarded-for"] as string || req.ip || "unknown").split(",")[0].trim();
    return CacheKeys.rateLimitAuth(ip);
  },
  windowSec: 15 * 60,  // 15 minutes
  maxRequests: 10,
  message: "Too many login attempts. Please try again in 15 minutes.",
});
