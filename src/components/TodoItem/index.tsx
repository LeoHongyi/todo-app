import { useState, type KeyboardEvent } from "react";
import { useAppDispatch } from "../../hooks";
import { toggleTodo, deleteTodo, editTodo } from "../../store/todoSlice";
import type { Todo } from "../../types";
import styles from "./TodoItem.module.css";

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>(todo.text);

  const handleToggle = (): void => {
    dispatch(toggleTodo(todo.id));
  };

  const handleDelete = (): void => {
    dispatch(deleteTodo(todo.id));
  };

  const handleEdit = (): void => {
    setIsEditing(true);
  };

  const handleSave = (): void => {
    if (editText.trim()) {
      dispatch(editTodo({ id: todo.id, text: editText.trim() }));
      setIsEditing(false);
    }
  };

  const handleCancel = (): void => {
    setIsEditing(false);
    setEditText(todo.text);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <li
      className={`${styles.todoItem} ${todo.completed ? styles.completed : ""}`}
    >
      {isEditing ? (
        <div className={styles.todoEdit}>
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className={styles.editInput}
          />
          <div className={styles.editButtons}>
            <button onClick={handleSave} className={styles.saveButton}>
              save
            </button>
            <button onClick={handleCancel} className={styles.cancelButton}>
              cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.todoContent}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={handleToggle}
              className={styles.todoCheckbox}
            />
            <span className={styles.todoText}>{todo.text}</span>
          </div>
          <div className={styles.todoActions}>
            <button onClick={handleEdit} className={styles.editButton}>
              edit
            </button>
            <button onClick={handleDelete} className={styles.deleteButton}>
              delete
            </button>
          </div>
        </>
      )}
    </li>
  );
};

export default TodoItem;
