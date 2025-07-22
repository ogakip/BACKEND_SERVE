import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum PlanType {
    BASIC = "basic",
    DELIVERY = "delivery",
    FULL = "full"
}

export enum PlanRecurrence {
    MONTHLY = "monthly",
    YEARLY = "yearly"
}

@Entity()
export class Plans {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar" })
    title: string;

    @Column({ type: "varchar" })
    description: string;

    @Column('decimal', { precision: 6, scale: 2 })
    price: number;

    @Column({ type: "enum", enum: PlanType })
    type: PlanType;

    @Column({ type: "enum", enum: PlanRecurrence })
    recurrence: PlanRecurrence;

    @Column({ type: "jsonb", nullable: true })
    features: {
        maxEmployees: number;
        maxTables: number;
        num_licenses: number;
        maxHourlyOrders: number;
    };

    @Column({ default: true })
    is_active: boolean;
}