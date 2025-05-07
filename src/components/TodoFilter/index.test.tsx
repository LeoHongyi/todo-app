import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import TodoFilter from "./index";
import { createMockStore } from "../../test/store";
import * as todoSliceModule from "../../store/todoSlice";
import type { FilterType } from "../../types";
import styles from "./TodoFilter.module.css";

// Mock store selectors and actions
vi.mock("../../store/todoSlice", async () => {
  const actual = await vi.importActual("../../store/todoSlice");
  return {
    ...(actual as any),
    selectFilter: vi.fn((state) => state.todos.filter),
    setFilter: vi.fn((filter) => ({
      type: "todos/setFilter",
      payload: filter,
    })),
  };
});

describe("TodoFilter Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all filter buttons", () => {
    const mockStore = createMockStore({
      todos: [],
      filter: "all",
    });

    render(
      <Provider store={mockStore}>
        <TodoFilter />
      </Provider>
    );

    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("highlights the currently selected filter", () => {
    const testFilter = (filter: FilterType) => {
      const mockStore = createMockStore({
        todos: [],
        filter,
      });

      const { unmount } = render(
        <Provider store={mockStore}>
          <TodoFilter />
        </Provider>
      );

      const buttonText = filter.charAt(0).toUpperCase() + filter.slice(1);
      const activeButton = screen.getByText(buttonText);

      expect(activeButton.className).toMatch(/active/);

      unmount();
    };

    testFilter("all");
    testFilter("active");
    testFilter("completed");
  });

  it("dispatches setFilter action when a filter button is clicked", () => {
    const mockStore = createMockStore({
      todos: [],
      filter: "all",
    });

    const setFilterSpy = vi.spyOn(todoSliceModule, "setFilter");

    render(
      <Provider store={mockStore}>
        <TodoFilter />
      </Provider>
    );

    fireEvent.click(screen.getByText("Active"));

    expect(setFilterSpy).toHaveBeenCalledWith("active");

    fireEvent.click(screen.getByText("Completed"));

    expect(setFilterSpy).toHaveBeenCalledWith("completed");

    fireEvent.click(screen.getByText("All"));

    expect(setFilterSpy).toHaveBeenCalledWith("all");

    expect(setFilterSpy).toHaveBeenCalledTimes(3);
  });

  it("has correct CSS class names", () => {
    const mockStore = createMockStore({
      todos: [],
      filter: "all",
    });

    render(
      <Provider store={mockStore}>
        <TodoFilter />
      </Provider>
    );

    const container = screen.getByText("All").closest("div");

    expect(container.className).toMatch(/filterContainer/);

    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button.className).toMatch(/filterButton/);
    });

    const activeButton = screen.getByText("All");
    expect(activeButton.className).toMatch(/active/);
  });
});
