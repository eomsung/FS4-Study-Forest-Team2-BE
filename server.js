import express, { application } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { assert } from "superstruct";
import * as dotenv from "dotenv";
import cors from "cors";
import cron from "node-cron";

dotenv.config();
const prisma = new PrismaClient();
const app = express();

const asyncHandler = (handler) => {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      if (
        e.name === "StructError" ||
        e instanceof Prisma.PrismaClientValidationError
      ) {
        res.status(400).send({ message: e.message });
      } else if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
        res.sendStatus(404);
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
};

app.use(cors());
app.use(express.json());

cron.schedule("0 0 * * 1", async () => {
  //매주 초기화하는 코드
  try {
    await prisma.todo.updateMany({
      data: {
        done: [false, false, false, false, false, false, false],
      },
    });
    console.log("Todo items reset successfully.");
  } catch (error) {
    console.error("Error resetting Todo items:", error);
  }
});

app.get("/", async (req, res) => {
  const study = await prisma.studyGroup.findMany({});
  res.send(study);
}); // test

// 스터디 조회 api , page,
app.get(
  "/study",
  asyncHandler(async (req, res) => {
    const {
      page = 1,
      pageSize = 3,
      orderBy = "recent",
      keyword = "",
    } = req.query;
    const offset = (page - 1) * pageSize;
    let sortOption;
    switch (orderBy) {
      case "recent":
        sortOption = { createdAt: "desc" };
        break;
      case "oldest":
        sortOption = { createdAt: "asc" };
        break;
      case "highestPoint":
        sortOption = { point: "desc" };
        break;
      case "lowestPoints":
        sortOption = { point: "asc" };
        break;
      default:
        sortOption = { createdAt: "desc" };
        break;
    }

    const search = keyword
      ? {
          OR: [
            { nickname: { contains: keyword, mode: "insensitive" } },
            { studyname: { contains: keyword, mode: "insensitive" } },
          ],
        }
      : {};
    const study = await prisma.studyGroup.findMany({
      where: search,
      skip: parseInt(offset),
      take: parseInt(pageSize),
      orderBy: sortOption,
      include: {
        Emoticon: {
          orderBy: {
            count: "desc",
          },
          take: 3,
        },
      },
    });
    const totalCount = await prisma.studyGroup.count({
      where: search,
    });
    res.send({ list: study, totalCount });
  })
);

app.post("/study", async (req, res) => {
  try {
    const { nickname, studyname, description, password, point, img } = req.body;
    const newStudyGroup = await prisma.studyGroup.create({
      data: {
        nickname,
        studyname,
        description,
        password,
        img,
        point: point || 0,
      },
    });
    res.status(201).json({ id: newStudyGroup.id });
  } catch (error) {
    console.error("Error creating study group:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 특정 스터디 조회 api  ,
app.get(
  "/study/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;

    const study = await prisma.studyGroup.findUniqueOrThrow({
      where: { id },
      include: {
        Emoticon: {
          orderBy: {
            count: "desc",
          },
        },
      },
    });

    res.send(study);
  })
);

app.delete(
  "/study/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    await prisma.studyGroup.delete({
      where: { id },
    });

    res.status(200).json({ message: "studygroup deleted successfully" });
  })
);

// Todo api //
app.get(
  "/study/:id/todo",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const todo = await prisma.todo.findMany({
      where: { studyGroupId: id },
    });
    res.send(todo);
  })
);

app.post(
  "/study/:id/todo",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const studyGroup = await prisma.studyGroup.findUnique({
      where: { id },
    });

    if (!studyGroup) {
      return res.status(404).json({ error: "Study group not found" });
    }

    const newTodo = await prisma.todo.create({
      data: {
        text,
        studyGroupId: id,
      },
    });

    res.status(201).json(newTodo);
  })
);

app.post(
  "/study/:studyGroupId/todos",
  asyncHandler(async (req, res) => {
    const { studyGroupId } = req.params;
    const todos = req.body;
    const studyGroup = await prisma.studyGroup.findUnique({
      where: { id: studyGroupId },
    });

    if (!studyGroup) {
      return res.status(404).json({ error: "Study group not found" });
    }

    const newTodos = await prisma.todo.createMany({
      data: todos.map((todo) => ({
        text: todo.text,
        studyGroupId: studyGroupId,
        done: todo.done || false,
        createdAt: todo.createdAt,
        updatedAt: todo.updatedAt,
        id: todo.id,
      })),
    });

    res.status(201).json({
      message: `${newTodos.count} todos created successfully.`,
      createdCount: newTodos.count,
    });
  })
);

app.delete(
  "/study/:studyGroupId/todo/:todoId",
  asyncHandler(async (req, res) => {
    const { studyGroupId, todoId } = req.params;
    const parsedTodoId = parseInt(todoId, 10);
    const studyGroup = await prisma.studyGroup.findUnique({
      where: { id: studyGroupId },
    });

    if (!studyGroup) {
      return res.status(404).json({ error: "Study group not found" });
    }
    const deletedTodo = await prisma.todo.delete({
      where: {
        id: parsedTodoId,
        studyGroupId: studyGroupId,
      },
    });

    res.status(200).json({ message: "Todo deleted successfully", deletedTodo });
  })
);

app.patch(
  "/study/:studyGroupId/point",
  asyncHandler(async (req, res) => {
    const { studyGroupId } = req.params;
    const { point } = req.body; // 클라이언트에서 전달한 새로운 포인트 값

    // 포인트 값 검증
    if (typeof point !== "number" || point < 0) {
      return res.status(400).json({ error: "Invalid point value" });
    }

    // 해당 studyGroup을 찾음
    const studyGroup = await prisma.studyGroup.findUnique({
      where: { id: studyGroupId },
    });

    if (!studyGroup) {
      return res.status(404).json({ error: "Study group not found" });
    }

    // 포인트 업데이트
    const updatedStudyGroup = await prisma.studyGroup.update({
      where: { id: studyGroupId },
      data: { point: point },
    });

    // 업데이트된 studyGroup 반환
    res.status(200).json({
      message: "Study group point updated successfully",
      studyGroup: updatedStudyGroup,
    });
  })
);

app.delete(
  //전부 삭제하기
  "/study/:studyGroupId/todo",
  asyncHandler(async (req, res) => {
    const { studyGroupId } = req.params;
    const studyGroup = await prisma.studyGroup.findUnique({
      where: { id: studyGroupId },
    });

    if (!studyGroup) {
      return res.status(404).json({ error: "Study group not found" });
    }
    const deletedTodo = await prisma.todo.deleteMany({
      where: {
        studyGroupId: studyGroupId,
      },
    });
    res.status(200).json({
      message: "Todos deleted successfully",
      deletedCount: deletedTodo.count,
    });
  })
);

app.patch(
  //
  "/study/:studyGroupId/todo/:todoId",
  asyncHandler(async (req, res) => {
    const { studyGroupId, todoId } = req.params;
    const parsedTodoId = parseInt(todoId, 10);
    const { dayIndex, done } = req.body;

    const studyGroup = await prisma.studyGroup.findUnique({
      where: { id: studyGroupId },
    });

    if (!studyGroup) {
      return res.status(404).json({ error: "Study group not found" });
    }

    const todo = await prisma.todo.findUnique({
      where: {
        id: parsedTodoId,
        studyGroupId: studyGroupId,
      },
    });

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    const updatedDone = [...todo.done];
    updatedDone[dayIndex] = done;

    const patchTodo = await prisma.todo.update({
      where: {
        id: parsedTodoId,
        studyGroupId: studyGroupId,
      },
      data: {
        done: updatedDone,
      },
    });

    res.status(200).json(patchTodo);
  })
);

// emoticon api  //
app.post(
  "/study/:id/emoticon",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { emoticon } = req.body;

    const studyGroup = await prisma.studyGroup.findUnique({
      where: { id },
    });

    if (!studyGroup) {
      return res.status(404).json({ error: "Study group not found" });
    }

    let existingEmoticon = await prisma.emoticon.findFirst({
      where: {
        studyGroupId: id,
        emoticons: emoticon,
      },
    });

    if (existingEmoticon) {
      existingEmoticon = await prisma.emoticon.update({
        where: { id: existingEmoticon.id },
        data: {
          count: {
            increment: 1,
          },
        },
      });
    } else {
      existingEmoticon = await prisma.emoticon.create({
        data: {
          studyGroupId: id,
          emoticons: emoticon,
          count: 1,
        },
      });
    }

    res.status(201).json(existingEmoticon);
  })
);

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server started`);
});
