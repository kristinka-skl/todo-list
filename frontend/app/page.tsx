import TaskForm from "./Components/TaskForm/TaskForm";
import TasksReminderCard from "./Components/TasksList/TasksList";
import css from "./page.module.css";

export default function Home() {
  return (
    <div className={css.page}>
      <main className={css.main}>
        <TaskForm/>
        <TasksReminderCard/>
      </main>
    </div>
  );
}
