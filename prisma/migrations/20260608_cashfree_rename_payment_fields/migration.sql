-- Migration: cashfree_rename_payment_fields
-- Safely renames Razorpay-specific columns to Cashfree equivalents using
-- ALTER TABLE ... RENAME COLUMN (no data loss, works on existing rows).

-- pending_registrations: razorpayOrderId -> cashfreeOrderId
ALTER TABLE "pending_registrations"
  RENAME COLUMN "razorpayOrderId" TO "cashfreeOrderId";

-- hackathon_participants: razorpayOrderId -> cashfreeOrderId
ALTER TABLE "hackathon_participants"
  RENAME COLUMN "razorpayOrderId" TO "cashfreeOrderId";

-- hackathon_participants: razorpayPaymentId -> cashfreePaymentId
ALTER TABLE "hackathon_participants"
  RENAME COLUMN "razorpayPaymentId" TO "cashfreePaymentId";

-- webhook_events: razorpayEventId -> cashfreePaymentId
ALTER TABLE "webhook_events"
  RENAME COLUMN "razorpayEventId" TO "cashfreePaymentId";
