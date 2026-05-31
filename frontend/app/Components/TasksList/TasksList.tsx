"use client";
import { Toaster } from "react-hot-toast";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import TaskItem from "../TaskItem/TaskItem";
import css from "./TasksList.module.css";
import { isSameDay, addDays, isAfter, startOfDay, isBefore } from "date-fns";
import { getTasks } from "@/app/lib/api/api";

function TasksReminderCard() {
  const { data, isError, isSuccess, isPending } = useQuery({
    queryKey: ["task"],
    queryFn: () => getTasks(),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (isError) {
      console.log("smth went wrong in get tasks");
      toast("Sorry, something went wrong, please try again");
    }
  }, [isError]);

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
        if (!task.isDone) {
          overdueList.push(task);
        }
      } else if (isSameDay(taskDate, today)) {
        todayList.push(task);
      } else if (
        isAfter(taskDate, today) &&
        !isAfter(taskDate, nextWeekLimit)
      ) {
        weekList.push(task);
      } else {
        if (isAfter(taskDate, nextWeekLimit)) {
          futureList.push(task);
        }
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
      <div className={css.sectionContainer}>
        <h4
          className={`${css.sectionTitle} ${isOverdue ? css.overdueTitle : ""}`}
        >
          {title}
        </h4>
        <ul className={css.taskList}>
          {tasks.map((task) => (
            <TaskItem key={task._id} task={task} />
          ))}
        </ul>
      </div>
    );
  };
  function TaskList() {
    return (
      <div className={css.tasksWrapper}>
        {renderTaskSection("Overdue", overdueTasks, true)}
        {renderTaskSection("Today", todayTasks)}
        {renderTaskSection("This week", weekTasks)}
        {renderTaskSection("Future", futureTasks)}

        {overdueTasks.length === 0 &&
          todayTasks.length === 0 &&
          weekTasks.length === 0 &&
          futureTasks.length === 0 && (
            <p className={css.emptyState}>No active tasks</p>
          )}
      </div>
    );
  }

  return (
    <>
      <div className={css.taskCard}>
        <div className={css.taskCardHeader}>
          <h3 className={css.taskCardTitle}>My tasks</h3>
          {/* <button onClick={openModal} className={css.addTaskBtn}>
            <svg
              width={21}
              height={21}
              fill={'#000000'}
              className={css.addTaskBtnIcon}
            >
              <use href="/icons.svg#icon-add-circle"></use>
            </svg>
          </button> */}
        </div>

        {/* <AddTaskModal isOpen={isModalOpen} onClose={closeModal}></AddTaskModal> */}

        <>
          {isPending ? (
            <p className={css.loading}>Loading tasks...</p>
          ) : isSuccess && data?.length > 0 ? (
            TaskList()
          ) : (
            <p className={css.emptyState}>You do not have any tasks yet</p>
          )}
        </>
        {/* ) : (
          <ul className={css.taskList}>
            <li>
              <p className={css.subTitleTaskList}>
                Наразі немає жодних завдань
              </p>
              <p>Створіть мерщій нове завдання!</p>
            </li>
            <li> */}
        {/* <button onClick={handleCreateTaskBtnClick}>
                Створити завдання
              </button> */}
        {/* </li>
          </ul> */}

        <Toaster position="top-right" reverseOrder={false} />
      </div>
    </>
  );
}

export default TasksReminderCard;
