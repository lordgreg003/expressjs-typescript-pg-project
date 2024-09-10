import "reflect-metadata";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes";
import express from "express";
import { Request, Response, NextFunction } from "express";

import { AppDataSource } from "./config/ormconfig";
import AuthMiddleware from "./middllewares/userMiddleware";
import errorMiddleware from "./middllewares/errorMiddleware";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Create an instance of the Express app
const app = express();
const { readFileSync } = require("fs");
const swaggerUi = require("swagger-ui-express");

// Read the JSON file synchronously
const rawData = readFileSync("./src/swagger/swagger_output.json", "utf-8");
const swaggerFile = JSON.parse(rawData);

// Middleware
app.use(express.json()); // Body parser for handling JSON data
app.use(cors());

app.use(bodyParser.json());
console.log("Database Name:", process.env.DB_NAME);

// Database connection setup
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });
AuthMiddleware;

// Routes
app.use("/api/v1.0", authRoutes); // Use authRoutes as a middleware

// swagger inititailization
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Error Handling Middleware
app.use(errorMiddleware.notFound); // Handle 404 errors
app.use(errorMiddleware.errorHandler); // Global error handler

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
