import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Restaurant } from "./restaurants";
import { Plans } from "./plans";

export enum SubscriptionStatus {
    PENDING = "pending",
    ACTIVE = "active",
    CANCELED = "canceled",
    NOTPAID = "notpaid"
}

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
    expires_at: Date | null;

    @Column({ type: "enum", enum: SubscriptionStatus })
    status: SubscriptionStatus;

    @Column({ type: "varchar", nullable: true })
    payment_link: string | null

    @Column({ type: "varchar", nullable: true })
    stripe_subscription_id: string | null
}