import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import Task from "./Task.js";

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar", { length: 255 })
  name!: string;

  @Column("varchar", { length: 255, unique: true })
  email!: string;

  @Column("varchar", { length: 255 })
  password!: string;

  @OneToMany(() => Task, (task) => task.user, {
  })
  tasks?: Task[];
}
