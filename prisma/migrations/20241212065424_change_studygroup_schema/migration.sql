/*
  Warnings:

  - You are about to drop the column `name` on the `StudyGroup` table. All the data in the column will be lost.
  - Added the required column `nickname` to the `StudyGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `StudyGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studyname` to the `StudyGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StudyGroup" DROP COLUMN "name",
ADD COLUMN     "nickname" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "studyname" TEXT NOT NULL;
