import { Response } from "express";
import Task from "../models/Task";
import { AuthRequest } from "../middlewares/auth";

export const getTasks = async (req: AuthRequest, res: Response) => {
  const tasks = await Task.find({ user: req.user?._id });
  res.json(tasks);
};

export const createTask = async (req: AuthRequest, res: Response) => {
  const { title, description } = req.body;

  const task = await Task.create({
    title,
    description,
    user: req.user?._id,
  });

  res.status(201).json(task);
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user?._id },
    req.body,
    { new: true }
  );

  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.user?._id,
  });

  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json({ message: "Task deleted" });
};
