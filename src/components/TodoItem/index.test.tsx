import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import TodoItem from "./index";
import { createMockStore } from "../../test/store";
import * as todoSliceModule from "../../store/todoSlice";

vi.mock("../../store/todoSlice", async () => {
  const actual = await vi.importActual("../../store/todoSlice");
  return {
    ...(actual as any),
    toggleTodo: vi.fn((id) => ({
      type: "todos/toggleTodo",
      payload: id,
    })),
    deleteTodo: vi.fn((id) => ({
      type: "todos/deleteTodo",
      payload: id,
    })),
    editTodo: vi.fn((data) => ({
      type: "todos/editTodo",
      payload: data,
    })),
  };
});

vi.mock("../../hooks", () => ({
  useAppDispatch: () => vi.fn((action) => action),
}));

describe("TodoItem Component", () => {
  // 重置mock函数
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockTodo = {
    id: "1",
    text: "Test todo item",
    completed: false,
  };

  const completedMockTodo = {
    id: "2",
    text: "Completed todo item",
    completed: true,
  };

  it("renders todo item correctly", () => {
    render(
      <Provider store={createMockStore({ todos: [], filter: "all" })}>
        <TodoItem todo={mockTodo} />
      </Provider>
    );

    expect(screen.getByText("Test todo item")).toBeInTheDocument();

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    expect(screen.getByText("edit")).toBeInTheDocument();
    expect(screen.getByText("delete")).toBeInTheDocument();
  });

  it("renders completed todo item with correct styles", () => {
    render(
      <Provider store={createMockStore({ todos: [], filter: "all" })}>
        <TodoItem todo={completedMockTodo} />
      </Provider>
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();

    const listItem = screen.getByText("Completed todo item").closest("li");
    expect(listItem.className).toMatch(/completed/);
  });

  it("toggles todo completion status when checkbox is clicked", () => {
    const toggleTodoSpy = vi.spyOn(todoSliceModule, "toggleTodo");

    render(
      <Provider store={createMockStore({ todos: [], filter: "all" })}>
        <TodoItem todo={mockTodo} />
      </Provider>
    );

    fireEvent.click(screen.getByRole("checkbox"));

    expect(toggleTodoSpy).toHaveBeenCalledWith("1");
  });

  it("deletes todo when delete button is clicked", () => {
    const deleteTodoSpy = vi.spyOn(todoSliceModule, "deleteTodo");

    render(
      <Provider store={createMockStore({ todos: [], filter: "all" })}>
        <TodoItem todo={mockTodo} />
      </Provider>
    );

    fireEvent.click(screen.getByText("delete"));

    expect(deleteTodoSpy).toHaveBeenCalledWith("1");
  });

  it("enters edit mode when edit button is clicked", () => {
    render(
      <Provider store={createMockStore({ todos: [], filter: "all" })}>
        <TodoItem todo={mockTodo} />
      </Provider>
    );

    fireEvent.click(screen.getByText("edit"));

    expect(screen.getByDisplayValue("Test todo item")).toBeInTheDocument();
    expect(screen.getByText("save")).toBeInTheDocument();
    expect(screen.getByText("cancel")).toBeInTheDocument();
  });

  it("updates todo when save button is clicked in edit mode", () => {
    const editTodoSpy = vi.spyOn(todoSliceModule, "editTodo");

    render(
      <Provider store={createMockStore({ todos: [], filter: "all" })}>
        <TodoItem todo={mockTodo} />
      </Provider>
    );

    fireEvent.click(screen.getByText("edit"));

    const input = screen.getByDisplayValue("Test todo item");
    fireEvent.change(input, { target: { value: "Updated todo text" } });

    fireEvent.click(screen.getByText("save"));

    expect(editTodoSpy).toHaveBeenCalledWith({
      id: "1",
      text: "Updated todo text",
    });
  });

  it("cancels editing when cancel button is clicked", () => {
    const editTodoSpy = vi.spyOn(todoSliceModule, "editTodo");

    render(
      <Provider store={createMockStore({ todos: [], filter: "all" })}>
        <TodoItem todo={mockTodo} />
      </Provider>
    );

    // 进入编辑模式
    fireEvent.click(screen.getByText("edit"));

    // 修改输入
    const input = screen.getByDisplayValue("Test todo item");
    fireEvent.change(input, { target: { value: "This should not be saved" } });

    // 点击取消
    fireEvent.click(screen.getByText("cancel"));

    // 验证回到非编辑模式 - 使用更可靠的方法
    expect(screen.queryByText("save")).not.toBeInTheDocument();
    expect(screen.queryByText("cancel")).not.toBeInTheDocument();

    // 验证显示原始文本
    expect(screen.getByText("Test todo item")).toBeInTheDocument();

    // 验证编辑按钮重新出现
    expect(screen.getByText("edit")).toBeInTheDocument();

    expect(editTodoSpy).not.toHaveBeenCalled();
  });

  it("saves todo when Enter key is pressed in edit mode", () => {
    const editTodoSpy = vi.spyOn(todoSliceModule, "editTodo");

    render(
      <Provider store={createMockStore({ todos: [], filter: "all" })}>
        <TodoItem todo={mockTodo} />
      </Provider>
    );

    fireEvent.click(screen.getByText("edit"));

    const input = screen.getByDisplayValue("Test todo item");
    fireEvent.change(input, { target: { value: "Updated with Enter" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(editTodoSpy).toHaveBeenCalledWith({
      id: "1",
      text: "Updated with Enter",
    });
  });

  it("cancels editing when Escape key is pressed", () => {
    const editTodoSpy = vi.spyOn(todoSliceModule, "editTodo");

    render(
      <Provider store={createMockStore({ todos: [], filter: "all" })}>
        <TodoItem todo={mockTodo} />
      </Provider>
    );

    fireEvent.click(screen.getByText("edit"));

    const input = screen.getByDisplayValue("Test todo item");
    fireEvent.change(input, { target: { value: "This should not be saved" } });
    fireEvent.keyDown(input, { key: "Escape" });

    expect(screen.queryByText("save")).not.toBeInTheDocument();
    expect(screen.queryByText("cancel")).not.toBeInTheDocument();

    expect(screen.getByText("Test todo item")).toBeInTheDocument();

    expect(screen.getByText("edit")).toBeInTheDocument();

    expect(editTodoSpy).not.toHaveBeenCalled();
  });

  it("does not save empty todo text", () => {
    const editTodoSpy = vi.spyOn(todoSliceModule, "editTodo");

    render(
      <Provider store={createMockStore({ todos: [], filter: "all" })}>
        <TodoItem todo={mockTodo} />
      </Provider>
    );

    fireEvent.click(screen.getByText("edit"));

    const input = screen.getByDisplayValue("Test todo item");
    fireEvent.change(input, { target: { value: "" } });

    fireEvent.click(screen.getByText("save"));

    expect(editTodoSpy).not.toHaveBeenCalled();
  });

  it("trims whitespace from edited text", () => {
    const editTodoSpy = vi.spyOn(todoSliceModule, "editTodo");

    render(
      <Provider store={createMockStore({ todos: [], filter: "all" })}>
        <TodoItem todo={mockTodo} />
      </Provider>
    );

    fireEvent.click(screen.getByText("edit"));

    const input = screen.getByDisplayValue("Test todo item");
    fireEvent.change(input, { target: { value: "  Trimmed text  " } });

    fireEvent.click(screen.getByText("save"));

    expect(editTodoSpy).toHaveBeenCalledWith({
      id: "1",
      text: "Trimmed text",
    });
  });

  it("has correct CSS class names", () => {
    render(
      <Provider store={createMockStore({ todos: [], filter: "all" })}>
        <TodoItem todo={mockTodo} />
      </Provider>
    );

    const listItem = screen.getByText("Test todo item").closest("li");
    expect(listItem.className).toMatch(/todoItem/);

    const content = screen.getByText("Test todo item").closest("div");
    expect(content.className).toMatch(/todoContent/);

    const actions = screen.getByText("edit").closest("div");
    expect(actions.className).toMatch(/todoActions/);
  });
});
