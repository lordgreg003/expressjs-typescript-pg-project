import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { User } from "../models/userModel"; // Adjust the import path as needed
import tokenHandler from "../utils/handleToken"; // Adjust the import path as needed
import { AppDataSource } from "../config/ormconfig"; // Adjust path as necessary

const userRepository = AppDataSource.getRepository(User);

interface DecodedToken {
  fieldToSecure: {
    username: string;
  };
}

interface AuthRequest extends Request {
  user?: any; // Define a proper type for user if available
}

/**
 * @description This middleware checks the user token supplied as Bearer authorization
 * @required Bearer Authorization
 */
const AuthMiddleware = {
  protectUser: asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      const receivedToken = req.headers.authorization;
      let token: string | undefined;
      const eMessage =
        "You are not authorized to use this service, token failed";

      if (receivedToken && receivedToken.startsWith("Bearer ")) {
        try {
          token = receivedToken.split(" ")[1];

          if (!token) {
            res
              .status(401)
              .json({ message: "Token is missing from authorization header." });
            return;
          }

          const decoded = tokenHandler.decodeToken(token) as DecodedToken;
          console.log("Decoded token details:", decoded);

          const user = await userRepository.findOne({
            where: { username: decoded.fieldToSecure.username },
            select: ["id", "firstName", "lastName", "email", "age"], // Adjust fields as needed
          });

          if (!user) {
            res.status(401).json({
              message: "You are not authorized to use this service yet.",
            });
            return;
          }

          req.user = user;

          next();
        } catch (error) {
          console.error("Error decoding token or finding user:", error);
          res.status(401).json({ message: eMessage });
        }
      } else {
        res.status(401).json({
          message:
            "You are not authorized to use this service, no token provided.",
        });
      }
    }
  ),
};

export default AuthMiddleware;
