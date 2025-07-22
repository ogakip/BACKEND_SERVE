import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

  @Column({ default: false })
  is_master: boolean;

  @Column({ type: "varchar", nullable: true })
  voucher_license: string | null;

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
}
