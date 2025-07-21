import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

enum PlanType {
    BASIC = "basic",
    DELIVERY = "delivery",
    FULL = "full"
}

enum PlanRecurrence {
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

    @Column({ type: "integer" })
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