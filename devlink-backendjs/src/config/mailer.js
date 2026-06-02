'use strict';

const nodemailer = require('nodemailer');
require('dotenv').config();

// ─── Nodemailer Transporter ────────────────────────────────────────────────────
// Configure SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in .env
// For Gmail: enable 2FA and create an App Password at:
//   https://myaccount.google.com/apppasswords

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // false = STARTTLS on port 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ─── Send Hackathon Team Invite Email ─────────────────────────────────────────

async function sendHackathonInvite({ toEmail, teamName, leaderName, confirmToken }) {
  const baseUrl = process.env.HACKATHON_CONFIRM_BASE_URL || 'http://localhost:4000';
  const confirmUrl = `${baseUrl}/confirm.html?token=${confirmToken}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'DevLink <noreply@devlink.app>',
    to: toEmail,
    subject: `🚀 You've been invited to join team "${teamName}" on DevLink Hackathon!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body { margin: 0; padding: 0; background: #0a0a0f; font-family: Inter, Arial, sans-serif; color: #f1f1f5; }
          .wrapper { max-width: 560px; margin: 40px auto; background: #13131f; border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #6c63ff, #a78bfa); padding: 36px; text-align: center; }
          .header h1 { margin: 0; font-size: 26px; color: #fff; letter-spacing: -0.5px; }
          .header p { margin: 8px 0 0; color: rgba(255,255,255,0.8); font-size: 14px; }
          .body { padding: 36px; }
          .body p { color: #9898b0; font-size: 15px; line-height: 1.7; margin: 0 0 16px; }
          .body strong { color: #f1f1f5; }
          .btn { display: block; width: fit-content; margin: 28px auto 0; padding: 14px 36px; background: linear-gradient(135deg, #6c63ff, #a78bfa); color: #fff !important; text-decoration: none; border-radius: 50px; font-size: 15px; font-weight: 600; }
          .footer { padding: 20px 36px; border-top: 1px solid rgba(255,255,255,0.06); text-align: center; }
          .footer p { margin: 0; font-size: 12px; color: #55556a; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="header">
            <h1>⚡ DevLink Hackathon</h1>
            <p>Team Invitation</p>
          </div>
          <div class="body">
            <p>Hey there! 👋</p>
            <p><strong>${leaderName}</strong> has invited you to join their hackathon team <strong>"${teamName}"</strong> on DevLink.</p>
            <p>Click the button below to accept the invite and complete your registration. You'll need to fill in a few quick details.</p>
            <a href="${confirmUrl}" class="btn">✅ Accept Invite &amp; Register</a>
            <p style="margin-top:24px;font-size:13px;">Or copy this link:<br/><span style="color:#a78bfa;word-break:break-all;">${confirmUrl}</span></p>
          </div>
          <div class="footer">
            <p>If you didn't expect this invite, you can safely ignore this email.</p>
            <p style="margin-top:6px;">© 2026 DevLink — Build the future together.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}

module.exports = { sendHackathonInvite };
