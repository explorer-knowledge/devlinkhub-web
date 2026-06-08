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

async function sendLeaderConfirmation({ toEmail, leaderName, teamName, teamId, amountPaid, qrBuffer }) {
  const amountRs = (amountPaid / 100).toFixed(2);

  const textContent = `
Registration Confirmed — DevLinkHub Ignite 2026

Hey ${leaderName},
Congratulations! Your team "${teamName}" has been successfully registered for DevLinkHub AURAXIS 2K26.

Team Details:
- Team Name: ${teamName}
- Team Leader: ${leaderName}
- Amount Paid: ₹${amountRs}
- Team ID: ${teamId}

Please find your entry QR code attached to this email. Keep it safe for event check-in.

If you have any questions, feel free to contact us at support@devlinkhub.in.

Build. Connect. Grow.
DevLinkHub © 2026
  `.trim();

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: toEmail,
    subject: `Registration Confirmed — DevLinkHub Ignite 2026 | Team "${teamName}"`,
    text: textContent,
    headers: {
      'List-Unsubscribe': '<mailto:support@devlinkhub.in?subject=unsubscribe>'
    },
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
<meta charset="UTF-8">
<title>AURAXIS 2026</title>
</head>

<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<table width="620" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:20px;overflow:hidden;">

<tr>
<td
style="
background:linear-gradient(135deg,#0f172a,#1e293b);
padding:50px;
text-align:center;
color:white;
">

<h1 style="margin:0;font-size:36px;">
AURAXIS 2026
</h1>

<p style="opacity:.8;">
Registration Confirmed
</p>

</td>
</tr>

<tr>
<td style="padding:35px;">

<h2>
Welcome ${leaderName} 🎉
</h2>

<p>
Your team <b>${teamName}</b> has been successfully registered for
DevLinkHub AURAXIS 2026.
</p>

<table width="100%"
style="
margin-top:25px;
border:1px solid #e5e7eb;
border-radius:12px;
">

<tr>
<td style="padding:12px;">Team Name</td>
<td style="padding:12px;"><b>${teamName}</b></td>
</tr>

<tr>
<td style="padding:12px;">Leader</td>
<td style="padding:12px;"><b>${leaderName}</b></td>
</tr>

<tr>
<td style="padding:12px;">Team ID</td>
<td style="padding:12px;"><b>${teamId}</b></td>
</tr>

<tr>
<td style="padding:12px;">Amount Paid</td>
<td style="padding:12px;"><b>₹${amountRs}</b></td>
</tr>

</table>

${
  qrBuffer
    ? `
<div style="text-align:center;margin-top:30px;">
<img src="cid:teamqr" width="180" />
<p><b>Present this QR at check-in</b></p>
</div>
`
    : ''
}

<div
style="
margin-top:30px;
background:#eff6ff;
padding:20px;
border-radius:12px;
"
>
<h3>What's Next?</h3>

<ul>
<li>Venue details will be shared soon.</li>
<li>Speaker announcements will be emailed.</li>
<li>Hackathon guidelines will be released before the event.</li>
<li>Keep your QR safe.</li>
</ul>
</div>

</td>
</tr>

<tr>
<td
style="
padding:25px;
background:#f8fafc;
text-align:center;
font-size:13px;
color:#64748b;
"
>

DevLinkHub © 2026<br>
Build. Connect. Grow.

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
    `,
  });
}

module.exports = { sendLeaderConfirmation };