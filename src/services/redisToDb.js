const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
        return Math.min(times * 100, 3000);
    }
});
const prisma = require('../db/prismaClient');

(async ()=>{
    while(true){
        try{const job = await redis.brpop("registration_queue",0);
        const data = JSON.parse(job[1]);
       
        await prisma.$transaction(async (tx) => {
            // Create one HackathonParticipant row per person (leader + members)
            await tx.hackathonParticipant.createMany({
                data: data.payload.participants.map(participant => ({
                    teamId: data.payload.teamId,
                    teamName: data.payload.teamName,
                    razorpayOrderId: data.payload.razorpayOrderId,
                    razorpayPaymentId: data.payload.razorpayPaymentId,
                    amountPaid: data.payload.amountPaid,
                    status: data.payload.status,
                    isLeader: participant.isLeader,
                    name: participant.name,
                    email: participant.email,
                    phone: participant.phone,
                    college: participant.college,
                    createdAt:data.payload.createdAt
                })),
            });

            // Log event for idempotency
            await tx.webhookEvent.create({
                data: {
                razorpayEventId: data.webhook_event.razorpayEventId,
                event:           data.webhook_event.event,
                },
            });
            console.log(`Successfully svaed the ${data.payload.razorpayOrderId}`);
        });}catch(err){
            console.error('[rediToDb] Failed to process',err.message);
        }

    }
})();

