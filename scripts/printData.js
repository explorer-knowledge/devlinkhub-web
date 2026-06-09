'use strict';
require('dotenv').config(); // 1. Load environment variables

const { printOrderMap, loadOrderId } = require('../src/services/orderIdService');

async function main() {
  console.log("Loading order data from database...");
  await loadOrderId();      // 2. Fetch data to populate orderMap
  printOrderMap();          // 3. Print the populated map
  process.exit(0);          // 4. Force exit to close DB/Redis connections
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
