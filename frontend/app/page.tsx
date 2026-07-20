import TaskForm from "./Components/TaskForm/TaskForm";
import TasksReminderCard from "./Components/TasksList/TasksList";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground font-sans">      
      <main className="flex w-full max-w-[800px] flex-1 flex-col items-start gap-12 bg-card px-[22px] py-[48px] md:px-[56px] md:py-[80px]">
        <TaskForm />        
        <TasksReminderCard />
      </main>
      
    </div>
  );
}