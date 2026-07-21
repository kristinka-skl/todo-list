import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { deleteTask, updateTaskStatus } from "@/app/lib/api/api";
import { Task } from "../../../../interfaces";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
}

const getPriorityBadgeStyles = (priority: string | number) => {
  const p = Number(priority);
  if (isNaN(p)) return "bg-gray-500/20 text-foreground";
  if (p >= 8) return "bg-red-500/20 text-foreground";
  if (p >= 4) return "bg-amber-500/20 text-foreground";
  return "bg-gray-500/20 text-foreground";
};

export default function TaskItem({ task }: TaskItemProps) {
  const queryClient = useQueryClient();

  const { mutate: mutateDelete } = useMutation({
    mutationFn: async (id: string) => await deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task"] });
      toast.success("Successfully deleted!");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to delete task");
    },
  });

  const { mutate: mutateUpdate, isPending } = useMutation({
    mutationFn: updateTaskStatus,
    onMutate: async (newStatus) => {
      await queryClient.cancelQueries({ queryKey: ["task"] });
      const previousTasks = queryClient.getQueryData<Task[]>(["task"]);
      queryClient.setQueryData<Task[]>(["task"], (old) => {
        if (!old) return [];
        return old.map((t) =>
          t._id === newStatus.id ? { ...t, isDone: newStatus.isDone } : t,
        );
      });
      return { previousTasks };
    },
    onError: (error, newStatus, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["task"], context.previousTasks);
      }
      toast.error(error instanceof Error ? error.message : "Failed to update task");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["task"] });
    },
  });

  const formattedDate = task.date ? format(new Date(task.date), "dd.MM") : "";

  return (
    <li
      className={cn(
        "grid grid-cols-[36px_24px_1fr_40px_32px] gap-2 items-start",
        "md:grid-cols-[40px_24px_1fr_48px_36px] md:gap-4",
        "py-2 px-1 border-b border-border/40 last:border-none rounded-lg transition-colors hover:bg-muted/50",
      )}
    >
      <div className="flex justify-center items-center pt-0.5">
        <span
          className={cn(
            "text-base font-bold px-2 py-0.5 rounded-lg w-fit text-center",
            getPriorityBadgeStyles(task.priority),
          )}
        >
          {task.priority}
        </span>
      </div>

      <div className="flex justify-center pt-1">
        <Checkbox
          checked={task.isDone}
          onCheckedChange={(checked) =>
            mutateUpdate({ id: task._id, isDone: checked as boolean })
          }
          id={`task-${task._id}`}
          className="h-5 w-5 border-gray-400 data-[state=checked]:bg-accent data-[state=checked]:border-accent data-[state=checked]:text-white"
        />
      </div>

      <label
        htmlFor={`task-${task._id}`}
        className={cn(
          "text-base font-medium cursor-pointer select-none break-words whitespace-normal transition-all duration-200",
          task.isDone && "line-through text-muted-foreground",
        )}
      >
        {task.name}
      </label>

      <span className="text-base text-muted-foreground text-right whitespace-nowrap pt-0.5">
        {formattedDate}
      </span>

      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => mutateDelete(task._id)}
          aria-label="Delete task"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </li>
  );
}
