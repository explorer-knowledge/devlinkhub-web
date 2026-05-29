import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";

dotenv.config();

import connectDB from "./db/index.js";
import { configurePassport } from "./config/passport.js";

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
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// ─── Core Middleware ──────────────────────────────────────────────────────────

app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());

// Session (required by passport OAuth flows)
app.use(session({
  secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || "devlink_session_secret",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === "production" },
}));

app.use(passport.initialize());
app.use(passport.session());

// ─── Passport Strategies ──────────────────────────────────────────────────────

configurePassport();

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
    console.log(`   Auth    : /api/auth  (register, login, profile, google, github)`);
    console.log(`   Projects: /api/projects`);
    console.log(`   Startups: /api/startups`);
    console.log(`   Events  : /api/events`);
    console.log(`   Builders: /api/builders`);
    console.log(`   Inquiries: /api/inquiries`);
    console.log(`   Admin   : /api/admin  (auth/login, settings, announcements)`);
  });
});
