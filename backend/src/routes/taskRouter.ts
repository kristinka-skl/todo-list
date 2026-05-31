import { celebrate } from "celebrate";
import { Router } from "express";
import {
  createTask,
  getMyTasks,
  updateTaskStatus,
  deleteTask,
} from "../controllers/tasks";
import {
  createTaskSchema,
  taskIdSchema,
  updateTaskStatusSchema,
} from "../validations/tasksValidation";

const tasksRouter = Router();

tasksRouter.get("/tasks", getMyTasks);
tasksRouter.post("/tasks", celebrate(createTaskSchema), createTask);
tasksRouter.patch(
  "/tasks/:taskId",
  celebrate(updateTaskStatusSchema),
  updateTaskStatus,
);
tasksRouter.delete("/tasks/:taskId", celebrate(taskIdSchema), deleteTask);

export default tasksRouter;
