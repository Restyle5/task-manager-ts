import { z } from "zod";
import { TaskStatus } from "../enums/TaskEnum.js";


export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});


export const updateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional(),
  status: z.enum(TaskStatus).optional(),
});
