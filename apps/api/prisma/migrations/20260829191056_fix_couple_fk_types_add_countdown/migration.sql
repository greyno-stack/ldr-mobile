-- DropIndex
DROP INDEX "Couple_user1Id_user2Id_key";

-- CreateTable
CREATE TABLE "Countdown" (
    "id" TEXT NOT NULL,
    "coupleId" TEXT NOT NULL,
    "title" TEXT,
    "targetDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "Countdown_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Countdown_coupleId_key" ON "Countdown"("coupleId");

-- CreateIndex
CREATE UNIQUE INDEX "Couple_user1Id_key" ON "Couple"("user1Id");

-- CreateIndex
CREATE UNIQUE INDEX "Couple_user2Id_key" ON "Couple"("user2Id");

-- AddForeignKey
ALTER TABLE "Countdown" ADD CONSTRAINT "Countdown_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "Couple"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

