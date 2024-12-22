import { Request, Response } from "express";
import { LoanService } from "../../core/LoanService";

export class LoanController {
  private loanService = new LoanService();

  // TODO do some req validation

  async createLoan(req: Request, res: Response) {
    try {
      const loan = await this.loanService.createLoan(req.body);
      res.status(201).json(loan);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async approveLoan(req: Request, res: Response) {
    try {
      const loan = await this.loanService.approveLoan(
        +req.params.id,
        req.body.approvalProof
      );
      res.status(200).json(loan);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async investLoan(req: Request, res: Response) {
    try {
      const loan = await this.loanService.investLoan(
        +req.params.id,
        req.body.investmentAmount
      );
      res.status(200).json(loan);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async disburseLoan(req: Request, res: Response) {
    try {
      const loan = await this.loanService.disburseLoan(+req.params.id);
      res.status(200).json(loan);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getLoans(req: Request, res: Response) {
    try {
      const loans = await this.loanService.getLoans();
      res.status(200).json(loans);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
