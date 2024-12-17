-- AlterTable
ALTER TABLE "StudyGroup" ADD COLUMN     "img" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
