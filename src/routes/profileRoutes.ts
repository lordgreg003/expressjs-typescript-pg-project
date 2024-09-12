import { Router } from "express";
import profileController from "../controllers/profileController";

const router = Router();

// Get user profile by ID
router.get("/profile/:id", profileController.getById);

// Update user profile by ID
router.put("/profile/:id", profileController.update);

export default router;
