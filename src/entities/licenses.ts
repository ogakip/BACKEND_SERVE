import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Restaurant } from "./restaurants";
import { Subscriptions } from "./subscriptions";

@Entity()
export class Licenses {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar" })
    key: string;

    @OneToOne(() => Restaurant, { nullable: true })
    owner: Restaurant;

    @ManyToOne(() => Subscriptions, { nullable: false })
    subscription: Subscriptions;

    @Column({ default: true })
    is_active: boolean;
}