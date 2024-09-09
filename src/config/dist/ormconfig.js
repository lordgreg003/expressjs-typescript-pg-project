"use strict";
exports.__esModule = true;
exports.AppDataSource = void 0;
var dotenv_1 = require("dotenv");
var path_1 = require("path");
var typeorm_1 = require("typeorm");
// import { Organisation } from "./entity/organisation.entities";
var userModel_1 = require("../models/userModel");
// Configure dotenv to load the .env file
dotenv_1["default"].config({ path: path_1["default"].resolve(__dirname, "../.env") });
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [userModel_1.User],
    subscribers: [],
    migrations: [userModel_1.User, "path/to/migration/*.ts"]
});
