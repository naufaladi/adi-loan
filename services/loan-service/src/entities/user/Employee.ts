import { Column, Entity, ManyToMany, OneToMany } from "typeorm";
import { BaseUser } from "./BaseUser";
import { Loan } from "../Loan";
import { Disbursement } from "../Disbursement";

@Entity()
export class Employee extends BaseUser {
  @OneToMany(() => Loan, (loan) => loan.approvalEmployee)
  loansApproved: Loan[];

  @OneToMany(() => Disbursement, (disbursement) => disbursement.employee)
  disbursements: Disbursement[];
}
