/*
  Warnings:

  - A unique constraint covering the columns `[platform,userId]` on the table `UserSocial` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Sections" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSocial_platform_userId_key" ON "UserSocial"("platform", "userId");
