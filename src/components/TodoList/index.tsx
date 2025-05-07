import { useAppSelector } from "../../hooks";
import { selectFilteredTodos } from "../../store/todoSlice";
import TodoItem from "../TodoItem";
import styles from "./TodoList.module.css";

const TodoList: React.FC = () => {
  const todos = useAppSelector(selectFilteredTodos);

  if (todos.length === 0) {
    return <p className={styles.emptyMessage}> No task </p>;
  }

  return (
    <ul className={styles.todoList}>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
};

export default TodoList;
