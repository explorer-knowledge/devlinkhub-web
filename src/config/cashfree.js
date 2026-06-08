'use strict';

const { Cashfree } = require('cashfree-pg');

// ─── Cashfree PG Client Singleton ────────────────────────────────────────────

Cashfree.XClientId     = process.env.CASHFREE_APP_ID;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
Cashfree.XEnvironment  =
  process.env.NODE_ENV === 'production'
    ? Cashfree.Environment.PRODUCTION
    : Cashfree.Environment.SANDBOX;

module.exports = Cashfree;
