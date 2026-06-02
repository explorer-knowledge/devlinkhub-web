-- CreateTable
CREATE TABLE "hackathon_teams" (
    "id" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,
    "leaderName" TEXT NOT NULL,
    "leaderEmail" TEXT NOT NULL,
    "leaderPhone" TEXT NOT NULL,
    "leaderCollege" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hackathon_teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hackathon_members" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "college" TEXT,
    "inviteToken" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedAt" TIMESTAMP(3),

    CONSTRAINT "hackathon_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "hackathon_members_inviteToken_key" ON "hackathon_members"("inviteToken");

-- AddForeignKey
ALTER TABLE "hackathon_members" ADD CONSTRAINT "hackathon_members_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "hackathon_teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
