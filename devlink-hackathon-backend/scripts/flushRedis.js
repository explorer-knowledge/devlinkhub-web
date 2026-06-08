'use strict';
require('dotenv').config();
const Redis = require('ioredis');

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  console.error('Error: REDIS_URL environment variable is not defined.');
  process.exit(1);
}

const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 1
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
  process.exit(1);
});

async function main() {
  console.log('Connecting to Redis...');
  await redis.flushdb();
  console.log('🧹 Redis database flushed successfully!');
  await redis.quit();
  process.exit(0);
}

main().catch(err => {
  console.error('Failed to flush Redis:', err);
  process.exit(1);
});
