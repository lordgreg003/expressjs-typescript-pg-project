import dotenv from "dotenv";
import path from "path";
import { DataSource } from "typeorm";
import { User } from "../models/userModel";

// Configure dotenv to load the .env file
dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT!),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User],
  subscribers: [],
  migrations: [User, "path/to/migration/*.ts"],
});
