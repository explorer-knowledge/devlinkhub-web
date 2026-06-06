const prisma = require('../db/prismaClient');
const {addEmailtoCache} = require('./emailLoadService');
const {addPhonetoCache} = require('./phoneLoadService');

let orderMap = new Map();

async function loadOrderId(){
    // const orders = await prisma.hackathonParticipant.findMany({
    //     select: {razorpayOrderId: true}
    // });
    const leaderRow = await prisma.hackathonParticipant.findMany({
      where:  { isLeader: true },
      select: { razorpayOrderId: true,teamId: true, teamName: true,name:true,email: true,phone:true,status: true,createdAt: true },
    });
    orderMap.clear();

    for(const leader of leaderRow){
        orderMap.set(leader.razorpayOrderId.trim(),leader);
    }
}


function orderIdExists(orderId){
    return orderMap.has(orderId.trim());
}

function getOrderData(orderId){
    return orderMap.get(orderId.trim()) || null; 
}

function getOrderCount(){
    return orderMap.size;
}

function addOrderIdtoCache(payload,number=0){
    payload.participants.forEach(participant=>{
        addEmailtoCache(participant.email);
        addPhonetoCache(participant.phone);
    });
    const leaderRow = payload.participants.find(p=> p.isLeader);
    const memCache = {
      razorpayOrderId: payload.razorpayOrderId ,
      teamId: payload.teamId ,
      teamName: payload.teamName,
      name: leaderRow.name,
      email: leaderRow.email,
      phone: leaderRow.phone,
      status: payload.status,
      createdAt: payload.createdAt
    }
    const normalized = memCache.razorpayOrderId.trim();
    orderMap.set(normalized,memCache);
    
    return [true,memCache,payload][number] ?? true;
}

module.exports  = {loadOrderId,orderIdExists,getOrderData,addOrderIdtoCache,getOrderCount};