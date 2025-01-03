/*
  Warnings:

  - A unique constraint covering the columns `[studyGroupId]` on the table `Emoticon` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Emoticon_studyGroupId_key" ON "Emoticon"("studyGroupId");
