import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Table {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", nullable: true })
  client: string;

  @Column({ type: "varchar", default: "empty", nullable: true })
  status: string;
}
