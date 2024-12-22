import { Request, Response } from "express";
import { LoanCore } from "../../core/loanCore";

export class LoanController {
  private loan = new LoanCore();

  async createLoan(req: Request, res: Response) {
    try {
      const loan = await this.loan.createLoan(req.body);
      res.status(201).json(loan);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async approveLoan(req: Request, res: Response) {
    try {
      const loan = await this.loan.approveLoan(
        +req.params.id,
        req.body.approvalUrl,
        +req.body.approvalEmployeeId,
        req.body.approvalDate
      );
      res.status(200).json(loan);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async investLoan(req: Request, res: Response) {
    try {
      const loan = await this.loan.investLoan(
        +req.params.id,
        req.body.investmentAmount,
        +req.body.investorId
      );
      res.status(200).json(loan);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async disburseLoan(req: Request, res: Response) {
    try {
      const loan = await this.loan.disburseLoan(
        +req.params.id,
        req.body.agreementLetterUrl,
        +req.body.disbursementEmployeeId,
        req.body.disbursementDate
      );
      res.status(200).json(loan);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getLoans(req: Request, res: Response) {
    try {
      const loans = await this.loan.getLoans();
      res.status(200).json(loans);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
