import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn
} from "typeorm";
import { Users } from "./users";
import { Table } from "./tables";
import { Recipe } from "./recipes";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users)
  user: Users;

  @ManyToOne(() => Table)
  table: Table;

  @ManyToOne(() => Recipe)
  recipe: Recipe;

  @Column({ type: "varchar" })
  status: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @Column({ type: "timestamp", nullable: true })
  finished_at: Date | null;
}
