'use strict';

const nodemailer = require('nodemailer');
require('dotenv').config();

// ─── Nodemailer Transporter ────────────────────────────────────────────────────

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // false = STARTTLS on port 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// // ─── Send Hackathon Team Invite Email ─────────────────────────────────────────

// async function sendHackathonInvite({ toEmail, teamName, leaderName, confirmToken }) {
//   const baseUrl = process.env.FRONTEND_URL ;
//   const confirmUrl = `${baseUrl}/confirm.html?token=${confirmToken}`;

//   await transporter.sendMail({
//     from: process.env.SMTP_FROM ,
//     to: toEmail,
//     subject: `🚀 You've been invited to join team "${teamName}" on DevLink Hackathon!`,
//     html: `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="UTF-8" />
//         <style>
//           body { margin: 0; padding: 0; background: #0a0a0f; font-family: Inter, Arial, sans-serif; color: #f1f1f5; }
//           .wrapper { max-width: 560px; margin: 40px auto; background: #13131f; border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; overflow: hidden; }
//           .header { background: linear-gradient(135deg, #6c63ff, #a78bfa); padding: 36px; text-align: center; }
//           .header h1 { margin: 0; font-size: 26px; color: #fff; letter-spacing: -0.5px; }
//           .header p { margin: 8px 0 0; color: rgba(255,255,255,0.8); font-size: 14px; }
//           .body { padding: 36px; }
//           .body p { color: #9898b0; font-size: 15px; line-height: 1.7; margin: 0 0 16px; }
//           .body strong { color: #f1f1f5; }
//           .btn { display: block; width: fit-content; margin: 28px auto 0; padding: 14px 36px; background: linear-gradient(135deg, #6c63ff, #a78bfa); color: #fff !important; text-decoration: none; border-radius: 50px; font-size: 15px; font-weight: 600; }
//           .footer { padding: 20px 36px; border-top: 1px solid rgba(255,255,255,0.06); text-align: center; }
//           .footer p { margin: 0; font-size: 12px; color: #55556a; }
//         </style>
//       </head>
//       <body>
//         <div class="wrapper">
//           <div class="header">
//             <h1>⚡ DevLink Hackathon</h1>
//             <p>Team Invitation</p>
//           </div>
//           <div class="body">
//             <p>Hey there! 👋</p>
//             <p><strong>${leaderName}</strong> has invited you to join their hackathon team <strong>"${teamName}"</strong> on DevLink.</p>
//             <p>Click the button below to accept the invite and complete your registration. You'll need to fill in a few quick details.</p>
//             <a href="${confirmUrl}" class="btn">✅ Accept Invite &amp; Register</a>
//             <p style="margin-top:24px;font-size:13px;">Or copy this link:<br/><span style="color:#a78bfa;word-break:break-all;">${confirmUrl}</span></p>
//           </div>
//           <div class="footer">
//             <p>If you didn't expect this invite, you can safely ignore this email.</p>
//             <p style="margin-top:6px;">© 2026 DevLink — Build the future together.</p>
//           </div>
//         </div>
//       </body>
//       </html>
//     `,
//   });
// }

// ─── Send Registration Confirmation to Team Leader (with QR) ──────────────────

async function sendLeaderConfirmation({ toEmail, leaderName, teamName, teamId, amountPaid, qrBuffer }) {
  const amountRs = (amountPaid / 100).toFixed(2);

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: toEmail,
    subject: `Registration Confirmed — DevLinkHub Ignite 2026 | Team "${teamName}"`,
    attachments: [
      {
        filename: 'team-qr.png',
        content: qrBuffer,          // raw PNG buffer
        cid: 'teamqr',              // inline image ID, referenced in HTML
      }
    ],
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body { margin: 0; padding: 0; background: #0a0a0f; font-family: Inter, Arial, sans-serif; color: #f1f1f5; }
          .wrapper { max-width: 560px; margin: 40px auto; background: #13131f; border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #00f2fe, #4facfe); padding: 36px; text-align: center; }
          .header h1 { margin: 0; font-size: 26px; color: #04020d; letter-spacing: -0.5px; }
          .header p { margin: 8px 0 0; color: rgba(4,2,13,0.7); font-size: 14px; }
          .body { padding: 36px; }
          .body p { color: #9898b0; font-size: 15px; line-height: 1.7; margin: 0 0 16px; }
          .body strong { color: #f1f1f5; }
          .qr-box { background: #fff; display: inline-block; padding: 16px; border-radius: 16px; margin: 16px 0; }
          .qr-box img { display: block; width: 160px; height: 160px; }
          .team-id { font-family: monospace; font-size: 11px; color: rgba(0,242,254,0.8); word-break: break-all; margin-top: 6px; }
          .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 14px; }
          .lbl { color: #55556a; }
          .val { color: #f1f1f5; font-weight: 600; }
          .footer { padding: 20px 36px; border-top: 1px solid rgba(255,255,255,0.06); text-align: center; }
          .footer p { margin: 0; font-size: 12px; color: #55556a; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="header">
            <h1>⚡ IGNITE 2026</h1>
            <p>Registration Confirmed</p>
          </div>
          <div class="body">
            <p>Hey <strong>${leaderName}</strong>! 🎉</p>
            <p>Your team <strong>"${teamName}"</strong> has been successfully registered for <strong>DevLinkHub Ignite 2026</strong>.</p>
            <p>Please find your team QR code below. <strong>Keep it safe</strong> — you'll need to show it at the event for check-in.</p>

            <div style="text-align: center;">
              <div class="qr-box">
                <img src="cid:teamqr" alt="Team QR Code" />
              </div>
              <div class="team-id">Team ID: ${teamId}</div>
            </div>

            <div style="margin-top: 28px;">
              <div class="row"><span class="lbl">Team Name</span><span class="val">${teamName}</span></div>
              <div class="row"><span class="lbl">Leader</span><span class="val">${leaderName}</span></div>
              <div class="row"><span class="lbl">Amount Paid</span><span class="val">₹${amountRs}</span></div>
              <div class="row"><span class="lbl">Event Date</span><span class="val">20–21 June 2026</span></div>
            </div>

            <p style="margin-top:24px; font-size: 13px; color: #55556a;">
              If you have any issues, reply to this email or contact us at 
              <a href="mailto:${process.env.SMTP_FROM}" style="color: #00f2fe;">${process.env.SMTP_FROM}</a>.
            </p>
          </div>
          <div class="footer">
            <p>© 2026 DevLinkHub — Build. Connect. Grow.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}

module.exports = { sendLeaderConfirmation };