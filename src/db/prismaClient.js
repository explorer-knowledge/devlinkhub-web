'use strict';

const { PrismaClient } = require('@prisma/client');

// Singleton — avoids multiple instances during hot-reload in dev
const prisma = global._prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global._prisma = prisma;
}

module.exports = prisma;
