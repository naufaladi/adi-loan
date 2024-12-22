import { AppDataSource } from "../config/database";
import { Loan, LoanState, LoanStateEnum } from "../entities/Loan";

const ALLOWED_TRANSITIONS: { [key: string]: LoanState[] } = {
  proposed: ["approved"],
  approved: ["invested"],
  invested: ["disbursed"],
};

function canTransition(currentState: LoanState, newState: LoanState) {
  return ALLOWED_TRANSITIONS[currentState]?.includes(newState);
}

export class LoanService {
  private db = AppDataSource.getRepository(Loan);

  async createLoan(data: Partial<Loan>) {
    const loan = this.db.create({ ...data, state: "proposed" });
    return this.db.save(loan);
  }

  async approveLoan(id: number, approvalProof: string) {
    const loan = await this.db.findOneBy({ id });
    if (!loan) throw new Error("Loan not found");
    if (loan.state !== "proposed")
      throw new Error("Loan cannot be approved haha");

    loan.state = "approved";
    loan.approvalProof = approvalProof;
    return this.db.save(loan);
  }

  async investLoan(id: number, investmentAmount: number) {
    const loan = await this.db.findOneBy({ id });
    if (!loan) throw new Error("Loan not found");
    if (loan.state !== "approved")
      throw new Error("Loan cannot accept investments");

    if (investmentAmount > loan.principal)
      throw new Error("Investment exceeds loan principal");

    loan.state = "invested";
    loan.investmentAmount = investmentAmount;
    return this.db.save(loan);
  }

  async disburseLoan(id: number) {
    const loan = await this.db.findOneBy({ id });
    if (!loan) throw new Error("Loan not found");
    if (loan.state !== "invested") throw new Error("Loan cannot be disbursed");

    loan.state = "disbursed";
    loan.disbursementDate = new Date();
    return this.db.save(loan);
  }

  async getLoans() {
    return this.db.find();
  }
}
