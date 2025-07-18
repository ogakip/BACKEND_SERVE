import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./users";
import { Table } from "./tables";
import { Recipe } from "./recipes";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Table)
  table: Table;

  @ManyToOne(() => Recipe)
  recipe: Recipe;

  @Column()
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true })
  finished_at: Date;
}