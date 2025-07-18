import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Recipe } from "./recipes";
import { Item } from "./items";

@Entity()
export class RecipeIngredient {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Recipe, recipe => recipe.ingredients, { onDelete: "CASCADE" })
  recipe: Recipe;

  @ManyToOne(() => Item)
  item: Item;

  @Column("decimal", { precision: 10, scale: 2 })
  quantity: number;
}
