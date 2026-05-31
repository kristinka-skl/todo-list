import createHttpError from 'http-errors';
import { TasksCollection } from '../models/task.js';
import { Request, Response, NextFunction } from 'express';

export const getMyTasks = async (req: Request,
  res: Response) => {
  const tasks = await TasksCollection.find(
    // { userId: req.user._id }
  ).sort({ date: 1 });
    res.status(200).json(tasks);
};

export const createTask = async (req: Request,
  res: Response) => {
  const task = await TasksCollection.create({
    ...req.body,
    // userId: req.user._id,
  }
);  
  res.status(201).json(task);
};

export const updateTaskStatus = async (req: Request,
  res: Response, next: NextFunction) => {
    const { taskId } = req.params;
    const { isDone } = req.body;
    const task = await TasksCollection.findOneAndUpdate(
      {
        _id: taskId,
        // userId: req.user._id         
      }, 
      { isDone }, 
      { new: true }
    );
  if (!task) {
    return next(createHttpError(404, 'Task not found'));
    
  }
  res.status(200).json(task);
};

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { taskId } = req.params;
  const task = await TasksCollection.findOneAndDelete(
    {
      _id: taskId,
      // userId: req.user._id
    },
  );
  if (!task) {
    return next(createHttpError(404, "Task not found"));
  }
  res.status(200).json(task);
};
