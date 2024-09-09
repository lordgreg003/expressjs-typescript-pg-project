import "reflect-metadata";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes";
import express from "express";
import { Request, Response, NextFunction } from "express";
import morgan from "morgan";

import { AppDataSource } from "./config/ormconfig";
import AuthMiddleware from "./middllewares/userMiddleware";
import errorMiddleware from "./middllewares/errorMiddleware";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Create an instance of the Express app
const app = express();

// Middleware
app.use(express.json()); // Body parser for handling JSON data
app.use(cors()); // Enabling CORS for all requests
app.use(morgan("dev")); // Logging HTTP requests
app.use(bodyParser.json());

console.log("Database Host:", process.env.DB_HOST);
console.log("Database Port:", process.env.DB_PORT);
console.log("Database Username:", process.env.DB_USERNAME);
console.log("Database Password Type:", typeof process.env.DB_PASSWORD);

console.log("Database Name:", process.env.DB_NAME);

// Database connection setup
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

// Routes
app.post("/api/v1.0", authRoutes); // User registration route
app.post("/api/v1.0", authRoutes); // User login route

// Example protected route using the AuthMiddleware
app.get(
  "/api/protected",
  AuthMiddleware.protectUser,
  (req: Request, res: Response) => {
    res.json({ message: "This is a protected route" });
  }
);

// Error Handling Middleware
app.use(errorMiddleware.notFound); // Handle 404 errors
app.use(errorMiddleware.errorHandler); // Global error handler

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
