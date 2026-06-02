import { Request, Response } from "express";
import prisma from "../db/prismaInstance.js";
import { sendHackathonInvite } from "../config/mailer.js";

// ─── POST /api/hackathon/register ─────────────────────────────────────────────
// Creates the team with leader details + 3 member slots, returns team id.
// Does NOT mark as "registered" yet — that happens once all 3 members verify.

export const createTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teamName, leaderName, leaderEmail, leaderPhone, leaderCollege, memberEmails } = req.body;

    if (!teamName || !leaderName || !leaderEmail || !leaderPhone || !leaderCollege) {
      res.status(400).json({ error: "All leader fields are required." });
      return;
    }

    if (!Array.isArray(memberEmails) || memberEmails.length !== 3) {
      res.status(400).json({ error: "Exactly 3 member emails are required." });
      return;
    }

    const team = await prisma.hackathonTeam.create({
      data: {
        teamName,
        leaderName,
        leaderEmail,
        leaderPhone,
        leaderCollege,
        status: "pending",
        members: {
          create: memberEmails.map((email: string) => ({ email, status: "pending" })),
        },
      },
      include: { members: true },
    });

    res.status(201).json({ success: true, team });
  } catch (error: any) {
    console.error("[Hackathon] createTeam error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// ─── POST /api/hackathon/invite ───────────────────────────────────────────────
// Sends invite email to a specific member. Called per-member from the frontend.
// Body: { memberId }

export const sendInvite = async (req: Request, res: Response): Promise<void> => {
  try {
    const { memberId } = req.body;

    if (!memberId) {
      res.status(400).json({ error: "memberId is required." });
      return;
    }

    const member = await prisma.hackathonMember.findUnique({
      where: { id: memberId },
      include: { team: true },
    });

    if (!member) {
      res.status(404).json({ error: "Member not found." });
      return;
    }

    // Send invite email
    await sendHackathonInvite({
      toEmail: member.email,
      teamName: member.team.teamName,
      leaderName: member.team.leaderName,
      confirmToken: member.inviteToken,
    });

    res.json({ success: true, message: `Invite sent to ${member.email}` });
  } catch (error: any) {
    console.error("[Hackathon] sendInvite error:", error.message);
    // Still return 200 so UI can show "invite sent" even if email fails in dev
    res.status(500).json({ error: `Failed to send invite: ${error.message}` });
  }
};

// ─── GET /api/hackathon/confirm/:token ────────────────────────────────────────
// Member opens this to see their invite details before filling the form.

export const getInviteByToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;

    const member = await prisma.hackathonMember.findUnique({
      where: { inviteToken: token },
      include: { team: { select: { teamName: true, leaderName: true } } },
    });

    if (!member) {
      res.status(404).json({ error: "Invalid or expired invite link." });
      return;
    }

    if (member.status === "verified") {
      res.json({ alreadyVerified: true, member });
      return;
    }

    res.json({
      alreadyVerified: false,
      member: {
        id: member.id,
        email: member.email,
        status: member.status,
        teamName: member.team.teamName,
        leaderName: member.team.leaderName,
      },
    });
  } catch (error: any) {
    console.error("[Hackathon] getInviteByToken error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// ─── POST /api/hackathon/confirm/:token ──────────────────────────────────────
// Member submits their details. Marks member as verified.
// If all 3 members are verified, marks team as registered.

export const confirmMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;
    const { name, phone, college } = req.body;

    if (!name || !phone || !college) {
      res.status(400).json({ error: "Name, phone, and college are required." });
      return;
    }

    const member = await prisma.hackathonMember.findUnique({
      where: { inviteToken: token },
    });

    if (!member) {
      res.status(404).json({ error: "Invalid invite token." });
      return;
    }

    if (member.status === "verified") {
      res.json({ success: true, alreadyVerified: true });
      return;
    }

    // Update member details and mark as verified
    await prisma.hackathonMember.update({
      where: { inviteToken: token },
      data: { name, phone, college, status: "verified", verifiedAt: new Date() },
    });

    // Check if all 3 members in the team are verified → mark team registered
    const allMembers = await prisma.hackathonMember.findMany({
      where: { teamId: member.teamId },
    });
    const allVerified = allMembers
      .filter((m) => m.id !== member.id)   // exclude the member we just verified
      .every((m) => m.status === "verified"); // all remaining must already be verified

    if (allVerified) {
      await prisma.hackathonTeam.update({
        where: { id: member.teamId },
        data: { status: "registered" },
      });
    }

    res.json({ success: true, allVerified });
  } catch (error: any) {
    console.error("[Hackathon] confirmMember error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// ─── GET /api/hackathon/team-status/:teamId ───────────────────────────────────
// Frontend polls this to update member verified badges in real-time.

export const getTeamStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teamId } = req.params;

    const team = await prisma.hackathonTeam.findUnique({
      where: { id: teamId },
      include: {
        members: {
          select: { id: true, email: true, status: true, name: true },
        },
      },
    });

    if (!team) {
      res.status(404).json({ error: "Team not found." });
      return;
    }

    const allVerified = team.members.every((m) => m.status === "verified");

    res.json({
      teamId: team.id,
      teamStatus: team.status,
      allVerified,
      members: team.members,
    });
  } catch (error: any) {
    console.error("[Hackathon] getTeamStatus error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// ─── POST /api/hackathon/finalize/:teamId ─────────────────────────────────────
// Called when leader clicks the final "Register Team" button once all are verified.

export const finalizeTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teamId } = req.params;

    const team = await prisma.hackathonTeam.findUnique({
      where: { id: teamId },
      include: { members: true },
    });

    if (!team) {
      res.status(404).json({ error: "Team not found." });
      return;
    }

    const allVerified = team.members.every((m) => m.status === "verified");
    if (!allVerified) {
      res.status(400).json({ error: "All team members must verify before finalizing." });
      return;
    }

    const updated = await prisma.hackathonTeam.update({
      where: { id: teamId },
      data: { status: "registered" },
    });

    res.json({ success: true, team: updated });
  } catch (error: any) {
    console.error("[Hackathon] finalizeTeam error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
