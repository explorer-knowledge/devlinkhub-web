const prisma = require('../db/prismaClient');

let phoneSet = new Set();

async function loadPhone(){
    const users = await prisma.hackathonParticipant.findMany({
        select: {phone: true}
    });

    for(const user of users){
        phoneSet.add(user.phone.trim());
    }
}

function phoneExists(phone){
    return phoneSet.has(phone.trim());
}

function addPhonetoCache(phone){
    phoneSet.add(phone.trim());
}

module.exports = {loadPhone , phoneExists , addPhonetoCache} ;