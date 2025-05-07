import { configureStore } from "@reduxjs/toolkit";
import type { TodoState, FilterType } from "../types";

// 创建一个简单的reducer mock
export const createTodoReducerMock = (initialState: TodoState) => {
  return {
    todos: initialState,
    reducer: (state = initialState, action: any) => {
      if (action.type === "todos/setFilter") {
        return {
          ...state,
          filter: action.payload,
        };
      }
      return state;
    },
  };
};

export const createMockStore = (initialState: TodoState) => {
  const todoReducer = createTodoReducerMock(initialState);

  return configureStore({
    reducer: {
      todos: todoReducer.reducer,
    },
  });
};

export const mockSelectFilter = (state: { todos: TodoState }): FilterType =>
  state.todos.filter;
