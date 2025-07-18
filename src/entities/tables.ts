import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Table {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  client: string;

  @Column({ type: "boolean", default: false })
  status: boolean;
}
