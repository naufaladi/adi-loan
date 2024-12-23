import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { Base } from "./Base";
import { Investment } from "./Investment";
import { Borrower } from "./user/Borrower";
import { Employee } from "./user/Employee";
import { Disbursement } from "./Disbursement";

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

  @Column({ type: "decimal", precision: 5, scale: 4 }) // store as 0.15 rather than 15
  interestRate: number;

  // Approval fields - TODO create a separate entity if grows complex
  @Column({ nullable: true })
  approvalProofUrl?: string;

  @ManyToOne(() => Employee, (employee) => employee.loansApproved)
  approvalEmployee?: Employee;

  @Column({ type: "timestamp", nullable: true })
  approvalDate?: Date;

  @OneToOne(() => Disbursement, (disbursement) => disbursement.loan)
  @JoinColumn()
  disbursement?: Disbursement;
}
