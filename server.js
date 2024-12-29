import 'dotenv/config'; // .env 파일 로드

import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3100;
const DATABASE_URL = process.env.DATABASE_URL;

// 미들웨어 설정
app.use(cors());
app.use(express.json()); // application/json 파싱

let todos = [
  { id: 1, text: '미라클모닝 6시 기상' },
  { id: 2, text: '아침 챙겨 먹기' },
  { id: 3, text: 'React 스터디 책 1챕터 읽기' },
  { id: 4, text: '스트레칭' },
  { id: 5, text: '영양제 챙겨 먹기' },
  { id: 6, text: '사이드 프로젝트' },
  { id: 7, text: '물 2L 먹기' },
];

// 페이지네이션을 위한 헬퍼 함수
const paginate = (array, page, pageSize) => {
  const offset = (page - 1) * pageSize;
  return array.slice(offset, offset + pageSize);
};

// 라우트 설정
app.get('/todos', (req, res) => {
  const { page = 1, pageSize = 5 } = req.query;
  const paginatedTodos = paginate(todos, parseInt(page), parseInt(pageSize));
  res.json({ data: paginatedTodos, page, pageSize });
});

app.get('/todos/:id', (req, res) => {
  const { id } = req.params; // URL에서 id 추출
  const todo = todos.find((todo) => todo.id === parseInt(id)); // id로 Todo 찾기

  if (todo) {
    res.json(todo); // Todo를 JSON 형식으로 응답
  } else {
    res.status(404).json({ message: '해당 ID의 Todo를 찾을 수 없습니다.' }); // 에러 메시지
  }
});

app.post('/todos', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: 'Todo 텍스트는 필수입니다.' });
  }

  const newTodo = {
    id: todos.length + 1,
    text,
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  const todoIndex = todos.findIndex(todo => todo.id === parseInt(id));
  if (todoIndex !== -1) {
    todos.splice(todoIndex, 1);
    res.status(200).json({ message: 'Todo가 삭제되었습니다.' });
  } else {
    res.status(404).json({ message: 'Todo를 찾을 수 없습니다.' });
  }
});

// 서버 실행
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
  console.log(`데이터베이스 URL: ${DATABASE_URL}`);
});
