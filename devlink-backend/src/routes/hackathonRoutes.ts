import { Router } from "express";
import {
  createTeam,
  sendInvite,
  getInviteByToken,
  confirmMember,
  getTeamStatus,
  finalizeTeam,
} from "../controllers/hackathonController.js";

const router = Router();

// POST /api/hackathon/register — Create team + member slots
router.post("/register", createTeam as any);

// POST /api/hackathon/invite — Send invite email to one member
router.post("/invite", sendInvite as any);

// GET  /api/hackathon/confirm/:token — Fetch invite info (member confirm page)
router.get("/confirm/:token", getInviteByToken as any);

// POST /api/hackathon/confirm/:token — Member submits details → mark verified
router.post("/confirm/:token", confirmMember as any);

// GET  /api/hackathon/team-status/:teamId — Poll member verification statuses
router.get("/team-status/:teamId", getTeamStatus as any);

// POST /api/hackathon/finalize/:teamId — Leader finalises registration
router.post("/finalize/:teamId", finalizeTeam as any);

export default router;
