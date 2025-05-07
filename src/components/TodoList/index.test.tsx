import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import TodoList from "./index";
import { createMockStore } from "../../test/store";
import * as todoSliceModule from "../../store/todoSlice";

let capturedProps = [];

vi.mock("../TodoItem", () => ({
  default: (props) => {
    capturedProps.push(props);
    return <div data-testid="todo-item">{props.todo.text}</div>;
  },
}));

vi.mock("../../store/todoSlice", async () => {
  const actual = await vi.importActual("../../store/todoSlice");
  return {
    ...(actual as any),
    selectFilteredTodos: vi.fn(),
  };
});

vi.mock("../../hooks", () => ({
  useAppSelector: (selector) => selector(),
}));

describe("TodoList Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    capturedProps = [];
  });

  it("correctly passes todo props to TodoItem components", () => {
    const mockTodos = [
      {
        id: "complex-id-1",
        text: "Complex task 1",
        completed: true,
      },
      {
        id: "complex-id-2",
        text: "Complex task 2",
        completed: false,
      },
    ];

    vi.mocked(todoSliceModule.selectFilteredTodos).mockReturnValue(mockTodos);

    render(
      <Provider store={createMockStore({ todos: mockTodos, filter: "all" })}>
        <TodoList />
      </Provider>
    );

    expect(capturedProps).toHaveLength(2);
    expect(capturedProps[0].todo).toEqual(mockTodos[0]);
    expect(capturedProps[1].todo).toEqual(mockTodos[1]);

    expect(screen.getByText("Complex task 1")).toBeInTheDocument();
    expect(screen.getByText("Complex task 2")).toBeInTheDocument();
  });
});
