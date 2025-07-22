import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Table } from "typeorm";
import { Recipe } from "./recipe";
import { Restaurant } from "./restaurants";

enum OrderStatus {
    PENDING = "pending",
    PREPARING = "preparing",
    DONE = "done"
}

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Table)
    table: Table;

    @ManyToOne(() => Recipe)
    recipe: Recipe;

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