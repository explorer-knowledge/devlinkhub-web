'use strict';

const { PrismaClient } = require('@prisma/client');

// ─── Prisma Singleton ──────────────────────────────────────────────────────────
// Reuse the same client instance across all modules.
// The global trick prevents multiple instances during hot-reloads in dev.

const prisma = global._prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global._prisma = prisma;
}

module.exports = prisma;
