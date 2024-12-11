import express from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { assert } from "superstruct";
import * as dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  const study = await prisma.studyGroup.findMany({});
  res.send(study);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started`);
});
