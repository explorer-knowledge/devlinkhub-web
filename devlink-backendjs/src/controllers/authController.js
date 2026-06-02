'use strict';

const prisma = require('../db/prismaClient');
const admin  = require('../config/firebaseAdmin');

// ─── POST /api/auth/sync ──────────────────────────────────────────────────────
// Called by the frontend after every Firebase sign-in (email, Google, GitHub).
// Creates the local DB user on first login, updates metadata on subsequent ones.
// Idempotent — safe to call on every sign-in.

async function SyncController(req, res) {
  try {
    const { uid, email, name, picture } = req.user;

    // Optional extra fields from request body (profile completion step)
    const {
      username,
      role,
      skills,
      bio,
      githubUrl,
      avatar: avatarBody,
      firstName,
      lastName,
      name: nameBody,
    } = req.body;

    let user = await prisma.user.findFirst({ where: { firebaseUid: uid } });

    if (!user) {
      // ── First login — create the user record ───────────────────────────────
      const emailBase       = email ? email.split('@')[0] : uid.slice(0, 8);
      let candidateUsername = username || `${emailBase}_${uid.slice(-4)}`;

      // Make sure the username is unique
      const taken = await prisma.user.findFirst({ where: { username: candidateUsername } });
      if (taken) {
        candidateUsername = `${candidateUsername}_${Math.random().toString(36).slice(2, 6)}`;
      }

      user = await prisma.user.create({
        data: {
          firebaseUid: uid,
          email:       email || `${uid}@firebase.local`,
          username:    candidateUsername,
          name:        nameBody || name || candidateUsername,
          avatar:      avatarBody || picture || null,
          role:        role || 'Fullstack Developer',
          skills:      skills || '[]',
          bio:         bio || '',
          githubUrl:   githubUrl || '',
          firstName:   firstName || null,
          lastName:    lastName || null,
          provider:    'firebase',
        },
      });
    } else {
      // ── Returning user — update only the fields that changed ───────────────
      const updates = {};

      if (username !== user.username) {
        const takenByOther = await prisma.user.findFirst({ where: { username } });
        if (takenByOther && takenByOther.id !== user.id) {
          return res.status(400).json({ error: 'Username is already taken' });
        }
        updates.username = username;
      }
      if (role         !== user.role)      updates.role      = role;
      if (skills    !== user.skills)    updates.skills    = skills;
      if (bio       !== user.bio)       updates.bio       = bio;
      if (githubUrl !== user.githubUrl) updates.githubUrl = githubUrl;
      if (firstName !== user.firstName) updates.firstName = firstName;
      if (lastName  !== user.lastName)  updates.lastName  = lastName;

      // Name: prefer explicit body override, then Firebase display name
      const incomingName = nameBody || name;
      if (incomingName !== user.name) updates.name = incomingName;

      // Avatar: prefer explicit body override, then Firebase photo
      const incomingAvatar = avatarBody || picture;
      if (incomingAvatar !== user.avatar) updates.avatar = incomingAvatar;

      if (Object.keys(updates).length > 0) {
        user = await prisma.user.update({ where: { id: user.id }, data: updates });
      }
    }

    res.json({
      message: 'Sync successful',
      user: {
        id:       user.id,
        email:    user.email,
        username: user.username,
        name:     user.name,
        avatar:   user.avatar,
        role:     user.role,
      },
    });
  } catch (err) {
    console.error('[Auth] Sync error:', err);
    res.status(500).json({ error: err.message || 'Sync failed' });
  }
}

// ─── GET /api/auth/profile ────────────────────────────────────────────────────
// Returns the full local DB user record for the authenticated Firebase user.

async function ProfileController(req, res) {
  try {
    const user = await prisma.user.findFirst({
      where: { firebaseUid: req.user.uid },
      select: {
        id:        true,
        email:     true,
        username:  true,
        name:      true,
        role:      true,
        bio:       true,
        avatar:    true,
        githubUrl: true,
        skills:    true,
        provider:  true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found. Call /api/auth/sync first.' });
    }

    res.json({ user });
  } catch (err) {
    console.error('[Auth] Profile error:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
}

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
// Revokes Firebase refresh tokens so the session cannot be extended beyond
// the current ID token's 1-hour lifetime.

async function LogoutController(req, res) {
  try {
    await admin.auth().revokeRefreshTokens(req.user.uid);
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('[Auth] Logout error:', err);
    res.status(500).json({ error: 'Logout failed' });
  }
}

// ─── GET /api/auth/check-username?username=... ────────────────────────────────
// Public route — returns { available: true/false }

async function CheckUsernameController(req, res) {
  try {
    const { username } = req.query;
    if (!username || typeof username !== 'string') {
      return res.status(400).json({ error: 'username query param is required' });
    }

    const existing = await prisma.user.findFirst({ where: { username } });
    res.json({ available: !existing });
  } catch (err) {
    console.error('[Auth] CheckUsername error:', err);
    res.status(500).json({ error: 'Failed to check username' });
  }
}

module.exports = {
  SyncController,
  ProfileController,
  LogoutController,
  CheckUsernameController,
};
