import { Column, Entity, OneToMany } from "typeorm";
import { Loan } from "../Loan";
import { BaseUser } from "./BaseUser";

@Entity()
export class Borrower extends BaseUser {
  @OneToMany(() => Loan, (loan) => loan.borrower)
  loans: Loan[];
}
