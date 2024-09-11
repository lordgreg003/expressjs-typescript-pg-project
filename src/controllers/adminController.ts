import { ValidationError } from "class-validator";
import { Request, Response, RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import { getRepository } from "typeorm";
import { User } from "../models/userModel";
import successResponse from "../utils/handleResponse";
import { handleValidation } from "../utils/handleValidation"; // Ensure this utility is implemented
import AdminController from "../types/userTypes";
import { AppDataSource } from "../config/ormconfig";

const userRepository: any = AppDataSource.getRepository(User);

const admin: AdminController = {
  // Health check
  health: asyncHandler(async (req: Request, res: Response) => {
    res.send("Hello World!");
  }),

  // Register user
  register: asyncHandler(async (req: Request, res: Response) => {
    // #swagger.tags = ['User Management']
    // #swagger.summary = 'Register a new user'
    // #swagger.description = 'Registers a new user with the provided details, performs validation and checks if the email is already taken.'
    // #swagger.parameters['body'] = {
    //   in: 'body',
    //   description: 'User registration details',
    //   required: true,
    //   schema: {
    //     $ref: '#/definitions/User'
    //   }
    // }
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
          errors: [{ field: "email", message: "Email already taken" }],
        });
        return;
      }

      // Create a new user (password hashing is done in the User model)
      const newUser = userRepository.create({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        password: password.trim(), // Password will be hashed in User model
        age: age.trim(),
      });
      await userRepository.save(newUser);

      // Send the success response
      successResponse(res, 201, "Registration successful", {
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
      res.status(500).json({ status: "failed", message: error.message });
    }
  }),

  // Update user
  update: asyncHandler(async (req: Request, res: Response) => {
    // #swagger.tags = ['User Management']
    // #swagger.summary = 'Update user details'
    // #swagger.description = 'Updates the details of an existing user identified by the user ID.'
    // #swagger.parameters['id'] = {
    //   description: 'User ID',
    //   required: true,
    //   type: 'integer'
    // }
    // #swagger.parameters['body'] = {
    //   in: 'body',
    //   description: 'Updated user details',
    //   required: true,
    //   schema: {
    //     $ref: '#/definitions/User'
    //   }
    // }
    const user = await userRepository.findOneBy({ id: Number(req.params.id) });
    const { firstName, lastName, email, password, age, username } = req.body;

    try {
      if (!user) {
        res.status(404).json({ status: "failed", message: "User not found" });
        return;
      }

      userRepository.merge(user, {
        firstName: firstName?.trim(),
        lastName: lastName?.trim(),
        email: email?.trim(),
        password: password?.trim(),
        age: age?.trim(),
        username: username?.trim().toLowerCase(),
      });

      await userRepository.save(user);

      successResponse(res, 200, "User updated successfully", user);
    } catch (error: any) {
      res.status(500).json({ status: "failed", message: error.message });
    }
  }),

  // Delete user
  delete: asyncHandler(async (req: Request, res: Response) => {
    // #swagger.tags = ['User Management']
    // #swagger.summary = 'Delete a user'
    // #swagger.description = 'Deletes a user identified by the user ID.'
    // #swagger.parameters['id'] = {
    //   description: 'User ID',
    //   required: true,
    //   type: 'integer'
    // }
    const user = await userRepository.findOneBy({ id: Number(req.params.id) });

    try {
      if (!user) {
        res.status(404).json({ status: "failed", message: "User not found" });
        return;
      }

      await userRepository.remove(user);

      successResponse(res, 200, "User deleted successfully", "User deleted");
    } catch (error: any) {
      res.status(500).json({ status: "failed", message: error.message });
    }
  }),

  // Get user by ID
  getById: asyncHandler(async (req: Request, res: Response) => {
    // #swagger.tags = ['User Management']
    // #swagger.summary = 'Get user by ID'
    // #swagger.description = 'Retrieves user details by their ID.'
    // #swagger.parameters['id'] = {
    //   description: 'User ID',
    //   required: true,
    //   type: 'integer'
    // }
    const user = await userRepository.findOneBy({ id: Number(req.params.id) });

    try {
      if (!user) {
        res.status(404).json({ status: "failed", message: "User not found" });
        return;
      }

      successResponse(res, 200, "User found successfully", user);
    } catch (error: any) {
      res.status(500).json({ status: "failed", message: error.message });
    }
  }),

  // Get all users
  getAll: asyncHandler(async (req: Request, res: Response) => {
    // #swagger.tags = ['User Management']
    // #swagger.summary = 'Get all users'
    // #swagger.description = 'Retrieves a list of all users.'
    try {
      const users = await userRepository.find();
      successResponse(res, 200, "Users found successfully", users);
    } catch (error: any) {
      res.status(500).json({ status: "failed", message: error.message });
    }
  }),
};

export default admin;
