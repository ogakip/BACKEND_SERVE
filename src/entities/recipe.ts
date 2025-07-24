import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Restaurant } from "./restaurants";
import { Recipe_Ingredients } from "./recipeIngredients";

@Entity()
export class Restaurant_Recipe {
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

    @OneToMany(() => Recipe_Ingredients, ri => ri.recipe, { cascade: true })
    ingredients: Recipe_Ingredients[];

    @ManyToOne(() => Restaurant, { nullable: false })
    @JoinColumn({ name: 'owner_id' })
    owner: Restaurant
}