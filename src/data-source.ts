import { DataSource } from "typeorm";
import User from "./entities/User.js";
import Task from "./entities/Task.js";
import Tag from "./entities/Tag.js";
import TaskLog from "./entities/TaskLog.js";
import dotenv from "dotenv";
import { TaskSubscriber } from "./subscribers/task-subscriber.js";

// Init .env
dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST ?? "localhost",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  username: process.env.DB_USERNAME ?? "root",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME ?? "task_manager",
  synchronize: process.env.NODE_ENV !== "production",
  logging: false,
  entities: [User, Task, Tag, TaskLog],
  subscribers: [TaskSubscriber],
});