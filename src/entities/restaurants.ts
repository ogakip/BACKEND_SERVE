import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum RestaurantType {
  NONE = "none",
  FILIAL = "filial",
  MATRIZ = "matriz"
}

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  fullname: string;

  @Column({ type: "varchar", unique: true })
  username: string;

  @Column({ type: "varchar", unique: true })
  email: string;

  @Column({ type: "varchar" })
  password: string;

  @Column({ type: "enum", enum: RestaurantType, nullable: true })
  type: RestaurantType | null;

  @Column({ type: "varchar", nullable: true })
  branch_code: string;

  @Column({ type: "varchar", nullable: true })
  phone: string;

  @Column({ type: "varchar", nullable: true })
  street: string;

  @Column({ type: "varchar", nullable: true })
  number: string;

  @Column({ type: "varchar", nullable: true })
  district: string;

  @Column({ type: "varchar", nullable: true })
  city: string;

  @Column({ type: "varchar", nullable: true })
  state: string;

  @Column({ type: "varchar", nullable: true })
  zip_code: string;

  @Column({ type: "varchar" })
  stripe_customer_id: string
}
