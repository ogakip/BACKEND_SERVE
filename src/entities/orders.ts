import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Restaurant_Recipe } from "./recipe";
import { Restaurant } from "./restaurants";
import { Restaurant_Tables } from "./tables";

enum OrderStatus {
    PENDING = "pending",
    PREPARING = "preparing",
    TRANSPORT = "transport",
    DONE = "done"
}

@Entity()
export class Restaurant_Order {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Restaurant_Tables)
    table: Restaurant_Tables;

    @ManyToOne(() => Restaurant_Recipe)
    recipe: Restaurant_Recipe;

    @Column({ type: "enum", enum: OrderStatus })
    status: OrderStatus;

    @CreateDateColumn({ type: "timestamp" })
    created_at: Date;

    @Column({ type: "timestamp", nullable: true })
    finished_at: Date | null;

    @ManyToOne(() => Restaurant, { nullable: false })
    @JoinColumn({ name: 'owner_id' })
    owner: Restaurant
}