import { Router } from "express";
import { LoanController } from "../../controllers/v1/loanController";

const router = Router();
const loan = new LoanController();

// TODO request validator

router.post("/", loan.createLoan);

router.put("/:id/approve", loan.approveLoan);
router.put("/:id/invest", loan.investLoan);
router.put("/:id/disburse", loan.disburseLoan);

router.get("/", loan.getLoans);

export default router;
