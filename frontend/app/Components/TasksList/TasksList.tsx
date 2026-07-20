"use client";

import { useEffect, useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { isSameDay, addDays, isAfter, startOfDay, isBefore } from "date-fns";
import { useDebouncedCallback } from "use-debounce";
import { getTasks } from "@/app/lib/api/api";

import TaskItem from "../TaskItem/TaskItem";
import Filters from "../Filters/Filters";
import { cn } from "@/lib/utils";

function TasksReminderCard() {
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const [statusQuery, setStatusQuery] = useState<string | undefined>(undefined);
  const [sortingOrder, setSortingOrder] = useState<string | undefined>(undefined);

  const { data, isError, error, isSuccess, isPending } = useQuery({
    queryKey: ["task", searchQuery, statusQuery, sortingOrder],
    queryFn: () => getTasks(searchQuery, statusQuery, sortingOrder),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || "Database connection failure");
    }
  }, [isError, error]);

  const { overdueTasks, todayTasks, weekTasks, futureTasks } = useMemo(() => {
    if (!data)
      return {
        overdueTasks: [],
        todayTasks: [],
        weekTasks: [],
        futureTasks: [],
      };

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
      } else if (
        isAfter(taskDate, today) &&
        !isAfter(taskDate, nextWeekLimit)
      ) {
        weekList.push(task);
      } else if (isAfter(taskDate, nextWeekLimit)) {
        futureList.push(task);
      }
    });

    return {
      overdueTasks: overdueList,
      todayTasks: todayList,
      weekTasks: weekList,
      futureTasks: futureList,
    };
  }, [data]);

  const renderTaskSection = (
    title: string,
    tasks: typeof data,
    isOverdue = false,
  ) => {
    if (!tasks || tasks.length === 0) return null;
    return (
      <div className="flex flex-col gap-2 mb-6 last:mb-0">
        <h4
          className={cn(
            "text-base md:text-lg font-semibold tracking-tight",
            isOverdue ? "text-destructive" : "text-foreground",
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
    setSearchQuery(query !== '' ? query : undefined);
  }, 1000);

  const changeSorting = (order: string | undefined) => {
    setSortingOrder(order);
  };
  return (
    <>
      <div className="w-full max-w-[335px] md:max-w-2xl mx-auto p-6 md:p-8 bg-[var(--color-scheme-foreground)] text-foreground shadow-sm rounded-[32px] flex flex-col">
        <div className="flex flex-col items-center gap-4 mb-6">
          <h3 className="text-xl md:text-2xl font-bold tracking-wide">
            My tasks
          </h3>
          <div className="w-full">
            <Filters
              onSortingOrderChange={changeSorting}
              onStatusFilterChange={(status) => setStatusQuery(status)}
              onSearchChange={changeQuery}
            />
          </div>
        </div>

        <div className="flex flex-col w-full">
          {isPending ? (
          <p className="text-center text-muted-foreground py-8 animate-pulse">
            Loading tasks...
          </p>
        ) : isError ? (
          <div className="text-center py-8 px-4 border border-destructive/20 bg-destructive/5 rounded-2xl flex flex-col gap-2">
            <p className="font-semibold text-destructive">Service is temporarily unavailable</p>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              We&apos;re having trouble connecting to the database. Please verify your connection or try again later.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 text-xs bg-destructive text-white px-3 py-1.5 rounded-lg w-fit mx-auto hover:opacity-90 transition-opacity"
            >
              Reload application
            </button>
          </div>
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
