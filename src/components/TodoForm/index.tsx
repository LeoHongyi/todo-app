import { useState, type FormEvent } from "react";
import { useAppDispatch } from "../../hooks";
import { addTodo } from "../../store/todoSlice";
import styles from "./TodoForm.module.css";

const TodoForm: React.FC = () => {
  const [text, setText] = useState<string>("");
  const dispatch = useAppDispatch();

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (text.trim()) {
      dispatch(addTodo(text.trim()));
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.todoForm}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="add a new task..."
        className={styles.todoInput}
      />
      <button type="submit" className={styles.addButton}>
        add
      </button>
    </form>
  );
};

export default TodoForm;
