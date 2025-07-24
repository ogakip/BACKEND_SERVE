import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Restaurant } from "./restaurants";
import { Plans } from "./plans";

@Entity()
export class Restaurant_Subscriptions {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Restaurant, { nullable: false })
    @JoinColumn({ name: 'owner_id' })
    owner: Restaurant

    @ManyToOne(() => Plans, { nullable: false })
    @JoinColumn({ name: 'plan_id' })
    plan: Plans;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @Column({ type: 'timestamp', nullable: true })
    expires_at: Date;

    @Column({ default: true })
    is_active: boolean;
}