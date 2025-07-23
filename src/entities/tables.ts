import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Restaurant } from "./restaurants";

enum TableStatus {
    EMPTY = "empty",
    BUSY = "busy"
}

@Entity()
export class Table {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", nullable: true })
    client: string;

    @Column({ type: "enum", enum: TableStatus })
    status: TableStatus;

    @ManyToOne(() => Restaurant, { nullable: false })
    @JoinColumn({ name: 'owner_id' })
    owner: Restaurant
}