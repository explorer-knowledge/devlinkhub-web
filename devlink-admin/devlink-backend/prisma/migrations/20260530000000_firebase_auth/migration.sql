-- Migration: Switch from Passport/JWT auth to Firebase auth
-- Drop old auth-specific columns
ALTER TABLE "users" DROP COLUMN IF EXISTS "passwordHash";
ALTER TABLE "users" DROP COLUMN IF EXISTS "providerId";

-- Add Firebase UID column (nullable so existing rows are not blocked)
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "firebaseUid" TEXT;

-- Add unique constraint on firebaseUid
CREATE UNIQUE INDEX IF NOT EXISTS "users_firebaseUid_key" ON "users"("firebaseUid");

-- Update provider default
ALTER TABLE "users" ALTER COLUMN "provider" SET DEFAULT 'firebase';
