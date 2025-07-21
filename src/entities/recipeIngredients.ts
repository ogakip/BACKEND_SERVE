import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Recipe } from "./recipe";
import { Ingredients } from "./ingredients";
import { Restaurant } from "./restaurants";

@Entity()
export class RecipeIngredient {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Recipe, recipe => recipe.ingredients, {
        onDelete: "CASCADE"
    })
    recipe: Recipe;

    @ManyToOne(() => Ingredients)
    Ingredients: Ingredients;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    quantity: number;

    @ManyToOne(() => Restaurant, { nullable: false })
    owner: Restaurant;
}