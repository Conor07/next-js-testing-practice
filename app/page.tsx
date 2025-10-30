"use client";

import TodoList from "./components/TodoList/TodoList";
import AddTodo from "./components/AddTodo/AddTodo";
import { useEffect, useState } from "react";
import { Todo } from "@/types/Todo";
import fetchTodos from "@/lib/fetchTodos/fetchTodos";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const getTodos = async () => {
    const todosArray = await fetchTodos();

    if (todosArray.length > 0) {
      setTodos(todosArray);
    } else {
      setTodos([]);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <>
      <AddTodo setTodos={setTodos} />
      <TodoList todos={todos} setTodos={setTodos} />
    </>
  );
}
