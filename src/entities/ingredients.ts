import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Restaurant } from "./restaurants";

@Entity()
export class Ingredients {
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

    @ManyToOne(() => Restaurant, { nullable: false })
    owner: Restaurant;
}