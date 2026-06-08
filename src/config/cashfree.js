'use strict';

// cashfree-pg v6: PGCreateOrder and all PG methods are INSTANCE methods.
// Instantiate with (environment, clientId, secretKey) and export the instance.
const { Cashfree, CFEnvironment } = require('cashfree-pg');

// ─── Cashfree PG Client Singleton ────────────────────────────────────────────

const cashfree = new Cashfree(
  process.env.NODE_ENV === 'production'
    ? CFEnvironment.PRODUCTION
    : CFEnvironment.SANDBOX,
  process.env.CASHFREE_APP_ID,
  process.env.CASHFREE_SECRET_KEY,
);

module.exports = cashfree;

