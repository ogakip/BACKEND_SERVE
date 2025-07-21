import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Restaurant } from "./restaurants";
import { RecipeIngredient } from "./recipeIngredients";

@Entity()
export class Recipe {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar" })
    title: string;

    @Column({ type: "varchar", nullable: true })
    description: string | null;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    value: number;

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
    offer: number | null;

    @OneToMany(() => RecipeIngredient, ri => ri.recipe, { cascade: true })
    ingredients: RecipeIngredient[];

    @ManyToOne(() => Restaurant, { nullable: false })
    owner: Restaurant;
}