import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import path from "path";
import { AppDataSource } from "../config/ormconfig";
import { User } from "../models/userModel";
import tokenHandler from "../utils/handleToken";

// Configure dotenv to load the .env file
dotenv.config({ path: path.resolve(__dirname, "../.env") });

/**
 * @description This middleware checks the user admin token supplied as Bearer authorization
 * @required Bearer Authorization
 */

const AuthMiddleware: any = {};
const userRepository = AppDataSource.getRepository(User);

AuthMiddleware.protectUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const receivedToken: string | undefined = req.headers.authorization;
    let token: string | undefined;
    const eMessage = "You are not authorized to use this service, token failed";

    if (receivedToken && receivedToken.startsWith("Bearer")) {
      try {
        token = receivedToken.split(" ")[1];

        // Decode the token using tokenHandler
        const decoded: any = tokenHandler.decodeToken(token);

        // Find the user using decoded information
        const user = await userRepository.findOne({
          where: { email: decoded.fieldToSecure.email }, // Using decoded email from token
          select: ["id", "firstName", "lastName", "email", "password", "age"],
        });

        if (!user) {
          res.status(401);
          throw new Error("You are not authorized to use this service yet.");
        }

        // Attach the user to the request object (TypeScript note: extend req object type for user if needed)
        (req as any).user = user;

        next();
      } catch (error: any) {
        res.status(401);
        throw new Error(eMessage);
      }
    } else {
      // No token provided
      res.status(401);
      throw new Error(
        "You are not authorized to use this service, no token provided."
      );
    }
  }
);

export default AuthMiddleware;
