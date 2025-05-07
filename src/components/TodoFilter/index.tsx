import { useAppSelector, useAppDispatch } from "../../hooks";
import { setFilter, selectFilter } from "../../store/todoSlice";
import type { FilterType } from "../../types";
import styles from "./TodoFilter.module.css";

const TodoFilter: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentFilter = useAppSelector(selectFilter);

  const handleFilterChange = (filter: FilterType): void => {
    dispatch(setFilter(filter));
  };

  return (
    <div className={styles.filterContainer}>
      <button
        className={`${styles.filterButton} ${
          currentFilter === "all" ? styles.active : ""
        }`}
        onClick={() => handleFilterChange("all")}
      >
        All
      </button>
      <button
        className={`${styles.filterButton} ${
          currentFilter === "active" ? styles.active : ""
        }`}
        onClick={() => handleFilterChange("active")}
      >
        Active
      </button>
      <button
        className={`${styles.filterButton} ${
          currentFilter === "completed" ? styles.active : ""
        }`}
        onClick={() => handleFilterChange("completed")}
      >
        Completed
      </button>
    </div>
  );
};

export default TodoFilter;
