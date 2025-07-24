import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Restaurant } from "./restaurants";
import { Restaurant_Subscriptions } from "./subscriptions";

@Entity()
export class Subscriptions_Licenses {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar" })
    key: string;

    @OneToOne(() => Restaurant, { nullable: true })
    @JoinColumn({ name: 'owner_id' })
    owner: Restaurant | null

    @ManyToOne(() => Restaurant_Subscriptions, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'subscription_id' })
    subscription: Restaurant_Subscriptions;

    @Column({ default: true })
    is_active: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
}