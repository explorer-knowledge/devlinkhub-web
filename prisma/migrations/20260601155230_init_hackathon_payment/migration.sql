-- CreateTable
CREATE TABLE "hackathon_teams" (
    "id" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,
    "leaderName" TEXT NOT NULL,
    "leaderEmail" TEXT NOT NULL,
    "leaderPhone" TEXT NOT NULL,
    "leaderCollege" TEXT NOT NULL,
    "razorpayOrderId" TEXT NOT NULL,
    "razorpayPaymentId" TEXT NOT NULL,
    "amountPaid" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'registered',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hackathon_teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hackathon_members" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "college" TEXT NOT NULL,

    CONSTRAINT "hackathon_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "hackathon_teams_razorpayOrderId_key" ON "hackathon_teams"("razorpayOrderId");

-- AddForeignKey
ALTER TABLE "hackathon_members" ADD CONSTRAINT "hackathon_members_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "hackathon_teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
