'use strict';
require('dotenv').config();
const QRCode = require('qrcode');
const { sendLeaderConfirmation } = require('../src/config/mailer');

const targetEmail = process.argv[2];

if (!targetEmail) {
  console.error('Usage: node scripts/testEmail.js <email_address>');
  process.exit(1);
}

async function main() {
  console.log(`Generating dummy QR code...`);
  const qrBuffer = await QRCode.toBuffer('test-team-id-12345', {
    type:   'png',
    width:  300,
    margin: 2,
    color:  { dark: '#04020d', light: '#ffffff' },
  });

  console.log(`Sending test email to: ${targetEmail}...`);
  await sendLeaderConfirmation({
    toEmail:    targetEmail,
    leaderName: 'Test Leader',
    teamName:   'Test Team Alpha',
    teamId:     'DLH-TEST-01',
    amountPaid: 34900,
    qrBuffer,
  });

  console.log('🎉 Test email sent successfully!');
  process.exit(0);
}

main().catch(err => {
  console.error('Failed to send test email:', err);
  process.exit(1);
});
