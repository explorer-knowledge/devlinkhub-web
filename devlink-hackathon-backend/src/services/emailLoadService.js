const prisma   = require('../db/prismaClient');

const emailSet = new Set();

async function loadEmails() {
    const users = await prisma.hackathonParticipant.findMany({
        select: { email: true }
    });
    emailSet.clear();

    for(const user of users){
        emailSet.add(user.email.trim().toLowerCase());
    }

    // emailSet = new Set(
    //     users.map(u => u.email.toLowerCase())
    // );
}

function emailExists(email){
    return emailSet.has(email.trim().toLowerCase()) ;
}



function addEmailtoCache(email){
    emailSet.add(email.trim().toLowerCase());
}

module.exports = {loadEmails , emailExists, addEmailtoCache};