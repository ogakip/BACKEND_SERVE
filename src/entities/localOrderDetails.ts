import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Restaurant_Tables } from "./tables";
import { Restaurant_Order } from "./orders";

@Entity()
export class Local_Order_Details {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Restaurant_Order, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order: Restaurant_Order;

    @OneToOne(() => Restaurant_Tables, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'table_id' })
    table: Restaurant_Tables;

    @Column()
    observations: string;

    @Column()
    client_name: string;
}