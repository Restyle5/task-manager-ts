import BaseController from "./controller";
import type { Request, Response } from "express";
import Task from "../entities/Task.js";
import { AppDataSource } from "../data-source.js";
import type User from "../entities/User";

const taskRepository = AppDataSource.getRepository(Task);

class TaskController extends BaseController {
   async create(req: Request, res: Response): Promise<void> {
    const { title, description } = req.body;

    const task = new Task();
    task.title = title;
    task.user = req.user.details as User;
    task.description = description;

    const newTask: Task = await taskRepository.save(task);

    if (!newTask) {
      res.status(500).json({ message: "Failed to create task" });
      return;
    }
    res.status(201).json(newTask);
  }

   async getAll(req: Request, res: Response): Promise<void> {
    const tasks: Task[] = await taskRepository.find({
      where: { user: { id: (req.user.details as User).id } },
    });
    res.status(200).json(tasks);
  }

   async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    if (id) {
      const task: Task | null = await taskRepository.findOne({
        where: {
          id: parseInt(id, 10),
          user: { id: (req.user.details as User).id },
        },
      });
      if (!task) {
        res.status(404).json({ message: "Task not found" });
        return;
      }
      res.status(200).json(task);
    } else {
      res.status(400).json({ message: "Task ID is required" });
    }
  }

   async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { title, description, status } = req.body;
    
    if(!id) {   
      res.status(400).json({ message: "Task ID is required" });
      return;
    }

    const task: Task | null = await taskRepository.findOne({
      where: {
        id: parseInt(id, 10),
        user: { id: (req.user.details as User).id },
      },
    });

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.status = status ?? task.status;

    const updatedTask: Task = await taskRepository.save(task);
    res.status(200).json(updatedTask);
  }

   async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    if(!id) {   
      res.status(400).json({ message: "Task ID is required" });
      return;
    }

    const task: Task | null = await taskRepository.findOne({
      where: {
        id: parseInt(id, 10),
        user: { id: (req.user.details as User).id },
      },
    });

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    await taskRepository.softRemove(task);
    res.status(200).json({ message: "Task deleted successfully" });
  }
}

export default TaskController;
