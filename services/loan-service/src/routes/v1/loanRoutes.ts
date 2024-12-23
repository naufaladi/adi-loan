import { Router } from "express";
import { LoanController } from "../../controllers/v1/loanController";

const router = Router();
const loan = new LoanController();

// TODO request validator with zod
// TODO add auth

router.post("/", loan.createLoan);
router.patch("/:id/approve", loan.approveLoan);
router.patch("/:id/invest", loan.investLoan);
router.patch("/:id/disburse", loan.disburseLoan);

router.get("/", loan.getLoans);
router.get("/open", loan.getOpenLoans);

/**
 * TODO
 * getLoans pagination, sort, filter
 * edit loan.approvalProofUrl
 */

export default router;
