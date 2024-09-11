import express from "express";
import adminController from "../controllers/adminController";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin related operations
 */

/**
 * @swagger
 * /api/v1.0/admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: Get all users (Protected)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/admin/users", adminController.getAll);

/**
 * @swagger
 * /api/v1.0/admin/user/{id}:
 *   get:
 *     tags: [Admin]
 *     summary: Get a user by ID (Protected)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/admin/user/:id", adminController.getById);

/**
 * @swagger
 * /api/v1.0/admin/user/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update a user by ID (Protected)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               age:
 *                 type: string
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.put("/admin/user/:id", adminController.update);

/**
 * @swagger
 * /api/v1.0/admin/user:
 *   post:
 *     tags: [Admin]
 *     summary: Create a new user (Protected)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               age:
 *                 type: string
 *               username:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       422:
 *         description: Email already taken
 *       500:
 *         description: Server error
 */
router.post("/admin/user", adminController.register);

/**
 * @swagger
 * /api/v1.0/admin/user/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete a user by ID (Protected)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.delete("admin/user/:id", adminController.delete);

export default router;
