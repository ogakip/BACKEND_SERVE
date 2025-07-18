import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Table {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  client: string;

  @Column({ default: false })
  status: boolean;
}