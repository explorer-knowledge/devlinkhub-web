'use strict';

// cashfree-pg v6: PGCreateOrder and all PG methods are INSTANCE methods.
// Instantiate with (environment, clientId, secretKey) and export the instance.
const { Cashfree, CFEnvironment } = require('cashfree-pg');

// ─── Cashfree PG Client Singleton ────────────────────────────────────────────

console.log('[Cashfree] Initializing client in PRODUCTION mode');

const cashfree = new Cashfree(
  CFEnvironment.PRODUCTION,
  process.env.CASHFREE_APP_ID,
  process.env.CASHFREE_SECRET_KEY,
);

module.exports = cashfree;



