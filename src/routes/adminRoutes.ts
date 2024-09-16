import { Router } from "express";

import adminController from "../controllers/adminController";
import AuthMiddleware from "../middllewares/userMiddleware";

const adminRoutes = Router();

adminRoutes.use(AuthMiddleware.protectUser);

adminRoutes.get("/admin/users", adminController.getAll);

adminRoutes.get("/admin/user/:id", adminController.getById);

adminRoutes.put("/admin/user/:id", adminController.update);

adminRoutes.post("/admin/user", adminController.register);

adminRoutes.delete("/admin/user/:id", adminController.delete);

export default adminRoutes;
