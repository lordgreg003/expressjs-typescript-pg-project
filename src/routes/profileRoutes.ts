import { Router } from "express";
import profileController from "../controllers/profileController";
import AuthMiddleware from "../middllewares/userMiddleware";

const router = Router();

router.use(AuthMiddleware.protectUser);

// Get user profile by ID
router.get("/profile/:id", profileController.getById);

// Update user profile by ID
router.put("/profile/:id", profileController.update);

export default router;
