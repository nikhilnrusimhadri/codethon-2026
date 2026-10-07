-- CreateEnum
CREATE TYPE "Branch" AS ENUM ('CSE', 'CSM', 'EEE', 'ECE', 'MECHANICAL', 'CIVIL');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ProgressStatus" AS ENUM ('NOT_STARTED', 'QUALIFIED', 'ELIMINATED');

-- CreateEnum
CREATE TYPE "TeamStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ACTIVE', 'ELIMINATED', 'FINALIST', 'WINNER', 'RUNNER_UP');

-- CreateEnum
CREATE TYPE "ResultStatus" AS ENUM ('QUALIFIED', 'ELIMINATED', 'FINALIST', 'WINNER', 'RUNNER_UP');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL,
    "registrationId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "rollNumber" TEXT NOT NULL,
    "collegeEmail" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "branch" "Branch" NOT NULL,
    "section" TEXT,
    "year" INTEGER NOT NULL DEFAULT 3,
    "collegeIdUrl" TEXT NOT NULL,
    "collegeIdFileName" TEXT NOT NULL,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "currentRound" INTEGER NOT NULL DEFAULT 1,
    "round1Status" "ProgressStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "round2Status" "ProgressStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "round1Score" DOUBLE PRECISION,
    "round2Score" DOUBLE PRECISION,
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "teamNumber" INTEGER NOT NULL,
    "teamName" TEXT NOT NULL,
    "status" "TeamStatus" NOT NULL DEFAULT 'DRAFT',
    "published" BOOLEAN NOT NULL DEFAULT false,
    "score" DOUBLE PRECISION,
    "rank" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JuryMember" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "photoUrl" TEXT,
    "organization" TEXT,
    "department" TEXT,
    "bio" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JuryMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Result" (
    "id" TEXT NOT NULL,
    "round" INTEGER NOT NULL,
    "participantId" TEXT,
    "teamId" TEXT,
    "score" DOUBLE PRECISION,
    "rank" INTEGER,
    "status" "ResultStatus",
    "remarks" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventSettings" (
    "id" TEXT NOT NULL,
    "eventName" TEXT NOT NULL DEFAULT 'CODETHON 2026',
    "organizer" TEXT NOT NULL DEFAULT 'Abhiruchi Club',
    "institution" TEXT NOT NULL DEFAULT 'Mother Teresa Institute of Science and Technology',
    "eventDate" TIMESTAMP(3) NOT NULL DEFAULT '2026-10-14 04:30:00 +00:00',
    "startTime" TEXT NOT NULL DEFAULT '10:00 AM',
    "endTime" TEXT NOT NULL DEFAULT '10:00 PM',
    "registrationDeadline" TIMESTAMP(3) NOT NULL DEFAULT '2026-10-13 18:29:00 +00:00',
    "codeTantraUrl" TEXT,
    "contactEmail" TEXT,
    "registrationEnabled" BOOLEAN NOT NULL DEFAULT true,
    "resultsPublished" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_registrationId_key" ON "Participant"("registrationId");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_rollNumber_key" ON "Participant"("rollNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_collegeEmail_key" ON "Participant"("collegeEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Team_teamNumber_key" ON "Team"("teamNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Team_teamName_key" ON "Team"("teamName");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_participantId_key" ON "TeamMember"("participantId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_teamId_participantId_key" ON "TeamMember"("teamId", "participantId");

-- CreateIndex
CREATE INDEX "Result_round_published_idx" ON "Result"("round", "published");

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
