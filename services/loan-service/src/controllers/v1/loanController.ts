import { Request, Response } from "express";
import { LoanCore } from "../../core/loanCore";

// TODO use zod or type inference to infer request body type from validator
export class LoanController {
  private loan = new LoanCore();

  createLoan = async (req: Request, res: Response) => {
    try {
      const loan = await this.loan.createLoan(req.body);
      res.status(201).json(loan);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  approveLoan = async (req: Request, res: Response) => {
    try {
      const loan = await this.loan.approveLoan(
        +req.params.id,
        req.body.approvalProofUrl,
        +req.body.approvalEmployeeId,
        req.body.approvalDate
      );
      res.status(200).json(loan);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  investLoan = async (req: Request, res: Response) => {
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
  };

  disburseLoan = async (req: Request, res: Response) => {
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
  };

  getLoans = async (req: Request, res: Response) => {
    try {
      console.log("this :>> ", this);
      const loans = await this.loan.getLoans();
      res.status(200).json(loans);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}
