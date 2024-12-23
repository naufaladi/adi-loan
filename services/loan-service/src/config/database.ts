import { DataSource } from "typeorm";
import { Loan } from "../entities/Loan";
import { Investor } from "../entities/user/Investor";
import { Borrower } from "../entities/user/Borrower";
import { Investment } from "../entities/Investment";
import { Employee } from "../entities/user/Employee";
import { Disbursement } from "../entities/Disbursement";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "user",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "adi-loan",
  schema: "loan-service",
  synchronize: true,
  logging: false,
  entities: [Loan, Investor, Borrower, Employee, Investment, Disbursement],
});
