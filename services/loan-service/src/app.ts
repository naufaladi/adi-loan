import "reflect-metadata";
import express, { ErrorRequestHandler, json } from "express";
import { AppDataSource } from "./config/database";
import router from "./routes";

const app = express();
const port = 5050;

app.use(json());
app.use("/api", router);

app.get("/health-check", (req, res) => {
  res.status(200).json({ message: "loan-service is running" });
});

// Error handling
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log("err :>> ", err);
  res.status(500).json({ message: err.message });
};
app.use(errorHandler);

// Database
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });

// Start the server
app.listen(port, () => {
  console.log(`loan-service is running on port ${port}`);
});
