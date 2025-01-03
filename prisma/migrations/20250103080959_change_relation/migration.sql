-- DropIndex
DROP INDEX "Emoticon_studyGroupId_key";

-- AlterTable
ALTER TABLE "Emoticon" ALTER COLUMN "emoticons" SET NOT NULL,
ALTER COLUMN "emoticons" DROP DEFAULT,
ALTER COLUMN "emoticons" SET DATA TYPE TEXT;
