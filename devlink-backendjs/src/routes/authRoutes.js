'use strict';

const { Router }                 = require('express');
const { authenticateToken }      = require('../middleware/authMiddleware');
const {
  SyncController,
  ProfileController,
  LogoutController,
  CheckUsernameController,
} = require('../controllers/authController');

const router = Router();

// GET  /api/auth/check-username?username=...   — public, check availability
router.get('/check-username', CheckUsernameController);

// POST /api/auth/sync                          — create/update local user from Firebase token
router.post('/sync', authenticateToken, SyncController);

// GET  /api/auth/profile                       — get full profile of logged-in user
router.get('/profile', authenticateToken, ProfileController);

// POST /api/auth/logout                        — revoke Firebase refresh tokens
router.post('/logout', authenticateToken, LogoutController);

module.exports = router;
