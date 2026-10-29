-- CreateEnum
CREATE TYPE "CoupleStatus" AS ENUM ('ACTIVE', 'UNPAIRED');

-- CreateTable
CREATE TABLE "Couple" (
    "id" TEXT NOT NULL,
    "user1Id" INTEGER NOT NULL,
    "user2Id" INTEGER NOT NULL,
    "status" "CoupleStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unpairedAt" TIMESTAMP(3),
    "unpairedBy" INTEGER,

    CONSTRAINT "Couple_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PairingInvite" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "PairingInvite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Couple_user1Id_user2Id_key" ON "Couple"("user1Id", "user2Id");

-- CreateIndex
CREATE UNIQUE INDEX "PairingInvite_code_key" ON "PairingInvite"("code");

-- CreateIndex
CREATE UNIQUE INDEX "PairingInvite_ownerId_key" ON "PairingInvite"("ownerId");

-- AddForeignKey
ALTER TABLE "Couple" ADD CONSTRAINT "Couple_user1Id_fkey" FOREIGN KEY ("user1Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Couple" ADD CONSTRAINT "Couple_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PairingInvite" ADD CONSTRAINT "PairingInvite_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
