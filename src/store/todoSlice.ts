import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Todo, TodoState, FilterType } from "../types";
import type { RootState } from "./index";

const loadTodosFromStorage = (): Todo[] => {
  try {
    const storedTodos = localStorage.getItem("todos");
    return storedTodos ? JSON.parse(storedTodos) : [];
  } catch (error) {
    console.error("Error loading todos from localStorage:", error);
    return [];
  }
};

const saveTodosToStorage = (todos: Todo[]): void => {
  try {
    localStorage.setItem("todos", JSON.stringify(todos));
  } catch (error) {
    console.error("Error saving todos to localStorage:", error);
  }
};

const initialState: TodoState = {
  todos: loadTodosFromStorage(),
  filter: "all",
};

export const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      const newTodo: Todo = {
        id: Date.now(),
        text: action.payload,
        completed: false,
      };
      state.todos.push(newTodo);
      saveTodosToStorage(state.todos);
    },
    toggleTodo: (state, action: PayloadAction<number>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        saveTodosToStorage(state.todos);
      }
    },
    deleteTodo: (state, action: PayloadAction<number>) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      saveTodosToStorage(state.todos);
    },
    editTodo: (state, action: PayloadAction<{ id: number; text: string }>) => {
      const { id, text } = action.payload;
      const todo = state.todos.find((todo) => todo.id === id);
      if (todo) {
        todo.text = text;
        saveTodosToStorage(state.todos);
      }
    },
    setFilter: (state, action: PayloadAction<FilterType>) => {
      state.filter = action.payload;
    },
  },
});

export const { addTodo, toggleTodo, deleteTodo, editTodo, setFilter } =
  todoSlice.actions;

export const selectTodos = (state: RootState): Todo[] => state.todos.todos;
export const selectFilter = (state: RootState): FilterType =>
  state.todos.filter;
export const selectFilteredTodos = (state: RootState): Todo[] => {
  const todos = state.todos.todos;
  const filter = state.todos.filter;

  switch (filter) {
    case "all":
      return todos;
    case "active":
      return todos.filter((todo) => !todo.completed);
    case "completed":
      return todos.filter((todo) => todo.completed);
    default:
      return todos;
  }
};

export default todoSlice.reducer;
