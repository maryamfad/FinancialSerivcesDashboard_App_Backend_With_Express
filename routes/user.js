import express from "express";
import User from "../models/User.js";
const router = express.Router();

/**
 * @swagger
 * /user/all:
 *   get:
 *     summary: Retrieve a list of users
 *     tags:
 *      - Users
 *     responses:
 *       200:
 *         description: A list of users
 */

router.get("/all", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

/**
 * @swagger
 * /user/{userId}:
 *   get:
 *     summary: Get the user by id
 *     tags: 
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *                 
 *     responses:
 *       200:
 *         description: A user information
 *       404:
 *         description: user not found
 *       500:
 *         description: server error
 */
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
export default router;
