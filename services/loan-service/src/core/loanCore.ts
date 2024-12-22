import { AppDataSource } from "../config/database";
import { Loan, LoanState, LoanStateEnum } from "../entities/Loan";

const ALLOWED_TRANSITIONS: { [key: string]: LoanState[] } = {
  proposed: ["approved"],
  approved: ["invested"],
  invested: ["disbursed"],
};

function canTransition(currentState: LoanState, newState: LoanState) {
  if (!ALLOWED_TRANSITIONS[currentState]?.includes(newState)) {
    throw new Error(
      `${newState} state is not allowed from ${currentState} state ${ALLOWED_TRANSITIONS[currentState]}`
    );
  }
}

export class LoanCore {
  private db = AppDataSource.getRepository(Loan);

  async createLoan(data: Partial<Loan>) {
    const loan = this.db.create({ ...data, state: "proposed" });
    return this.db.save(loan);
  }

  async approveLoan(
    id: number,
    approvalUrl: string,
    approvalEmployeeId: number,
    approvalDate: Date = new Date()
  ) {
    const loan = await this.db.findOneBy({ id });
    if (!loan) throw new Error("Loan not found");
    if (loan.state !== "proposed")
      throw new Error(`Loan ${id} cannot be approved`);

    loan.state = "approved";
    loan.approvalUrl = approvalUrl;
    loan.approvalEmployeeId = approvalEmployeeId;
    loan.approvalDate = new Date();

    return this.db.save(loan);
  }

  async investLoan(id: number, investmentAmount: number, investorId: number) {
    const loan = await this.db.findOneBy({ id });
    if (!loan) throw new Error("Loan not found");
    if (loan.state !== "approved")
      throw new Error(`Loan ${id} cannot accept investments`);

    const newInvestedAmount = investmentAmount + loan.totalInvestedAmount;
    if (newInvestedAmount > loan.principal) {
      throw new Error(
        `Would exceeds principal (${loan.principal}). Current invested: ${loan.totalInvestedAmount}`
      );
    }

    loan.totalInvestedAmount = newInvestedAmount;
    if (newInvestedAmount == loan.principal) {
      loan.state = "invested";
    }
    return this.db.save(loan);
  }

  async disburseLoan(
    id: number,
    agreementLetterUrl: string,
    disbursementEmployeeId: number,
    disbursementDate: Date = new Date()
  ) {
    const loan = await this.db.findOneBy({ id });
    if (!loan) throw new Error("Loan not found");
    if (loan.state !== "invested")
      throw new Error(`Loan ${id} cannot be disbursed`);

    loan.state = "disbursed";
    loan.agreementLetterUrl = agreementLetterUrl;
    loan.disbursementEmployeeId = disbursementEmployeeId;
    loan.disbursementDate = disbursementDate;
    return this.db.save(loan);
  }

  async getLoans() {
    return this.db.find();
  }
}
