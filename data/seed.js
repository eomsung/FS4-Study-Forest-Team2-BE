import { PrismaClient } from "@prisma/client";
import mockData from "./mock.js";
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.studyGroup.deleteMany({});
    await prisma.studyGroup.createMany({
      data: mockData,
      skipDuplicates: true,
    });
  } catch (e) {
    throw e;
  } finally {
    await prisma.$disconnect();
  }
}

// 실행
main().catch((e) => {
  process.exit(1);
});
