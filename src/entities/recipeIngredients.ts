import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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
    @JoinColumn({ name: 'ingredient_id' })
    Ingredients: Ingredients;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    quantity: number;

    @ManyToOne(() => Restaurant, { nullable: false })
    @JoinColumn({ name: 'owner_id' })
    owner: Restaurant
}