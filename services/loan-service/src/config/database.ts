import { DataSource } from "typeorm";
import { Loan } from "../entities/Loan";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "user",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "loan_service",
  synchronize: true, // Disable this in production
  logging: false,
  entities: [Loan],
});