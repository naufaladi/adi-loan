import { AppDataSource } from "../config/database";
import { Borrower } from "../entities/user/Borrower";
import { Employee } from "../entities/user/Employee";
import { Investor } from "../entities/user/Investor";

export async function seedData() {
  try {
    const borrowerDb = AppDataSource.getRepository(Borrower);
    const investorDb = AppDataSource.getRepository(Investor);
    const employeeDb = AppDataSource.getRepository(Employee);

    const existingEmployees = await employeeDb.count();
    if (existingEmployees) {
      console.log("Data already exist, aborting seed operation");
      return;
    }

    // Seed Borrower data
    const borrowers = [
      { name: "Alice Johnson", email: "alice.johnson@example.com" },
      { name: "Bob Smith", email: "bob.smith@example.com" },
      { name: "Charlie Brown", email: "charlie.brown@example.com" },
    ];
    await borrowerDb.save(borrowers);

    // Seed Investor data
    const investors = [
      { name: "Diana Prince", email: "diana.prince@example.com" },
      { name: "Edward Norton", email: "adimaheswara99@gmail.com" },
      { name: "Fiona Gallagher", email: "fiona.gallagher@example.com" },
    ];
    await investorDb.save(investors);

    // Seed Employee data
    const employees = [
      { name: "George Clooney", email: "george.clooney@example.com" },
      { name: "Hannah Baker", email: "hannah.baker@example.com" },
      { name: "Ian Malcolm", email: "ian.malcolm@example.com" },
    ];
    await employeeDb.save(employees);

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error during seeding:", error);
  }
}
