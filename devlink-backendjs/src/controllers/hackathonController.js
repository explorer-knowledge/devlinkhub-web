'use strict';

const prisma               = require('../db/prismaClient');
const { sendHackathonInvite } = require('../config/mailer');

// ─── POST /api/hackathon/register ─────────────────────────────────────────────
// Creates the team with leader details + 3 member slots.
// Returns the full team object including member IDs (needed for invites).

async function createTeam(req, res) {
  try {
    const { teamName, leaderName, leaderEmail, leaderPhone, leaderCollege, members } = req.body;

    if (!teamName || !leaderName || !leaderEmail || !leaderPhone || !leaderCollege) {
      return res.status(400).json({ error: 'All leader fields are required.' });
    }

    if (!Array.isArray(members) || members.length > 3) {
      return res.status(400).json({ error: 'Maximum 3 additional members are allowed.' });
    }

    for (const m of members) {
      if (!m.name || !m.email || !m.phone || !m.college) {
        return res.status(400).json({ error: 'All member fields must be filled.' });
      }
      if (m.email.trim() === leaderEmail.trim()) {
        return res.status(400).json({ error: 'Leader email cannot be the same as a member email.' });
      }
    }

    const team = await prisma.hackathonTeam.create({
      data: {
        teamName,
        leaderName,
        leaderEmail,
        leaderPhone,
        leaderCollege,
        status: 'pending',
        members: {
          create: members.map(m => ({ 
            email: m.email.trim(), 
            name: m.name.trim(),
            phone: m.phone.trim(),
            college: m.college.trim(),
            status: 'pending' 
          })),
        },
      },
      include: { members: true },
    });

    res.status(201).json({ success: true, team });
  } catch (err) {
    console.error('[Hackathon] createTeam error:', err);
    res.status(500).json({ error: err.message });
  }
}

// ─── POST /api/hackathon/invite ───────────────────────────────────────────────
// Sends the invite email to one member. Body: { memberId }

async function sendInvite(req, res) {
  try {
    const { memberId } = req.body;

    if (!memberId) {
      return res.status(400).json({ error: 'memberId is required.' });
    }

    const member = await prisma.hackathonMember.findUnique({
      where: { id: memberId },
      include: { team: true },
    });

    if (!member) {
      return res.status(404).json({ error: 'Member not found.' });
    }

    await sendHackathonInvite({
      toEmail:      member.email,
      teamName:     member.team.teamName,
      leaderName:   member.team.leaderName,
      confirmToken: member.inviteToken,
    });

    res.json({ success: true, message: `Invite sent to ${member.email}` });
  } catch (err) {
    console.error('[Hackathon] sendInvite error:', err);
    res.status(500).json({ error: `Failed to send invite: ${err.message}` });
  }
}

// ─── GET /api/hackathon/confirm/:token ────────────────────────────────────────
// Member loads this to see invite details before filling the form.

async function getInviteByToken(req, res) {
  try {
    const { token } = req.params;

    const member = await prisma.hackathonMember.findUnique({
      where: { inviteToken: token },
      include: { team: { select: { teamName: true, leaderName: true } } },
    });

    if (!member) {
      return res.status(404).json({ error: 'Invalid or expired invite link.' });
    }

    if (member.status === 'verified') {
      return res.json({ alreadyVerified: true });
    }

    res.json({
      alreadyVerified: false,
      member: {
        id:         member.id,
        email:      member.email,
        status:     member.status,
        teamName:   member.team.teamName,
        leaderName: member.team.leaderName,
      },
    });
  } catch (err) {
    console.error('[Hackathon] getInviteByToken error:', err);
    res.status(500).json({ error: err.message });
  }
}

// ─── POST /api/hackathon/confirm/:token ──────────────────────────────────────
// Member submits their details. Marks them as verified.
// If all 3 members are verified, marks the team as registered.

async function confirmMember(req, res) {
  try {
    const { token } = req.params;

    const member = await prisma.hackathonMember.findUnique({
      where: { inviteToken: token },
    });

    if (!member) {
      return res.status(404).json({ error: 'Invalid invite token.' });
    }

    if (member.status === 'verified') {
      return res.json({ success: true, alreadyVerified: true });
    }

    // Mark this member as verified
    await prisma.hackathonMember.update({
      where: { inviteToken: token },
      data: { status: 'verified', verifiedAt: new Date() },
    });

    // Check if all OTHER members in the team are already verified
    const allMembers = await prisma.hackathonMember.findMany({
      where: { teamId: member.teamId },
    });

    const allVerified = allMembers
      .filter(m => m.id !== member.id)      // exclude the one we just updated
      .every(m => m.status === 'verified');  // are the rest verified?

    if (allVerified) {
      await prisma.hackathonTeam.update({
        where: { id: member.teamId },
        data:  { status: 'registered' },
      });
    }

    res.json({ success: true, allVerified });
  } catch (err) {
    console.error('[Hackathon] confirmMember error:', err);
    res.status(500).json({ error: err.message });
  }
}

// ─── GET /api/hackathon/team-status/:teamId ───────────────────────────────────
// Frontend polls this every 5 s to update member verified badges.

async function getTeamStatus(req, res) {
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
      return res.status(404).json({ error: 'Team not found.' });
    }

    const allVerified = team.members.every(m => m.status === 'verified');

    res.json({
      teamId:     team.id,
      teamStatus: team.status,
      allVerified,
      members:    team.members,
    });
  } catch (err) {
    console.error('[Hackathon] getTeamStatus error:', err);
    res.status(500).json({ error: err.message });
  }
}

// ─── POST /api/hackathon/finalize/:teamId ─────────────────────────────────────
// Leader clicks "Register Team" once all members are verified.

async function finalizeTeam(req, res) {
  try {
    const { teamId } = req.params;

    const team = await prisma.hackathonTeam.findUnique({
      where: { id: teamId },
      include: { members: true },
    });

    if (!team) {
      return res.status(404).json({ error: 'Team not found.' });
    }

    const allVerified = team.members.every(m => m.status === 'verified');
    if (!allVerified) {
      return res.status(400).json({ error: 'All team members must verify before finalizing.' });
    }

    const updated = await prisma.hackathonTeam.update({
      where: { id: teamId },
      data:  { status: 'registered' },
    });

    res.json({ success: true, team: updated });
  } catch (err) {
    console.error('[Hackathon] finalizeTeam error:', err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  createTeam,
  sendInvite,
  getInviteByToken,
  confirmMember,
  getTeamStatus,
  finalizeTeam,
};
