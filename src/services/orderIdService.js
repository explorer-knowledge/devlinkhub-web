const prisma = require('../db/prismaClient');
const redis = require('../db/redisClient');
const { addEmailtoCache } = require('./emailLoadService');
const { addPhonetoCache } = require('./phoneLoadService');

let orderMap = new Map();

async function loadOrderId() {
  const leaderRow = await prisma.hackathonParticipant.findMany({
    where: { isLeader: true },
    select: { cashfreeOrderId: true, teamId: true, teamName: true, name: true, email: true, phone: true, status: true, amountPaid: true, createdAt: true },
  });
  orderMap.clear();

  for (const leader of leaderRow) {
    orderMap.set(leader.cashfreeOrderId, leader);
  }
}

function printOrderMap(){
  return console.log(orderMap);
}

function orderIdExists(orderId) {
  return orderMap.has(orderId.trim());
}

function getOrderData(orderId) {
  return orderMap.get(orderId.trim()) ;
}

function getOrderCount() {
  return orderMap.size;
}

async function loadRedisTeamCounter() {
  const temp = getOrderCount();
  await redis.set('team_counter', temp);
  return console.log(`Success Team Counter: ${temp}`);
}

async function loadRedisPromoCounter() {
  const temp = getPromoCodeUseCount();
  await redis.set('promo_counter', temp);
  return console.log(`Success Promo Counter: ${temp}`);
}

function addOrderIdtoCache(payload, number = 0) {
  payload.participants.forEach(participant => {
    addEmailtoCache(participant.email);
    addPhonetoCache(participant.phone);
  });
  console.log(...payload);
  const leaderRow = payload.participants.find(p => p.isLeader);
  const memCache = {
    cashfreeOrderId: payload.cashfreeOrderId,
    teamId: payload.teamId,
    teamName: payload.teamName,
    name: leaderRow.name,
    email: leaderRow.email,
    phone: leaderRow.phone,
    status: payload.status,
    amountPaid: payload.amountPaid,
    createdAt: payload.createdAt
  };
  const normalized = memCache.cashfreeOrderId.trim();
  orderMap.set(normalized, memCache);

  return [true, memCache, payload][number] ?? true;
}

function getPromoCodeUseCount() {
  let count = 0;
  for (const order of orderMap.values()) {
    if (order.amountPaid === 24900) {
      count++;
    }
  }
  return count;
}

module.exports = { printOrderMap,loadOrderId, orderIdExists, getOrderData, loadRedisTeamCounter, loadRedisPromoCounter, addOrderIdtoCache, getOrderCount };