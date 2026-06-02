'use strict';

const { Router } = require('express');
const {authenticateToken} = require('../middleware/authMiddleware')
const {
  createTeam,
  sendInvite,
  getInviteByToken,
  confirmMember,
  getTeamStatus,
  finalizeTeam,
} = require('../controllers/hackathonController');

const router = Router();

// POST /api/hackathon/register           — create team + 3 member slots
router.post('/register',authenticateToken,createTeam);

// POST /api/hackathon/invite             — send invite email to one member
router.post('/invite',authenticateToken, sendInvite);

// GET  /api/hackathon/confirm/:token     — member fetches invite details
router.get('/confirm/:token', getInviteByToken);

// POST /api/hackathon/confirm/:token     — member submits details → verified
router.post('/confirm/:token', confirmMember);

// GET  /api/hackathon/team-status/:teamId — poll member verification statuses
router.get('/team-status/:teamId', getTeamStatus);

// POST /api/hackathon/finalize/:teamId   — leader finalises registration
router.post('/finalize/:teamId',authenticateToken, finalizeTeam);

module.exports = router;
