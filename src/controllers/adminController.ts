import { ValidationError } from "class-validator";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { User } from "../models/userModel";
import { handleValidation } from "../utils/handleValidation";
import { AppDataSource } from "../config/ormconfig";
import responseHandle from "../utils/handleResponse";

const userRepository: any = AppDataSource.getRepository(User);

const AdminController = {
  // #swagger.tags = ['User Management']

  health: asyncHandler(async (req: Request, res: Response) => {
    res.send("Hello World!");
  }),

  // Register user
  // #swagger.tags = ['User Management']

  register: asyncHandler(async (req: Request, res: Response) => {
    // #swagger.tags = ['User Management']

    const { firstName, lastName, email, password, age, username } = req.body;

    try {
      // Validate the user fields
      const errors: ValidationError[] = await handleValidation(
        new User(),
        req.body,
        res
      );
      if (errors.length > 0) {
        console.log(errors);
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
      res.status(500).json({ status: "failed", message: error.message });
    }
  }),

  // Update user
  // #swagger.tags = ['User Management']

  update: asyncHandler(async (req: Request, res: Response) => {
    // #swagger.tags = ['User Management']

    const user = await userRepository.findOneBy({ id: Number(req.params.id) });
    const { firstName, lastName, email, age, username } = req.body;

    try {
      if (!user) {
        res.status(404).json({ status: "failed", message: "User not found" });
        return;
      }

      userRepository.merge(user, {
        firstName: firstName?.trim(),
        lastName: lastName?.trim(),
        email: email?.trim(),
        // password: password?.trim(),
        age: age?.trim(),
        username: username?.trim().toLowerCase(),
      });

      await userRepository.save(user);

      responseHandle.successResponse(
        res,
        200,
        "User updated successfully",
        user
      );
    } catch (error: any) {
      res.status(500).json({ status: "failed", message: error.message });
    }
  }),

  // Delete user
  // #swagger.tags = ['User Management']

  delete: asyncHandler(async (req: Request, res: Response) => {
    // #swagger.tags = ['User Management']

    try {
      const user = await userRepository.findOneBy({
        id: Number(req.params.id),
      });

      if (!user) {
        res.status(404).json({ status: "failed", message: "User not found" });
        return;
      }

      await userRepository.remove(user);

      res.status(200).json({
        status: "success",
        message: "User deleted",
        data: user, // Return the single user object
      });
    } catch (error: any) {
      res.status(500).json({ status: "failed", message: error.message });
    }
  }),

  // Get user by ID
  // #swagger.tags = ['User Management']

  getById: asyncHandler(async (req: Request, res: Response) => {
    // #swagger.tags = ['User Management']

    try {
      // Fetch the user by ID
      const user = await userRepository.findOneBy({
        id: Number(req.params.id),
      });

      // If user not found, return 404 status
      if (!user) {
        res.status(404).json({
          status: "failed",
          message: "User not found",
        });
        return;
      }

      // If user found, return the user details
      res.status(200).json({
        status: "success",
        message: "User found successfully",
        data: user, // Return the single user object
      });
    } catch (error: any) {
      // Handle any errors that occur
      res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  }),

  // Get all users
  // #swagger.tags = ['User Management']

  getAll: asyncHandler(async (req: Request, res: Response) => {
    // #swagger.tags = ['User Management']
    try {
      const users = await userRepository.find();

      // Return a response with an empty array if no users found
      res.status(200).json({
        status: "success",
        message:
          users.length > 0 ? "Users found successfully" : "No users found",
        data: users.length > 0 ? users : [], // Ensure it's an array, even if empty
      });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ status: "failed", message: error.message });
    }
  }),
};

export default AdminController;
