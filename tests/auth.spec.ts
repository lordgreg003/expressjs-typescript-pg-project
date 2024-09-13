import http, { IncomingMessage, ServerResponse } from "http";
import request from "supertest";
import { AppDataSource } from "../src/config/ormconfig";
import app from "../src/server";

// Define types for the server and response
let server: http.Server;
let randomInteger: number;
let firstName: string;
let lastName: string;
let username: string;
let password: string;
let age: number;

// Setup and teardown
beforeAll(async () => {
  await AppDataSource.initialize();
  console.log("Data Source has been initialized!");

  server = http.createServer(app);
  server.listen(3001, () => {
    console.log("Test server running on port 3001");
  });
});

afterAll(async () => {
  await AppDataSource.destroy();
  console.log("Data Source has been closed!");

  server.close();
});

// Generate random test data
beforeEach(() => {
  randomInteger = Math.floor(Math.random() * 100) + 1;
  firstName = "John" + randomInteger;
  lastName = "Doe" + randomInteger;
  username = "james" + randomInteger;
  password = "password" + randomInteger;
  age = randomInteger;
});

// Register tests
describe("POST /api/v1.0/register", () => {
  it("Should Fail If Required Fields Are Missing", async () => {
    const res = await request(app).post("/api/v1.0/register").send({});
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("status", "failed");
    expect(res.body).toHaveProperty("errors", expect.any(Array));
  });

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/v1.0/register")
      .send({
        username: username,
        firstName: firstName,
        lastName: lastName,
        email: `nYvFf7${randomInteger}@example.com`,
        password: password,
        age: age,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("status", "success");
    expect(res.body).toHaveProperty("message", "Registration successful");
    expect(res.body.data).toHaveProperty("accessToken", expect.any(String));
    expect(res.body.data).toHaveProperty("user", expect.any(Object));
  });

  it("Should Fail if there’s Duplicate Email or UserID", async () => {
    const res = await request(app)
      .post("/api/v1.0/register")
      .send({
        username: username,
        firstName: firstName,
        lastName: lastName,
        email: `nYvFf7${randomInteger}@example.com`,
        password: password,
        age: age,
      });

    expect(res.statusCode).toBe(422);
    expect(res.body).toHaveProperty("status", "failed");
    expect(res.body).toHaveProperty("errors", expect.any(Array));
  });
});
