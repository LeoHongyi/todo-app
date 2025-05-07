import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import TodoFilter from "./components/TodoFilter";
import "./App.css";

function App() {
  return (
    <div className="todo-app">
      <h1>Todo List</h1>
      <TodoForm />
      <TodoFilter />
      <TodoList />
    </div>
  );
}

export default App;
