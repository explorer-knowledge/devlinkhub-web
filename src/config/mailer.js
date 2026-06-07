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
    <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>DevLinkHub AURAXIS 2026 Registration Confirmation</title>

        <style>
        *{
            margin:0;
            padding:0;
            box-sizing:border-box;
        }

        body{
            background:#080812;
            font-family:Inter,Arial,sans-serif;
            color:#ffffff;
            padding:30px 15px;
        }

        .wrapper{
            max-width:620px;
            margin:auto;
            background:#11111d;
            border:1px solid rgba(255,255,255,0.08);
            border-radius:24px;
            overflow:hidden;
        }

        .hero{
            background:
            radial-gradient(circle at top left,#6d5dfc 0%,transparent 40%),
            radial-gradient(circle at top right,#00d4ff 0%,transparent 40%),
            linear-gradient(135deg,#0f172a,#15152b);
            padding:50px 35px;
            text-align:center;
        }

        .logo{
            font-size:13px;
            letter-spacing:4px;
            text-transform:uppercase;
            opacity:.75;
            margin-bottom:15px;
        }

        .hero h1{
            font-size:34px;
            font-weight:800;
            letter-spacing:-1px;
        }

        .hero h1 span{
            color:#00e5ff;
        }

        .hero p{
            margin-top:12px;
            color:rgba(255,255,255,.8);
            font-size:14px;
        }

        .content{
            padding:35px;
        }

        .content h2{
            font-size:22px;
            margin-bottom:18px;
        }

        .content p{
            color:#b9bfd3;
            line-height:1.8;
            font-size:15px;
            margin-bottom:16px;
        }

        .highlight{
            color:#ffffff;
            font-weight:700;
        }

        .info-card{
            background:#171727;
            border:1px solid rgba(255,255,255,.08);
            border-radius:18px;
            padding:22px;
            margin:25px 0;
        }

        .row{
            display:flex;
            justify-content:space-between;
            padding:12px 0;
            border-bottom:1px solid rgba(255,255,255,.06);
        }

        .row:last-child{
            border-bottom:none;
        }

        .label{
            color:#8d92a7;
            font-size:14px;
        }

        .value{
            color:#ffffff;
            font-weight:600;
            font-size:14px;
        }

        .qr-section{
            text-align:center;
            margin:30px 0;
        }

        .qr-box{
            display:inline-block;
            background:#fff;
            padding:18px;
            border-radius:18px;
        }

        .qr-box img{
            width:180px;
            height:180px;
            display:block;
        }

        .team-id{
            margin-top:12px;
            color:#00e5ff;
            font-family:monospace;
            font-size:13px;
        }

        .section{
            margin-top:30px;
        }

        .section-title{
            font-size:18px;
            font-weight:700;
            margin-bottom:15px;
        }

        .timeline{
            background:#171727;
            border:1px solid rgba(255,255,255,.08);
            border-radius:18px;
            padding:20px;
        }

        .timeline-item{
            padding:12px 0;
            border-bottom:1px solid rgba(255,255,255,.06);
        }

        .timeline-item:last-child{
            border-bottom:none;
        }

        .timeline-item strong{
            display:block;
            color:#ffffff;
            margin-bottom:5px;
        }

        .notice{
            margin-top:25px;
            background:rgba(0,229,255,.08);
            border:1px solid rgba(0,229,255,.18);
            padding:18px;
            border-radius:16px;
        }

        .notice h3{
            margin-bottom:10px;
        }

        .notice ul{
            padding-left:18px;
        }

        .notice li{
            color:#b9bfd3;
            margin-bottom:8px;
            line-height:1.6;
        }

        .footer{
            padding:30px;
            text-align:center;
            border-top:1px solid rgba(255,255,255,.06);
        }

        .footer p{
            color:#73788f;
            font-size:13px;
            line-height:1.8;
        }

        .cta{
            margin-top:18px;
            font-weight:600;
            color:#00e5ff;
        }
        </style>
        </head>

        <body>

        <div class="wrapper">

            <div class="hero">
                <div class="logo">DEVLINKHUB PRESENTS</div>

                <h1>AURAXIS <span>2K26</span></h1>

                <p>
                    Registration Confirmed
                </p>

                <p>
                    Build • Connect • Grow
                </p>
            </div>

            <div class="content">

                <h2>🎉 Welcome to DevLinkHub AURAXIS 2K26</h2>

                <p>
                    Hey <span class="highlight">${leaderName}</span>,
                </p>

                <p>
                    Congratulations! Your team
                    <span class="highlight">"${teamName}"</span>
                    has been successfully registered for
                    <span class="highlight">DevLinkHub AURAXIS 2K26</span>.
                </p>

                <p>
                    We're excited to welcome you to a community of builders,
                    innovators, developers, creators and future leaders.
                </p>

                <!-- TEAM DETAILS -->
        <div class="info-card">
            <div class="row">
                        <span class="label">Team Name</span>
                        <span class="value">${teamName}</span>
                    </div>

                    <div class="row">
                        <span class="label">Team Leader</span>
                        <span class="value">${leaderName}</span>
                    </div>

                    <div class="row">
                        <span class="label">Amount Paid</span>
                        <span class="value">₹${amountRs}</span>
                    </div>

                    <div class="row">
                        <span class="label">Event</span>
                        <span class="value">DevLinkHub AURAXIS 2K26</span>
                    </div>

                </div>

                <!-- QR -->

                <div class="qr-section">

                    <div class="qr-box">
                        <img src="cid:teamqr" alt="QR Code">
                    </div>

                    <div class="team-id">
                        Team ID: ${teamId}
                    </div>

                </div>

                <!-- EVENT SCHEDULE -->

                <div class="section">

                    <div class="section-title">
                        📅 Event Schedule
                    </div>

                    <div class="timeline">

                        <div class="timeline-item">
                            <strong>Day 1 — BuildX Workshop</strong>
                            Community Launch • Speaker Sessions • Networking • Technical Workshop
                        </div>

                        <div class="timeline-item">
                            <strong>Day 2 — Auraxis Hackathon</strong>
                            Team Collaboration • Product Building • Mentorship • Final Presentations
                        </div>

                    </div>

                </div>

                <!-- WHAT NEXT -->

                <div class="notice">

                    <h3>What Happens Next?</h3>

                    <ul>
                        <li>Venue details will be shared soon.</li>
                        <li>Speaker announcements will be emailed.</li>
                        <li>Hackathon guidelines will be released before the event.</li>
                        <li>Please keep your QR Code safe for event check-in.</li>
                        <li>Follow our updates and announcements regularly.</li>
                    </ul>

                </div>

                <div class="section">

                    <div class="section-title">
                        Need Help?
                    </div>

                    <p>
                        If you have any questions regarding your registration,
                        team participation or event details, feel free to contact us.
                    </p>

                    <p>
                        📧 support@devlinkhub.in<br>
                        🌐 devlinkhub.in
                    </p>

                </div>

            </div>

            <div class="footer">

                <p>
                    Thank you for registering for DevLinkHub AURAXIS 2026.
                </p>

                <p class="cta">
                    Build. Connect. Grow.
                </p>

                <p>
                    DevLinkHub © 2026
                </p>

            </div>

        </div>

        </body>
    </html>
    `,
  });
}

module.exports = { sendLeaderConfirmation };