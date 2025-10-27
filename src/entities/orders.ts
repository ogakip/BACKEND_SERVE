import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Restaurant_Recipe } from "./recipe";
import { Restaurant } from "./restaurants";
import { Restaurant_Tables } from "./tables";
import { Order_Recipes } from "./orderRecipes";

export enum OrderStatus {
    PENDING = "pending",
    PREPARING = "preparing",
    TRANSPORT = "transport",
    DONE = "done",
    CANCELED = "canceled"
}

export enum OrderType {
    LOCAL = "local",
    DELIVERY = "delivery"
}

@Entity()
export class Restaurant_Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "enum", enum: OrderType })
    type: OrderType;

    @Column({ type: "enum", enum: OrderStatus })
    status: OrderStatus;

    @CreateDateColumn({ type: "timestamp" })
    created_at: Date;

    @Column({ type: "timestamp", nullable: true })
    finished_at: Date | null;

    @Column()
    total_value: number;

    @ManyToOne(() => Restaurant, { nullable: false })
    @JoinColumn({ name: 'owner_id' })
    owner: Restaurant
    
    @OneToMany(() => Order_Recipes, item => item.order)
    items: Order_Recipes[];
}