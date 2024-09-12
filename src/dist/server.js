"use strict";
exports.__esModule = true;
require("reflect-metadata");
var dotenv_1 = require("dotenv");
var path_1 = require("path");
var cors_1 = require("cors");
var body_parser_1 = require("body-parser");
var authRoutes_1 = require("./routes/authRoutes");
var express_1 = require("express");
var morgan_1 = require("morgan");
var ormconfig_1 = require("./config/ormconfig");
var userMiddleware_1 = require("./middllewares/userMiddleware");
var errorMiddleware_1 = require("./middllewares/errorMiddleware");
// Load environment variables from .env file
dotenv_1["default"].config({
  path: path_1["default"].resolve(__dirname, "../.env"),
});
// Create an instance of the Express app
var app = express_1["default"]();
// Middleware
app.use(express_1["default"].json()); // Body parser for handling JSON data
app.use(cors_1["default"]()); // Enabling CORS for all requests
app.use(morgan_1["default"]("dev")); // Logging HTTP requests
app.use(body_parser_1["default"].json());
console.log("Database Host:", process.env.DB_HOST);
console.log("Database Port:", process.env.DB_PORT);
console.log("Database Username:", process.env.DB_USERNAME);
console.log("Database Password Type:", typeof process.env.DB_PASSWORD);
console.log("Database Name:", process.env.DB_NAME);
// Database connection setup
ormconfig_1.AppDataSource.initialize()
  .then(function () {
    console.log("Database connected successfully");
  })
  ["catch"](function (error) {
    console.error("Database connection error:", error);
  });
// Routes
app.post("/api/v1.0", authRoutes_1["default"]); // User registration route
app.post("/api/v1.0", authRoutes_1["default"]); // User login route
// Example protected route using the AuthMiddleware
app.get(
  "/api/protected",
  userMiddleware_1["default"].protectUser,
  function (req, res) {
    res.json({ message: "This is a protected route" });
  }
);
// Error Handling Middleware
app.use(errorMiddleware_1["default"].notFound); // Handle 404 errors
app.use(errorMiddleware_1["default"].errorHandler); // Global error handler
// Start the server
var PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  console.log(
    "Server running in " + process.env.NODE_ENV + " mode on port " + PORT
  );
});
