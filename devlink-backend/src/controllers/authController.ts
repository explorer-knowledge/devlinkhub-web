import { Request, Response } from "express";
import prisma from "../db/prismaInstance.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { AuthRequest } from "../middleware/authMiddleware.js";

const JWT_SECRET = process.env.JWT_SECRET || "devlink_secret_signature_key_2026";

// ─── REGISTER ─────────────────────────────────────────────────────────────────

export const RegisterController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, username, password, firstName, lastName, name, role, skills, bio, githubUrl, avatar } = req.body;

    if (!email || !username || !password) {
      res.status(400).json({ error: "Email, username, and password are required" });
      return;
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      res.status(400).json({ error: "Email or username already exists" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        username: String(username).replace("@", ""),
        passwordHash,
        firstName: firstName || null,
        lastName: lastName || null,
        name: name || `${firstName || ""} ${lastName || ""}`.trim() || username,
        provider: "local",
        role: role || "Fullstack Developer",
        skills: skills ? (typeof skills === "string" ? skills : JSON.stringify(skills)) : "[]",
        bio: bio || "",
        githubUrl: githubUrl || "",
        avatar: avatar || (firstName ? firstName.substring(0, 2).toUpperCase() : username.substring(0, 2).toUpperCase()),
      },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "24h" });

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.name,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────

export const LoginController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, username, password } = req.body;

    if ((!email && !username) || !password) {
      res.status(400).json({ error: "Email (or username) and password are required" });
      return;
    }

    // Support login via email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          email ? { email } : undefined,
          username ? { username: String(username).replace("@", "") } : undefined,
        ].filter(Boolean) as any,
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (!user.passwordHash) {
      res.status(400).json({ error: "Please login with your OAuth provider (Google / GitHub)" });
      return;
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "24h" });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.name,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

// ─── PROFILE ──────────────────────────────────────────────────────────────────

export const ProfileController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        name: true,
        role: true,
        bio: true,
        avatar: true,
        githubUrl: true,
        skills: true,
        provider: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ user });
  } catch (error: any) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};
