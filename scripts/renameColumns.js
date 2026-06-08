'use strict';
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sqls = [
  'ALTER TABLE pending_registrations RENAME COLUMN "razorpayOrderId" TO "cashfreeOrderId"',
  'ALTER TABLE hackathon_participants RENAME COLUMN "razorpayOrderId" TO "cashfreeOrderId"',
  'ALTER TABLE hackathon_participants RENAME COLUMN "razorpayPaymentId" TO "cashfreePaymentId"',
  'ALTER TABLE webhook_events RENAME COLUMN "razorpayEventId" TO "cashfreePaymentId"',
];

async function run() {
  for (const sql of sqls) {
    try {
      await prisma.$executeRawUnsafe(sql);
      console.log('OK:', sql.slice(0, 80));
    } catch (e) {
      console.error('SKIP:', e.message.slice(0, 120));
    }
  }
  await prisma.$disconnect();
  console.log('Done.');
}

run();
