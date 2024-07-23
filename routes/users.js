import express from "express";
import User from "../models/User.js";
const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     tags:
 *      - Users
 *     responses:
 *       200:
 *         description: A list of users
 */

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

export default router;
