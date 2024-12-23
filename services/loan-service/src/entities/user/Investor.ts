import { Column, Entity, OneToMany } from "typeorm";
import { Investment } from "../Investment";
import { BaseUser } from "./BaseUser";

@Entity()
export class Investor extends BaseUser {
  @OneToMany(() => Investment, (investment) => investment.investor)
  investments: Investment[];
}
