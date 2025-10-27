import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Restaurant_Order } from "./orders";
import { Restaurant_Recipe } from "./recipe";
import { Restaurant } from "./restaurants";

@Entity()
export class Order_Recipes {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.id)
  @JoinColumn({ name: "owner_id" })
  owner: Restaurant;

  @ManyToOne(() => Restaurant_Order, (order) => order.id)
  @JoinColumn({ name: "order_id" })
  order: Restaurant_Order;

  @ManyToOne(() => Restaurant_Recipe, (recipe) => recipe.id, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "recipe_id" })
  recipe: Restaurant_Recipe | null;

  @Column()
  quantity: number;

  @Column()
  snapshot_title: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  snapshot_value: number;

  @Column({ type: 'json', nullable: true })
  snapshot_ingredients: any;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_value: number;
}
