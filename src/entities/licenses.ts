import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Restaurant } from "./restaurants";
import { Subscriptions } from "./subscriptions";

@Entity()
export class Licenses {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar" })
    key: string;

    @OneToOne(() => Restaurant, { nullable: true })
    @JoinColumn({ name: 'owner_id' })
    owner: Restaurant

    @ManyToOne(() => Subscriptions, { nullable: false })
    @JoinColumn({ name: 'subscription_id' })
    subscription: Subscriptions;

    @Column({ default: true })
    is_active: boolean;
}