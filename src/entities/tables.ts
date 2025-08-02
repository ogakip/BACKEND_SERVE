import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Restaurant } from "./restaurants";

export enum TableStatus {
    EMPTY = "empty",
    BUSY = "busy"
}

@Entity()
export class Restaurant_Tables {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", nullable: true })
    client: string | null;

    @Column({ type: "enum", enum: TableStatus })
    status: TableStatus;

    @ManyToOne(() => Restaurant, { nullable: false })
    @JoinColumn({ name: 'owner_id' })
    owner: Restaurant
}