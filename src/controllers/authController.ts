import { ValidationError } from "class-validator";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { AppDataSource } from "../config/ormconfig";
import { User } from "../models/userModel";
import responseHandle from "../utils/handleResponse";
import tokenHandler from "../utils/handleToken";
import { handleValidation } from "../utils/handleValidation";

const userRepository: any = AppDataSource.getRepository(User);
const authController: any = {};

// Registration Logic
authController.register = asyncHandler(async (req: Request, res: Response) => {
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
      return;
    }

    // Check if the email is already taken
    const emailTaken = await userRepository.findOne({
      where: { email: email.trim().toLowerCase() },
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
      return;
    }

    // Create a new user (password hashing is done in the User model)
    const newUser = userRepository.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username: username.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      password: password.trim(), // No need to hash again here
      age: age.trim(),
    });
    await userRepository.save(newUser);

    // Send the success response (No need to return a token here)
    responseHandle.successResponse(res, 201, "Registration successful", {
      user: {
        userId: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
        email: newUser.email,
        age: newUser.age,
      },
    });
  } catch (error: any) {
    throw new Error(error);
  }
});

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
      },
      "1d"
    );

    // Send the success response with token
    responseHandle.successResponse(res, 200, "Login successful", {
      accessToken,
      user: {
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age,
      },
    });
  } catch (error: any) {
    throw new Error(error);
  }
});

export default authController;
