import React, { useState, useEffect } from "react";
import "./App.css";
import logo from "./image/img_logo.png";
import Time from "./Time";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTodos = async (page = currentPage, pageSize = pageSize) => {
    try {
      const response = await fetch(
        `http://localhost:3100/todos?page=${page}&pageSize=${pageSize}`
      );
      const data = await response.json();
      setTodos(data.data);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  };

  const handleAddTodo = async () => {
    if (newTodo.trim() === "") return;
    const newTodoItem = { text: newTodo };

    try {
      const response = await fetch("http://localhost:3100/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodoItem),
      });

      if (response.ok) {
        const addedTodo = await response.json();
        setTodos([addedTodo, ...todos]);
        setNewTodo("");
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const response = await fetch(`http://localhost:3100/todos/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setTodos(todos.filter((todo) => todo.id !== id));
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  useEffect(() => {
    fetchTodos(currentPage, pageSize);
  }, [currentPage, pageSize]);

  return (
    <>
      <img className="logo" src={logo} alt={"로고"} />
      <div className="todo-list">
        <h1>오늘의 할 일</h1>
        <p className="time-text">현재 시간</p>
        <Time />
        <button
          className="button-add"
          onClick={() => {
            setNewTodo("");
            setIsModalOpen(true);
          }}
        >
          목록 수정
        </button>
        {todos.length > 0 ? (
          <ul className="todo-ul">
            {todos.map((todo) => (
              <li className="todo-li" key={todo.id}>
                {todo.text}
              </li>
            ))}
          </ul>
        ) : (
          <p>오늘의 할 일이 아직 없어요! 추가해보세요!</p>
        )}
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>할 일 관리</h2>
            {/* 추가 기능 */}
            <div className="todo-add-section">
              <input
                className="todo-input"
                type="text"
                placeholder="새로운 할 일을 추가해보세요!"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
              />
              <button className="button-confirm" onClick={handleAddTodo}>
                추가
              </button>
            </div>
            {/* 삭제 기능 */}
            <div className="todo-delete-section">
              <ul className="todo-ul">
                {todos.map((todo) => (
                  <li className="todo-li" key={todo.id}>
                    {todo.text}
                    <button
                      className="button-delete"
                      onClick={() => handleDeleteTodo(todo.id)}
                    >
                      삭제
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {/* 모달 닫기 */}
            <button
              className="button-cancel"
              onClick={() => setIsModalOpen(false)}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
