import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from "typeorm";
import User from "./User.js";
import { TaskStatus } from "../enums/TaskEnum.js";


@Entity()
export default class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.tasks, {
    nullable: true,
    onDelete: "SET NULL", // or "CASCADE"
  })
  @JoinColumn({ name: "user_id" })
  user?: User | null;

  @Column("varchar", { length: 255 })
  title!: string;

  @Column("longtext", { nullable: true })
  description?: string | null;

  @Column({
    type: "enum",
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status!: TaskStatus;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deleted_at?: Date | null;
}