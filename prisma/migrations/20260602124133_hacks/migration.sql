/*
  Warnings:

  - You are about to drop the `hackathon_members` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `hackathon_teams` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "hackathon_members" DROP CONSTRAINT "hackathon_members_teamId_fkey";

-- DropTable
DROP TABLE "hackathon_members";

-- DropTable
DROP TABLE "hackathon_teams";

-- CreateTable
CREATE TABLE "pending_registrations" (
    "id" TEXT NOT NULL,
    "razorpayOrderId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pending_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hackathon_participants" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,
    "razorpayOrderId" TEXT NOT NULL,
    "razorpayPaymentId" TEXT NOT NULL,
    "amountPaid" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'registered',
    "isLeader" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "college" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hackathon_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_events" (
    "id" TEXT NOT NULL,
    "razorpayEventId" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webhook_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pending_registrations_razorpayOrderId_key" ON "pending_registrations"("razorpayOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "hackathon_participants_email_key" ON "hackathon_participants"("email");

-- CreateIndex
CREATE UNIQUE INDEX "hackathon_participants_phone_key" ON "hackathon_participants"("phone");

-- CreateIndex
CREATE INDEX "hackathon_participants_teamId_idx" ON "hackathon_participants"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "webhook_events_razorpayEventId_key" ON "webhook_events"("razorpayEventId");
