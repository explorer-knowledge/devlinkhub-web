const Redis = require('ioredis');
const QRCode = require('qrcode');
const { sendLeaderConfirmation } = require('../config/mailer');
const redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
        return Math.min(times * 100, 3000);
    }
});
const prisma = require('../db/prismaClient');

// ─── Retry helper — 3 attempts with linear backoff ────────────────────────────
// Gmail SMTP can drop idle connections on Render cold starts.
// Retries cover transient auth failures and connection timeouts.
async function sendWithRetry(fn, retries = 3, delayMs = 2000) {
    for (let i = 0; i < retries; i++) {
        try {
            await fn();
            return; // success — exit
        } catch (err) {
            console.error(`[redisToDb] Email attempt ${i + 1}/${retries} failed:`, err.message);
            if (i < retries - 1) {
                await new Promise(res => setTimeout(res, delayMs * (i + 1))); // 2s → 4s → 6s
            }
        }
    }
    console.error('[redisToDb] All email retry attempts exhausted. Leader did not receive confirmation email.');
}

(async () => {
    while (true) {
        try {
            const job = await redis.brpop("registration_queue", 0);
            const data = JSON.parse(job[1]);

            // 1. Persist to DB — email failures must NOT roll this back
            await prisma.$transaction(async (tx) => {
                await tx.hackathonParticipant.createMany({
                    data: data.payload.participants.map(participant => ({
                        teamId:            data.payload.teamId,
                        teamName:          data.payload.teamName,
                        cashfreeOrderId:   data.payload.cashfreeOrderId,
                        cashfreePaymentId: data.payload.cashfreePaymentId,
                        amountPaid:        data.payload.amountPaid,
                        status:            data.payload.status,
                        isLeader:          participant.isLeader,
                        name:              participant.name,
                        email:             participant.email,
                        phone:             participant.phone,
                        college:           participant.college,
                        createdAt:         data.payload.createdAt,
                    })),
                });

                await tx.webhookEvent.create({
                    data: {
                        cashfreePaymentId: data.webhook_event.cashfreePaymentId,
                        event:             data.webhook_event.event,
                    },
                });
            });

            console.log(`[redisToDb] Successfully saved order ${data.payload.cashfreeOrderId}`);

            // 2. Send confirmation email to leader — outside transaction so DB commit is safe
            const leader = data.payload.participants.find(p => p.isLeader);
            if (leader) {
                try {
                    const qrBuffer = await QRCode.toBuffer(data.payload.teamId, {
                        type:   'png',
                        width:  300,
                        margin: 2,
                        color:  { dark: '#04020d', light: '#ffffff' },
                    });

                    await sendWithRetry(() => sendLeaderConfirmation({
                        toEmail:    leader.email,
                        leaderName: leader.name,
                        teamName:   data.payload.teamName,
                        teamId:     data.payload.teamId,
                        amountPaid: data.payload.amountPaid,
                        qrBuffer,
                    }));

                    console.log(`[redisToDb] Confirmation email sent to leader: ${leader.email}`);
                } catch (mailErr) {
                    // QR generation failed — log and continue, DB is already committed
                    console.error('[redisToDb] QR generation failed:', mailErr.message);
                }
            }

        } catch (err) {
            console.error('[redisToDb] Failed to process job:', err.message);
        }
    }
})();
