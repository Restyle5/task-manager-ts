import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import Task from "./Task.js";
import User from "./User.js";

@Entity({ name: "task_logs" })
export default class TaskLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Task, (task) => task.logs, { onDelete: "CASCADE" })
  @JoinColumn({ name: "task_id" })
  task!: Task;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "user_id" })
  user?: User | null; // who performed the change

  @Column({ type: "varchar", length: 50 })
  action!: "INSERT" | "UPDATE" | "DELETE"; // what type of change happened

  @Column({ type: "varchar", length: 255, nullable: true })
  field_name?: string | null; // which field/column changed

  @Column("text", { nullable: true })
  old_value?: string | null;

  @Column("text", { nullable: true })
  new_value?: string | null;

  @CreateDateColumn()
  created_at!: Date;
}
