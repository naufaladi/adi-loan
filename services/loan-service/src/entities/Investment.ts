import { Column, Entity, ManyToOne } from "typeorm";
import { Base } from "./Base";
import { Loan } from "./Loan";
import { Investor } from "./user/Investor";

@Entity()
export class Investment extends Base {
  @ManyToOne(() => Loan, (loan) => loan.investments)
  loan: Loan;

  @ManyToOne(() => Investor, (investor) => investor.investments)
  investor: Investor;

  @Column()
  amount: number;

  @Column()
  roi: number;
}
