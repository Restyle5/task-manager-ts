
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from "typeorm";

@Entity("tags")
export default class Tag {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar", { length: 100, unique: true })
  name!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
   
}
