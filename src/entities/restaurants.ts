import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Restaurant {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar" })
    fullname: string;

    @Column({ type: "varchar" })
    username: string;

    @Column({ type: "varchar" })
    email: string;

    @Column({ type: "varchar" })
    password: string;

    @Column({ default: false })
    is_master: boolean;

    @Column({ type: "varchar", nullable: true })
    voucher_license: string | null;
}