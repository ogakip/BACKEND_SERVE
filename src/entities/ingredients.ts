import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Restaurant } from "./restaurants";

export enum UnitTypeIngredients {
    GRAMA = "g",
    KILOS = "kg",
    UNIDADES = "un",
    MILILITROS = "ml",
    MILIGRAMAS = "mg",
    LITROS = "l",
    FATIA = "fatia"
}

@Entity()
export class Restaurant_Ingredients {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar" })
    title: string;

    @Column({ type: "varchar", nullable: true })
    description: string | null;

    @Column({
        type: "enum",
        enum: UnitTypeIngredients,
    })
    unit_type: UnitTypeIngredients;

    @Column({
        type: "decimal",
        precision: 10,
        scale: 2,
        transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value),
        }
    })
    unit_value: number;

    @ManyToOne(() => Restaurant, { nullable: false })
    @JoinColumn({ name: 'owner_id' })
    owner: Restaurant
}