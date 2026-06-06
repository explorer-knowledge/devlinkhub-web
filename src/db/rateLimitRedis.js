const Redis = require('ioredis');

const redisUrl = process.env.REDIS_URL;

const redis = new Redis(redisUrl,{
    maxRetriesPerRequest: 3,
    retryStrategy(times){
        const delay = Math.min(times*100,3000);
        return delay;
    }
});

redis.on('connect',()=> console.log('Redis rate limit Connected'));
redis.on('error',(err)=> console.error('Redis rate limit Connection err:',err));

module.exports = redis ;