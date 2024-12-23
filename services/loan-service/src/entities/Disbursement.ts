import { Column, Entity, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { Base } from "./Base";
import { Employee } from "./user/Employee";
import { Loan } from "./Loan";

@Entity()
export class Disbursement extends Base {
  @Column({ nullable: true })
  agreementLetterUrl?: string;

  @Column({ type: "timestamp", nullable: true })
  disbursementDate?: Date;

  @ManyToOne(() => Employee, (employee) => employee.disbursements)
  employee?: Employee;

  @OneToOne(() => Loan, (loan) => loan.disbursement)
  loan?: Loan;
}
