-- CreateTable
CREATE TABLE "ReviewResult" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "scores" JSONB NOT NULL,
    "totalScore" INTEGER NOT NULL,
    "totalPossible" INTEGER NOT NULL,
    "strengths" JSONB NOT NULL,
    "improvements" JSONB NOT NULL,
    "nextSteps" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReviewResult_userId_courseId_assignmentId_key" ON "ReviewResult"("userId", "courseId", "assignmentId");

-- AddForeignKey
ALTER TABLE "ReviewResult" ADD CONSTRAINT "ReviewResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
