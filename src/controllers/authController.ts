import { ValidationError } from "class-validator";
import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { AppDataSource } from "../config/ormconfig";
import { User } from "../models/userModel";
import responseHandle from "../utils/handleResponse";
import tokenHandler from "../utils/handleToken";
import { handleValidation } from "../utils/handleValidation";
import jwt from "jsonwebtoken";

const userRepository: any = AppDataSource.getRepository(User);
const authController: any = {};

authController.register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // #swagger.tags = ['Auth']
    const { firstName, lastName, email, password, age, username } = req.body;

    try {
      // Validate the user fields
      const errors: ValidationError[] = await handleValidation(
        new User(),
        req.body,
        res
      );
      if (errors.length > 0) {
        return; // No need to return anything, just exit the function
      }

      // Check if the email is already taken
      const emailTaken = await userRepository.findOne({
        where: { email: (email || "").trim().toLowerCase() },
      });
      if (emailTaken) {
        res.status(422).json({
          status: "failed",
          errors: [
            {
              field: "email",
              message: "Email already taken",
            },
          ],
        });
        return; // Exit the function after sending the response
      }

      // Create a new user (password hashing is done in the User model)
      const newUser = userRepository.create({
        firstName: (firstName || "").trim(),
        lastName: (lastName || "").trim(),
        username: (username || "").trim().toLowerCase(),
        email: (email || "").trim().toLowerCase(),
        password: (password || "").trim(),
        age: age || "",
      });

      await userRepository.save(newUser);

      // Generate access token
      const accessToken = jwt.sign(
        { id: newUser.id, email: newUser.email },
        process.env.JWT_SECRET || "your_secret_key",
        { expiresIn: "30d" }
      );

      // Send the success response
      res.status(201).json({
        status: "success",
        message: "Registration successful",
        data: {
          accessToken,
          user: {
            id: newUser.id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            username: newUser.username,
            email: newUser.email,
            age: newUser.age,
          },
        },
      });
    } catch (error: any) {
      console.error("Error during user registration: ", error);
      next(error);
    }
  }
);

// Login Logic
authController.login = asyncHandler(async (req: Request, res: Response) => {
  // #swagger.tags = ['Auth']
  const { username, password } = req.body;

  try {
    // Validate the user fields
    const errors: ValidationError[] = await handleValidation(
      new User(),
      req.body,
      res
    );
    if (errors.length > 0) {
      return;
    }

    // Check if the username exists
    const user = await userRepository.findOne({
      where: { username: username.trim().toLowerCase() },
    });
    if (!user) {
      res.status(401).json({
        errors: [
          {
            field: "username",
            message: "User does not exist",
          },
        ],
      });
      return;
    }

    // Validate the password (using matchPassword from User model)
    const validPassword = await user.matchPassword(password.trim());
    if (!validPassword) {
      res.status(401).json({
        errors: [
          {
            field: "password",
            message: "Invalid password",
          },
        ],
      });
      return;
    }

    // Generate a token and send it along with user details
    const accessToken = tokenHandler.generateToken(
      {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
      },
      "1d"
    );

    // Send the success response
    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        accessToken,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          age: user.age,
        },
      },
    });
  } catch (error: any) {
    console.error("Error during login:", error); // Log the error for debugging
    res.status(500).json({
      errors: [
        {
          message: "Server error. Please try again later.",
        },
      ],
    });
  }
});

export default authController;
