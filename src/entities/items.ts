import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  title: string;

  @Column({ type: "varchar", nullable: true })
  description: string | null;

  @Column({ type: "varchar" })
  unit_type: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  unit_value: number;
}
