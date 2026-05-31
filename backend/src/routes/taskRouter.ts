import { celebrate } from "celebrate";
import { Router } from "express";
import {
  createTask,
  getMyTasks,
  updateTaskStatus,
  deleteTask,
} from "../controllers/tasks.js";
import {
  createTaskSchema,
  taskIdSchema,
  updateTaskStatusSchema,
} from "../validations/tasksValidation.js";

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
