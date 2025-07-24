import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Restaurant_Recipe } from "./recipe";
import { Restaurant_Ingredients } from "./ingredients";
import { Restaurant } from "./restaurants";

@Entity()
export class Recipe_Ingredients {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Restaurant_Recipe, recipe => recipe.ingredients, {
        onDelete: "CASCADE"
    })
    recipe: Restaurant_Recipe;

    @ManyToOne(() => Restaurant_Ingredients)
    @JoinColumn({ name: 'ingredient_id' })
    Ingredients: Restaurant_Ingredients;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    quantity: number;

    @ManyToOne(() => Restaurant, { nullable: false })
    @JoinColumn({ name: 'owner_id' })
    owner: Restaurant
}