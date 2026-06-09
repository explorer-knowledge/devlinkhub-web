'use strict';

// cashfree-pg v6: PGCreateOrder and all PG methods are INSTANCE methods.
// Instantiate with (environment, clientId, secretKey) and export the instance.
const { Cashfree, CFEnvironment } = require('cashfree-pg');

// ─── Cashfree PG Client Test Singleton ────────────────────────────────────────

console.log('[Cashfree-Test] Initializing client in SANDBOX mode');

const cashfreeTest = new Cashfree(
  CFEnvironment.SANDBOX,
  process.env.CASHFREE_TEST_APP_ID || process.env.CASHFREE_APP_ID,
  process.env.CASHFREE_TEST_SECRET_KEY || process.env.CASHFREE_SECRET_KEY,
);

module.exports = cashfreeTest;
