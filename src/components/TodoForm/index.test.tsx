import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import TodoForm from "./index";
import { createMockStore } from "../../test/store";
import * as todoSliceModule from "../../store/todoSlice";

vi.mock("../../store/todoSlice", async () => {
  const actual = await vi.importActual("../../store/todoSlice");
  return {
    ...(actual as any),
    addTodo: vi.fn((text) => ({
      type: "todos/addTodo",
      payload: text,
    })),
  };
});

vi.mock("../../hooks", () => ({
  useAppDispatch: () => vi.fn((action) => action),
}));

describe("TodoForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders form with input and button", () => {
    // 创建mock store
    const mockStore = createMockStore({
      todos: [],
      filter: "all",
    });

    render(
      <Provider store={mockStore}>
        <TodoForm />
      </Provider>
    );

    expect(
      screen.getByPlaceholderText("add a new task...")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
  });

  it("updates input value when user types", () => {
    const mockStore = createMockStore({
      todos: [],
      filter: "all",
    });

    render(
      <Provider store={mockStore}>
        <TodoForm />
      </Provider>
    );

    const input = screen.getByPlaceholderText("add a new task...");

    fireEvent.change(input, { target: { value: "New todo item" } });

    expect(input).toHaveValue("New todo item");
  });

  it("dispatches addTodo action on form submission", () => {
    const mockStore = createMockStore({
      todos: [],
      filter: "all",
    });

    const addTodoSpy = vi.spyOn(todoSliceModule, "addTodo");

    render(
      <Provider store={mockStore}>
        <TodoForm />
      </Provider>
    );

    const input = screen.getByPlaceholderText("add a new task...");
    const button = screen.getByRole("button", { name: /add/i });

    fireEvent.change(input, { target: { value: "New todo item" } });
    fireEvent.click(button);

    expect(addTodoSpy).toHaveBeenCalledWith("New todo item");
    expect(input).toHaveValue("");
  });

  it("dispatches addTodo action when pressing Enter", () => {
    const mockStore = createMockStore({
      todos: [],
      filter: "all",
    });

    const addTodoSpy = vi.spyOn(todoSliceModule, "addTodo");

    render(
      <Provider store={mockStore}>
        <TodoForm />
      </Provider>
    );

    const input = screen.getByPlaceholderText("add a new task...");

    fireEvent.change(input, { target: { value: "Task via Enter key" } });
    fireEvent.submit(input.closest("form"));

    expect(addTodoSpy).toHaveBeenCalledWith("Task via Enter key");
    expect(input).toHaveValue("");
  });

  it("does not dispatch addTodo for empty input", () => {
    const mockStore = createMockStore({
      todos: [],
      filter: "all",
    });

    const addTodoSpy = vi.spyOn(todoSliceModule, "addTodo");

    render(
      <Provider store={mockStore}>
        <TodoForm />
      </Provider>
    );

    const button = screen.getByRole("button", { name: /add/i });

    fireEvent.click(button);

    expect(addTodoSpy).not.toHaveBeenCalled();
  });

  it("trims whitespace from input before dispatching", () => {
    const mockStore = createMockStore({
      todos: [],
      filter: "all",
    });

    const addTodoSpy = vi.spyOn(todoSliceModule, "addTodo");

    render(
      <Provider store={mockStore}>
        <TodoForm />
      </Provider>
    );

    const input = screen.getByPlaceholderText("add a new task...");
    const button = screen.getByRole("button", { name: /add/i });

    fireEvent.change(input, { target: { value: "  Task with spaces  " } });
    fireEvent.click(button);

    expect(addTodoSpy).toHaveBeenCalledWith("Task with spaces");
    expect(input).toHaveValue("");
  });

  it("does not dispatch for whitespace-only input", () => {
    const mockStore = createMockStore({
      todos: [],
      filter: "all",
    });

    const addTodoSpy = vi.spyOn(todoSliceModule, "addTodo");

    render(
      <Provider store={mockStore}>
        <TodoForm />
      </Provider>
    );

    const input = screen.getByPlaceholderText("add a new task...");
    const button = screen.getByRole("button", { name: /add/i });

    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.click(button);

    expect(addTodoSpy).not.toHaveBeenCalled();
  });

  it("has correct CSS class names", () => {
    const mockStore = createMockStore({
      todos: [],
      filter: "all",
    });

    render(
      <Provider store={mockStore}>
        <TodoForm />
      </Provider>
    );

    const form = screen.getByRole("form");
    expect(form.className).toMatch(/todoForm/);

    const input = screen.getByPlaceholderText("add a new task...");
    expect(input.className).toMatch(/todoInput/);

    const button = screen.getByRole("button", { name: /add/i });
    expect(button.className).toMatch(/addButton/);
  });
});
