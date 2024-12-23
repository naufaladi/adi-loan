import { Column, Entity, ManyToMany, OneToMany } from "typeorm";
import { BaseUser } from "./BaseUser";
import { Loan } from "../Loan";

@Entity()
export class Employee extends BaseUser {
  @OneToMany(() => Loan, (loan) => loan.approvalEmployee)
  loansApproved: Loan[];

  @OneToMany(() => Loan, (loan) => loan.disbursementEmployee)
  loansDisbursed: Loan[];
}
