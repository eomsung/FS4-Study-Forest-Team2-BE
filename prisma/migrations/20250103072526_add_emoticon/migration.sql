/*
  Warnings:

  - You are about to drop the column `tags` on the `StudyGroup` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StudyGroup" DROP COLUMN "tags";

-- CreateTable
CREATE TABLE "Emoticon" (
    "id" TEXT NOT NULL,
    "emoticons" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "number" INTEGER NOT NULL DEFAULT 0,
    "studyGroupId" TEXT NOT NULL,

    CONSTRAINT "Emoticon_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Emoticon" ADD CONSTRAINT "Emoticon_studyGroupId_fkey" FOREIGN KEY ("studyGroupId") REFERENCES "StudyGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
