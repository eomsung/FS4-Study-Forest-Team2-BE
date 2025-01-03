/*
  Warnings:

  - You are about to drop the column `conut` on the `Emoticon` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Emoticon" DROP COLUMN "conut",
ADD COLUMN     "count" INTEGER NOT NULL DEFAULT 0;
