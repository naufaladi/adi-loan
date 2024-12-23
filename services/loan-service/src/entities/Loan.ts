import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Base } from "./Base";
import { Investment } from "./Investment";
import { Borrower } from "./user/Borrower";
import { Employee } from "./user/Employee";

export enum LoanStateEnum {
  PROPOSED = "proposed",
  APPROVED = "approved",
  INVESTED = "invested",
  DISBURSED = "disbursed",
}
export type LoanState = `${LoanStateEnum}`;

@Entity()
export class Loan extends Base {
  @Column({
    type: "enum",
    enum: LoanStateEnum,
    default: LoanStateEnum.PROPOSED,
  })
  state: LoanState;

  @ManyToOne(() => Borrower, (borrower) => borrower.loans)
  borrower: Borrower;

  @OneToMany(() => Investment, (investment) => investment.loan)
  investments: Investment[];

  @Column({ default: 0 })
  totalInvestedAmount: number;

  @Column({ default: 0 })
  totalROI: number;

  @Column()
  principal: number;

  @Column({ type: "decimal", precision: 5, scale: 2 })
  interestRate: number;

  // Approval fields - TODO create a separate entity
  @Column({ nullable: true })
  approvalUrl?: string;

  @ManyToOne(() => Employee, (employee) => employee.loansApproved)
  approvalEmployee?: Employee;

  @Column({ type: "timestamp", nullable: true })
  approvalDate?: Date;

  // Disbursement fields - TODO create a separate entity
  @Column({ nullable: true })
  agreementLetterUrl?: string;

  @ManyToOne(() => Employee, (employee) => employee.loansDisbursed)
  disbursementEmployee?: Employee;

  @Column({ type: "timestamp", nullable: true })
  disbursementDate?: Date;
}
