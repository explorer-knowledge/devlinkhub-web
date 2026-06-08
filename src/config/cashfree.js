'use strict';

// cashfree-pg exposes environment constants via the named export CFEnvironment,
// NOT as a static property on the Cashfree class (Cashfree.Environment is undefined).
const { Cashfree, CFEnvironment } = require('cashfree-pg');

// ─── Cashfree PG Client Singleton ────────────────────────────────────────────

Cashfree.XClientId     = process.env.CASHFREE_APP_ID;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
Cashfree.XEnvironment  =
  process.env.NODE_ENV === 'production'
    ? CFEnvironment.PRODUCTION
    : CFEnvironment.SANDBOX;

module.exports = Cashfree;
