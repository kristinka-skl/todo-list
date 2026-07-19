"use client";

import { useEffect, useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { isSameDay, addDays, isAfter, startOfDay, isBefore } from "date-fns";
import { useDebouncedCallback } from "use-debounce";
import { getTasks } from "@/app/lib/api/api";

import TaskItem from "../TaskItem/TaskItem";
import SearchForm from "../SearchForm/SearchForm";
import { cn } from "@/lib/utils";

function TasksReminderCard() {
  const [query, setQuery] = useState("");
  
  const { data, isError, isSuccess, isPending } = useQuery({
    queryKey: ["task", query],
    queryFn: () => getTasks(query),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (isError) {
      console.log("smth went wrong in get tasks");
      toast.error("Sorry, something went wrong, please try again");
    }
  }, [isError]);

  const { overdueTasks, todayTasks, weekTasks, futureTasks } = useMemo(() => {
    if (!data)
      return { overdueTasks: [], todayTasks: [], weekTasks: [], futureTasks: [] };

    const today = startOfDay(new Date());
    const nextWeekLimit = addDays(today, 7);

    const overdueList: typeof data = [];
    const todayList: typeof data = [];
    const weekList: typeof data = [];
    const futureList: typeof data = [];

    data.forEach((task) => {
      const taskDate = startOfDay(new Date(task.date));

      if (isBefore(taskDate, today)) {
        if (!task.isDone) overdueList.push(task);
      } else if (isSameDay(taskDate, today)) {
        todayList.push(task);
      } else if (isAfter(taskDate, today) && !isAfter(taskDate, nextWeekLimit)) {
        weekList.push(task);
      } else if (isAfter(taskDate, nextWeekLimit)) {
        futureList.push(task);
      }
    });

    return { 
      overdueTasks: overdueList, 
      todayTasks: todayList, 
      weekTasks: weekList, 
      futureTasks: futureList 
    };
  }, [data]);

  const renderTaskSection = (
    title: string,
    tasks: typeof data,
    isOverdue = false
  ) => {
    if (!tasks || tasks.length === 0) return null;
    return (
      <div className="flex flex-col gap-2 mb-6 last:mb-0">
        <h4
          className={cn(
            "text-base md:text-lg font-semibold tracking-tight",
            isOverdue ? "text-destructive" : "text-foreground"
          )}
        >
          {title}
        </h4>
        <ul className="flex flex-col w-full">
          {tasks.map((task) => (
            <TaskItem key={task._id} task={task} />
          ))}
        </ul>
      </div>
    );
  };

  const changeQuery = useDebouncedCallback((query: string) => {
    setQuery(query);
  }, 1000);

  return (
    <>
     
      <div className="w-full max-w-[335px] md:max-w-2xl mx-auto p-6 md:p-8 bg-[var(--color-scheme-foreground)] text-foreground shadow-sm rounded-[32px] flex flex-col">
        <div className="flex flex-col items-center gap-4 mb-6">
          <h3 className="text-xl md:text-2xl font-bold tracking-wide">
            My tasks
          </h3>
          <div className="w-full">
            <SearchForm onChange={changeQuery} />
          </div>
        </div>

        <div className="flex flex-col w-full">
          {isPending ? (
            <p className="text-center text-muted-foreground py-8 animate-pulse">
              Loading tasks...
            </p>
          ) : isSuccess && data?.length > 0 ? (
            <>
              {renderTaskSection("Overdue", overdueTasks, true)}
              {renderTaskSection("Today", todayTasks)}
              {renderTaskSection("This week", weekTasks)}
              {renderTaskSection("Future", futureTasks)}

              {overdueTasks.length === 0 &&
                todayTasks.length === 0 &&
                weekTasks.length === 0 &&
                futureTasks.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No active tasks
                  </p>
              )}
            </>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              You do not have any tasks yet
            </p>
          )}
        </div>

        <Toaster position="top-right" reverseOrder={false} />
      </div>
    </>
  );
}

export default TasksReminderCard;