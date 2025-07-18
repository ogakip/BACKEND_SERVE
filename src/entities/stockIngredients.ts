import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Item } from "./items";

@Entity()
export class StockIngredient {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Item)
  item: Item;

  @Column("decimal", { precision: 10, scale: 2 })
  quantity: number;
}