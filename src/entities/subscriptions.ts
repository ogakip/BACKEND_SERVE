import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Restaurant } from "./restaurants";
import { Plans } from "./plans";

@Entity()
export class Subscriptions {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Restaurant, { nullable: false })
    owner: Restaurant;

    @ManyToOne(() => Plans, { nullable: false })
    plan: Plans;

    @Column({ type: 'timestamp', nullable: true })
    expires_at: Date;

    @Column({ default: true })
    is_active: boolean;
}