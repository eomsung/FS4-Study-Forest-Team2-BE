/*
  Warnings:

  - You are about to drop the `StudyGroup` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "StudyGroup";

-- CreateTable
CREATE TABLE "Todo" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);
