const prisma = require('../db/prismaClient');

let eventSet = new Set();

async function loadEventId(){
    const events = await prisma.webhookEvent.findMany({
        select: { cashfreePaymentId: true }
    });

    for (const event of events) {
        eventSet.add(event.cashfreePaymentId.trim());
    }
}

function eventIdExists(eventId){
    return eventSet.has(eventId.trim());
}

function addEventIdtoCache(eventId){
    const normalized = eventId.trim() ;
    eventSet.add(normalized);
    return normalized;
}

module.exports = {loadEventId , eventIdExists , addEventIdtoCache} ;