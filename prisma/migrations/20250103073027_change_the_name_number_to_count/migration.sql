/*
  Warnings:

  - You are about to drop the column `number` on the `Emoticon` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Emoticon" DROP COLUMN "number",
ADD COLUMN     "conut" INTEGER NOT NULL DEFAULT 0;
