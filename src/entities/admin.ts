import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";

@Entity()
export class Admins {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar" })
    username: string

    @Column({ type: "varchar" })
    password: string
}