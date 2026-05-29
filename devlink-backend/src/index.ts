import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import RedisStore from "connect-redis";

dotenv.config();

import connectDB from "./db/index.js";
import redis from "./db/redisClient.js";
import { configurePassport } from "./config/passport.js";
import { globalRateLimiter } from "./middleware/rateLimitMiddleware.js";

// ─── Route Modules ────────────────────────────────────────────────────────────
import authRouter from "./routes/authRoutes.js";
import projectRouter from "./routes/projectRoutes.js";
import startupRouter from "./routes/startupRoutes.js";
import eventRouter from "./routes/eventRoutes.js";
import builderRouter from "./routes/builderRoutes.js";
import inquiryRouter from "./routes/inquiryRoutes.js";
import adminRouter from "./routes/adminRoutes.js";

// ─── App Bootstrap ────────────────────────────────────────────────────────────

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// ─── Core Middleware ──────────────────────────────────────────────────────────

const allowedOrigins = [
  FRONTEND_URL,
];


app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

// ─── Redis Session Store ──────────────────────────────────────────────────────
// Replaces the default MemoryStore which leaks memory and loses sessions on restart.
// Sessions are now persisted in Redis and shared across restarts/processes.

const redisStore = new RedisStore({
  client: redis,
  prefix: "session:",
});

app.use(session({
  store: redisStore,
  secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || "devlink_session_secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}));

app.use(passport.initialize());
app.use(passport.session());

// ─── Passport Strategies ──────────────────────────────────────────────────────

configurePassport();

// ─── Global Rate Limiter ──────────────────────────────────────────────────────
// Applied AFTER session/passport middleware, BEFORE all API routes.
// Limit: 100 requests per 60 seconds per IP. Fails open if Redis is down.

app.use("/api", globalRateLimiter);

// ─── Health Check ─────────────────────────────────────────────────────────────

app.get("/", (_req, res) => {
  res.json({
    message: "Devlink API — Login/Signup with OAuth (Google, GitHub) + JWT",
    status: "running",
    version: "2.0.0",
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────

app.use("/api/auth", authRouter);
app.use("/api/projects", projectRouter);
app.use("/api/startups", startupRouter);
app.use("/api/events", eventRouter);
app.use("/api/builders", builderRouter);
app.use("/api/inquiries", inquiryRouter);
app.use("/api/admin", adminRouter);

// ─── Start Server ─────────────────────────────────────────────────────────────

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Devlink API running on http://localhost:${PORT}`);
    console.log(`   Auth    : /api/auth  (register, login, logout, profile, google, github)`);
    console.log(`   Projects: /api/projects`);
    console.log(`   Startups: /api/startups`);
    console.log(`   Events  : /api/events`);
    console.log(`   Builders: /api/builders`);
    console.log(`   Inquiries: /api/inquiries`);
    console.log(`   Admin   : /api/admin  (auth/login, settings, announcements)`);
  });
});
