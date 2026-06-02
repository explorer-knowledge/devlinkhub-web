import { Request, Response } from "express";
import admin from "../config/firebaseAdmin.js";
import prisma from "../db/prismaInstance.js";
import redis, { redlock, CacheKeys, CACHE_TTL } from "../db/redisClient.js";
import { AuthRequest } from "../middleware/authMiddleware.js";

// ─── SYNC ─────────────────────────────────────────────────────────────────────
// Called by the frontend immediately after any Firebase sign-in (email, Google,
// GitHub). Creates the local Prisma user on first login, then returns the record.
// Idempotent — safe to call on every sign-in.

export const SyncController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.uid) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { uid, email, name, picture } = req.user;
    const { username, role, skills, bio, githubUrl, avatar: avatarBody, firstName, lastName, name: nameBody } = req.body;

    const lockKey = CacheKeys.syncLock(uid);
    let finalUser: any = null;

    // Use Redlock to serialize parallel registration/sync requests for the same user
    await redlock.using([lockKey], 10000, async () => {
      let user = await prisma.user.findFirst({ where: { firebaseUid: uid } });
      let isNew = false;
      let isUpdated = false;

      if (!user) {
        isNew = true;
        // Derive a unique username from email if not provided
        const emailBase = email?.split("@")[0] || uid.slice(0, 8);
        const candidateUsername = username || `${emailBase}_${uid.slice(-4)}`;

        // Ensure username is unique (append random suffix if taken)
        const existingUsername = await prisma.user.findFirst({
          where: { username: candidateUsername },
        });
        const finalUsername = existingUsername
          ? `${candidateUsername}_${Math.random().toString(36).slice(2, 6)}`
          : candidateUsername;

        user = await prisma.user.create({
          data: {
            firebaseUid: uid,
            email: email || `${uid}@firebase.local`,
            username: finalUsername,
            name: nameBody || name || finalUsername,
            avatar: avatarBody || picture || null,
            role: role || "Fullstack Developer",
            skills: skills || "[]",
            bio: bio || "",
            githubUrl: githubUrl || "",
            firstName: firstName || null,
            lastName: lastName || null,
            provider: "firebase",
          },
        });
      } else {
        // User exists. Update metadata if fields are provided in request body and are different
        const updateData: any = {};

        if (username && username !== user.username) {
          const existingUsername = await prisma.user.findFirst({ where: { username } });
          if (existingUsername && existingUsername.id !== user.id) {
            throw Object.assign(new Error("Username is already taken"), { statusCode: 400 });
          }
          updateData.username = username;
          isUpdated = true;
        }

        if (role && role !== user.role) {
          updateData.role = role;
          isUpdated = true;
        }
        if (skills && skills !== user.skills) {
          updateData.skills = skills;
          isUpdated = true;
        }
        if (bio && bio !== user.bio) {
          updateData.bio = bio;
          isUpdated = true;
        }
        if (githubUrl && githubUrl !== user.githubUrl) {
          updateData.githubUrl = githubUrl;
          isUpdated = true;
        }
        if (name && name !== user.name) {
          updateData.name = name;
          isUpdated = true;
        }
        // Accept explicit name override from body (e.g. from profile completion step)
        if (nameBody && nameBody !== user.name) {
          updateData.name = nameBody;
          isUpdated = true;
        }
        // Accept explicit avatar URL from body (separate from Firebase picture)
        if (avatarBody && avatarBody !== user.avatar) {
          updateData.avatar = avatarBody;
          isUpdated = true;
        } else if (picture && picture !== user.avatar) {
          updateData.avatar = picture;
          isUpdated = true;
        }
        if (firstName && firstName !== user.firstName) {
          updateData.firstName = firstName;
          isUpdated = true;
        }
        if (lastName && lastName !== user.lastName) {
          updateData.lastName = lastName;
          isUpdated = true;
        }

        if (isUpdated) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: updateData,
          });
        }
      }

      if (isNew || isUpdated) {
        // Bust builders cache since the builder profiles have changed/added
        await redis.del(CacheKeys.buildersAll()).catch(() => {});
      }

      // Invalidate stale profile cache
      await redis.del(CacheKeys.userProfile(user.id)).catch(() => {});

      finalUser = user;
    });

    res.json({
      message: "Sync successful",
      user: {
        id: finalUser.id,
        email: finalUser.email,
        username: finalUser.username,
        name: finalUser.name,
        avatar: finalUser.avatar,
        role: finalUser.role,
      },
    });
  } catch (error: any) {
    console.error("Sync error:", error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message || "Sync failed" });
  }
};

// ─── PROFILE ──────────────────────────────────────────────────────────────────
// Returns the full Prisma user record. Reads from Redis cache first.

export const ProfileController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.uid) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Look up by Firebase UID
    const dbUser = await prisma.user.findFirst({ where: { firebaseUid: req.user.uid } });
    if (!dbUser) {
      res.status(404).json({ error: "User not found. Call /api/auth/sync first." });
      return;
    }

    const cacheKey = CacheKeys.userProfile(dbUser.id);

    // ── Cache hit ─────────────────────────────────────────────────────────────
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        res.json({ user: JSON.parse(cached), fromCache: true });
        return;
      }
    } catch {}

    // ── Cache miss ────────────────────────────────────────────────────────────
    const user = await prisma.user.findUnique({
      where: { id: dbUser.id },
      select: {
        id: true,
        email: true,
        username: true,
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

    try {
      await redis.setex(cacheKey, CACHE_TTL.PROFILE, JSON.stringify(user));
    } catch {}

    res.json({ user });
  } catch (error: any) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

// ─── LOGOUT ───────────────────────────────────────────────────────────────────
// Revokes all Firebase refresh tokens for the user so existing ID tokens
// stop being renewed after ~1 hour (the max ID token lifetime).

export const LogoutController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.uid) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Revoke Firebase refresh tokens
    await admin.auth().revokeRefreshTokens(req.user.uid);

    // Blacklist the current token in Redis so it cannot be used again before it naturally expires
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token) {
      const blacklistKey = CacheKeys.tokenBlacklist(token);
      // Firebase ID tokens expire in 1 hour (3600 seconds)
      await redis.setex(blacklistKey, 3600, "blacklisted").catch(() => {});
    }

    // Clear user profile cache if we can find the local record
    const dbUser = await prisma.user.findFirst({
      where: { firebaseUid: req.user.uid },
      select: { id: true },
    });
    if (dbUser) {
      await redis.del(CacheKeys.userProfile(dbUser.id)).catch(() => {});
    }

    res.json({ message: "Logged out successfully" });
  } catch (error: any) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Logout failed" });
  }
};

// ─── CHECK USERNAME ───────────────────────────────────────────────────────────
// GET /api/auth/check-username?username=...
// Returns { available: boolean }

export const CheckUsernameController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.query;
    if (!username || typeof username !== "string") {
      res.status(400).json({ error: "Username is required" });
      return;
    }

    const existingUser = await prisma.user.findFirst({
      where: { username },
    });

    res.json({ available: !existingUser });
  } catch (error: any) {
    console.error("Check username error:", error);
    res.status(500).json({ error: "Failed to check username" });
  }
};
