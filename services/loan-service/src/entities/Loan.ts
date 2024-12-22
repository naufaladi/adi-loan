import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export enum LoanStateEnum {
  PROPOSED = "proposed",
  APPROVED = "approved",
  INVESTED = "invested",
  DISBURSED = "disbursed",
}
export type LoanState = `${LoanStateEnum}`;

@Entity("loans")
export class Loan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  borrowerId: number;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  principal: number;

  @Column({ type: "decimal", precision: 5, scale: 2 })
  interestRate: number;

  @Column({
    type: "enum",
    enum: LoanStateEnum,
    default: LoanStateEnum.PROPOSED,
  })
  state: LoanState;

  @Column({ nullable: true })
  approvalProof?: string;

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  investmentAmount: number;

  @Column({ type: "timestamp", nullable: true })
  disbursementDate?: Date;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
