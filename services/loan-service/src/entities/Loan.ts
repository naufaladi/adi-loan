import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Base } from "./Base";

export enum LoanStateEnum {
  PROPOSED = "proposed",
  APPROVED = "approved",
  INVESTED = "invested",
  DISBURSED = "disbursed",
}
export type LoanState = `${LoanStateEnum}`;

@Entity("loans")
export class Loan extends Base {
  @Column({
    type: "enum",
    enum: LoanStateEnum,
    default: LoanStateEnum.PROPOSED,
  })
  state: LoanState;

  @Column()
  borrowerId: number;

  @Column()
  totalInvestedAmount: number;

  @Column()
  totalROI: number;

  @Column()
  principal: number;

  @Column({ type: "decimal", precision: 5, scale: 2 })
  interestRate: number;

  // Approval fields - TODO create a separate entity
  @Column({ nullable: true })
  approvalUrl?: string;

  @Column({ nullable: true })
  approvalEmployeeId?: number;

  @Column({ type: "timestamp", nullable: true })
  approvalDate?: Date;

  // Disbursement fields - TODO create a separate entity
  @Column({ nullable: true })
  agreementLetterUrl?: string;

  @Column({ nullable: true })
  disbursementEmployeeId?: number;

  @Column({ type: "timestamp", nullable: true })
  disbursementDate?: Date;
}
