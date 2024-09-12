import { Request, Response } from "express";
import { User } from "../models/userModel";
import { AppDataSource } from "../config/ormconfig";
import asyncHandler from "express-async-handler";
import successResponse from "../utils/handleResponse";

const userRepository = AppDataSource.getRepository(User);

// Define the controller
const profileController = {
  // Update user profile
  update: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { username, email, firstName, lastName, age, password } = req.body;

    try {
      const user = await userRepository.findOneBy({ id: parseInt(id) });

      if (!user) {
        res.status(404);
        throw new Error("User not found");
      }

      user.username = username;
      user.email = email;
      user.firstName = firstName;
      user.lastName = lastName;
      user.age = age;
      user.password = password;

      const updatedUser = await userRepository.save(user);

      successResponse(res, 200, "Profile updated successfully", updatedUser);
    } catch (error: any) {
      res.status(500);
      throw new Error(error.message);
    }
  }),

  // Get user profile by ID
  getById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const user = await userRepository.findOneBy({ id: parseInt(id) });

      if (!user) {
        res.status(404);
        throw new Error("User not found");
      }

      successResponse(res, 200, "Profile found successfully", user);
    } catch (error: any) {
      res.status(500);
      throw new Error(error.message);
    }
  }),
};

export default profileController;
