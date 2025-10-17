import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Restaurant } from "./restaurants";

@Entity("sessions")
export class Sessions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sessionToken: string;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.sessions)
  owner: Restaurant;

  @Column()
  expires_at: Date;
}
