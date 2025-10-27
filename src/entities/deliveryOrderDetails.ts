import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Restaurant_Order } from "./orders";

@Entity()
export class Delivery_Order_Details {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Restaurant_Order, { onDelete: "CASCADE" })
  @JoinColumn({ name: "order_id" })
  order: Restaurant_Order;

  @Column()
  delivery_address: string;

  @Column()
  delivery_number: string;

  @Column()
  delivery_district: string;

  @Column()
  delivery_complement: string;

  @Column()
  client_name: string;

  @Column()
  client_phone: string;

  @Column()
  observations: string;
}
