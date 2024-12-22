import { DataSource } from "typeorm";
import { Loan } from "../entities/Loan";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "user",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "adi-loan",
  schema: "loan-service",
  synchronize: true,
  logging: true,
  entities: [Loan],
});

// export const createSchemaIfNotExists = async () => {
//   const queryRunner = AppDataSource.createQueryRunner();
//   try {
//     await queryRunner.connect();
//     await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "loan-service";`);
//   } catch (error) {
//     console.error("Error creating schema:", error);
//   } finally {
//     await queryRunner.release();
//   }
// };
