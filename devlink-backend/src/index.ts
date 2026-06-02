import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import connectDB from "./db/index.js";
import { globalRateLimiter } from "./middleware/rateLimitMiddleware.js";

// ─── Route Modules ────────────────────────────────────────────────────────────
import authRouter from "./routes/authRoutes.js";
import projectRouter from "./routes/projectRoutes.js";
import startupRouter from "./routes/startupRoutes.js";
import eventRouter from "./routes/eventRoutes.js";
import builderRouter from "./routes/builderRoutes.js";
import inquiryRouter from "./routes/inquiryRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import hackathonRouter from "./routes/hackathonRoutes.js";

// ─── App Bootstrap ────────────────────────────────────────────────────────────

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// ─── Core Middleware ──────────────────────────────────────────────────────────

app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());

// ─── Global Rate Limiter ──────────────────────────────────────────────────────
// 100 requests per 60 seconds per IP. Fails open if Redis is down.

app.use("/api", globalRateLimiter);

// ─── Health Check ─────────────────────────────────────────────────────────────

app.get("/", (_req, res) => {
  res.json({
    message: "Devlink API — Firebase Auth (Email / Google / GitHub)",
    status: "running",
    version: "3.0.0",
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
app.use("/api/hackathon", hackathonRouter);

// ─── Start Server ─────────────────────────────────────────────────────────────

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Devlink API running on http://localhost:${PORT}`);
    console.log(`   Auth    : /api/auth  (sync, profile, logout)`);
    console.log(`   Projects: /api/projects`);
    console.log(`   Startups: /api/startups`);
    console.log(`   Events  : /api/events`);
    console.log(`   Builders: /api/builders`);
    console.log(`   Inquiries: /api/inquiries`);
    console.log(`   Admin   : /api/admin`);
  });
});
