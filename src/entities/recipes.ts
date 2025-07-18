import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { RecipeIngredient } from "./recipeIngredients";

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column("decimal", { precision: 10, scale: 2 })
  value: number;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  offer: number;

  @OneToMany(() => RecipeIngredient, ri => ri.recipe, { cascade: true })
  ingredients: RecipeIngredient[];
}