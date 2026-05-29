import Redis from "ioredis";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore — redlock ships its own types but tsc can't resolve them without moduleResolution bundler
import Redlock from "redlock";

// ─── Redis Singleton ──────────────────────────────────────────────────────────
// Mirrors the pattern of prismaInstance.ts — one shared client for the whole app.

const redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379", {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  lazyConnect: false,
});

redis.on("connect", () => {
  console.log("✅ Redis connected");
});

redis.on("error", (err) => {
  console.error("❌ Redis connection error:", err.message);
});

redis.on("reconnecting", () => {
  console.warn("⚠️  Redis reconnecting...");
});

// ─── Redlock Instance (for distributed locking) ───────────────────────────────
// Used by eventController → rsvpEvent to prevent RSVP race conditions.
export const redlock = new Redlock([redis], {
  driftFactor: 0.01,    // clock drift compensation
  retryCount: 5,        // retry acquiring lock up to 5 times
  retryDelay: 200,      // wait 200ms between retries
  retryJitter: 100,     // ±100ms jitter to prevent thundering herd
  automaticExtensionThreshold: 500,
});

redlock.on("error", (err: Error) => {
  // Only log if it's not a lock contention error (those are expected)
  if (!err.message.includes("The operation was unable to achieve a quorum")) {
    console.error("Redlock error:", err.message);
  }
});

// ─── Cache TTLs (seconds) ─────────────────────────────────────────────────────
export const CACHE_TTL = {
  EVENTS: Number(process.env.CACHE_TTL_EVENTS)    || 300,  // 5 min
  PROJECTS: Number(process.env.CACHE_TTL_PROJECTS) || 300,  // 5 min
  STARTUPS: Number(process.env.CACHE_TTL_STARTUPS) || 300,  // 5 min
  BUILDERS: Number(process.env.CACHE_TTL_BUILDERS) || 600,  // 10 min
  PROFILE: Number(process.env.CACHE_TTL_PROFILE)   || 600,  // 10 min
} as const;

// ─── Cache Key Namespace Helpers ──────────────────────────────────────────────
export const CacheKeys = {
  eventsAll:       () => "cache:events:all",
  eventById:       (id: string) => `cache:events:${id}`,
  projectsAll:     () => "cache:projects:all",
  projectById:     (id: string) => `cache:projects:${id}`,
  startupsAll:     () => "cache:startups:all",
  buildersAll:     () => "cache:builders:all",
  userProfile:     (userId: string) => `cache:user:${userId}`,
  tokenBlacklist:  (hash: string) => `blacklist:token:${hash}`,
  rsvpLock:        (eventId: string) => `rsvp:lock:${eventId}`,
  rateLimitIp:     (ip: string) => `ratelimit:ip:${ip}`,
  rateLimitAuth:   (ip: string) => `ratelimit:auth:${ip}`,
} as const;

export default redis;
