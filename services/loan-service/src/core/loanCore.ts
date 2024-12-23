import { AppDataSource } from "../config/database";
import { Investment } from "../entities/Investment";
import { Loan, LoanState, LoanStateEnum } from "../entities/Loan";
import { Borrower } from "../entities/user/Borrower";
import { Employee } from "../entities/user/Employee";
import { Investor } from "../entities/user/Investor";
import PDFDocument from "pdfkit";
import nodemailer from "nodemailer";
import { FindManyOptions } from "typeorm";
import { Disbursement } from "../entities/Disbursement";

const ALLOWED_TRANSITIONS: { [key: string]: LoanState[] } = {
  proposed: ["approved"],
  approved: ["invested"],
  invested: ["disbursed"],
};

function canTransition(currentState: LoanState, newState: LoanState) {
  if (!ALLOWED_TRANSITIONS[currentState]?.includes(newState)) {
    throw new Error(
      `${currentState} state cannot move to ${newState}. Allowed: [${ALLOWED_TRANSITIONS[currentState]}]`
    );
  }
}

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 587,
  secure: false,
  auth: {
    user: "c89254894b03ac",
    pass: "f87c374fa4e1e3",
  },
});

export class LoanCore {
  private loanDb = AppDataSource.getRepository(Loan);
  private investorDb = AppDataSource.getRepository(Investor);
  private employeeDb = AppDataSource.getRepository(Employee);
  private borrowerDb = AppDataSource.getRepository(Borrower);
  private investmentDb = AppDataSource.getRepository(Investment);
  private disbursementDb = AppDataSource.getRepository(Disbursement);

  async createLoan(data: { borrowerId: number; principal: number; interestRate: number }) {
    const borrower = await this.borrowerDb.findOneBy({ id: data.borrowerId });
    if (!borrower) throw new Error("Borrower not found");

    const loan = this.loanDb.create({
      borrower,
      principal: data.principal,
      interestRate: data.interestRate,
      totalROI: data.principal * data.interestRate,
      state: "proposed",
    });
    return this.loanDb.save(loan);
  }

  async approveLoan(
    id: number,
    approvalProofUrl: string,
    approvalEmployeeId: number,
    approvalDate: Date = new Date()
  ) {
    const loan = await this.loanDb.findOneBy({ id });
    const employee = await this.employeeDb.findOne({
      where: { id: approvalEmployeeId },
      relations: { loansApproved: true },
    });

    if (!loan) throw new Error("Loan not found");
    if (!employee) throw new Error("Employee not found");
    canTransition(loan.state, "approved");

    loan.state = "approved";
    loan.approvalProofUrl = approvalProofUrl;
    loan.approvalEmployee = employee;
    loan.approvalDate = approvalDate;

    return this.loanDb.save(loan);
  }

  async investLoan(id: number, investmentAmount: number, investorId: number) {
    const loan = await this.loanDb.findOne({
      where: { id },
      relations: { investments: { investor: true }, borrower: true },
    });
    const investor = await this.investorDb.findOne({ where: { id: investorId } });

    if (!loan) throw new Error("Loan not found");
    if (!investor) throw new Error("Investor not found");
    canTransition(loan.state, "invested");

    const newInvestedAmount = investmentAmount + loan.totalInvestedAmount;
    if (newInvestedAmount > loan.principal) {
      throw new Error(
        `Would exceeds principal (${loan.principal}). Current invested: ${loan.totalInvestedAmount}`
      );
    }

    loan.totalInvestedAmount = newInvestedAmount;

    const investment = new Investment();
    investment.amount = investmentAmount;
    investment.loan = { id } as Loan;
    investment.investor = investor;
    investment.roi = investmentAmount * loan.interestRate;
    loan.investments.push(investment);
    await this.investmentDb.save(investment);

    if (newInvestedAmount == loan.principal) {
      loan.state = "invested";
      this.emailAgreementDoc(loan);
    }
    await this.loanDb.save(loan);
    return loan;
  }

  async emailAgreementDoc(loan: Loan) {
    const doc = new PDFDocument();
    let pdfBuffer = Buffer.from([]);

    doc.on("data", (chunk: Uint8Array<ArrayBufferLike>) => {
      pdfBuffer = Buffer.concat([pdfBuffer, chunk]);
    });
    doc.on("end", async () => {
      loan.investments.forEach(async (investment) => {
        await transporter.sendMail({
          from: "test@gmail.com",
          to: investment.investor.email,
          subject: "Loan has been fully invested",
          text: `Dear ${investment.investor.name}, your investment of IDR ${investment.amount} for loan ID ${loan.id} has been fully invested`,
          attachments: [
            {
              filename: `loan-agreement-${loan.id}.pdf`,
              content: pdfBuffer, // Attach the PDF
            },
          ],
        });
        console.log("email successfully sent to", investment.investor.email);
      });
    });

    // Add content to the PDF
    doc.fontSize(30).text("This is the agreement document", { align: "center" });
    doc.moveDown();
    doc
      .fontSize(16)
      .text(
        `Generated for borrower ${loan.borrower.name} (loan id ${loan.id}), with principal ${loan.principal}`,
        { align: "center" }
      );
    doc.end();
  }

  async disburseLoan(
    id: number,
    agreementLetterUrl: string,
    disbursementEmployeeId: number,
    disbursementDate: Date = new Date()
  ) {
    const loan = await this.loanDb.findOneBy({ id });
    const employee = await this.employeeDb.findOne({
      where: { id: disbursementEmployeeId },
    });

    if (!loan) throw new Error("Loan not found");
    if (!employee) throw new Error("Employee not found");
    canTransition(loan.state, "disbursed");

    const disbursement = new Disbursement();
    disbursement.agreementLetterUrl = agreementLetterUrl;
    disbursement.disbursementDate = disbursementDate;
    disbursement.employee = { id: employee.id } as Employee;
    disbursement.loan = { id: loan.id } as Loan;
    this.disbursementDb.save(disbursement);

    loan.state = "disbursed";
    loan.disbursement = disbursement;
    return this.loanDb.save(loan);
  }

  async getLoans(options?: FindManyOptions<Loan>) {
    return this.loanDb.find(options);
  }

  async getOpenLoans() {
    const loans = await this.loanDb
      .createQueryBuilder("loan")
      .where("loan.totalInvestedAmount < loan.principal")
      .andWhere("loan.approvalProofUrl IS NOT NULL")
      .getMany();
    return loans;
  }
}
