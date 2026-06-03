const prisma = require('../db/prismaClient');

let orderMap = new Map();

async function loadOrderId(){
    // const orders = await prisma.hackathonParticipant.findMany({
    //     select: {razorpayOrderId: true}
    // });
    const leaderRow = await prisma.hackathonParticipant.findMany({
      where:  { isLeader: true },
      select: { razorpayOrderId: true,teamId: true, teamName: true,email: true,phone:true, status: true, createdAt: true },
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

function addOrderIdtoCache(leaderRow){
    const normalized = leaderRow.razorpayOrderId.trim();
    orderMap.set(normalized,leaderRow);
    return leaderRow;
}

module.exports  = {loadOrderId,orderIdExists,getOrderData,addOrderIdtoCache};