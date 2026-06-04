const redis = require('../db/redisClient');
const prisma = require('../db/prismaClient');

while(true){
    const job = await redis.brpop("registration_queue",0);
    await processRegistration(job);
}

async function processRegistration(job){

}