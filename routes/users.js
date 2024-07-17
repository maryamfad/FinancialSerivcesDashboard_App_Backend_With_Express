const express = require("express");
const User = require("../models/User");
const router = express.Router();


/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
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

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const newUser = new User({
    username,
    password,
    balance: 10000,
    portfolio: [],
  });
  await newUser.save();
  res.json(newUser);
});
module.exports = router;
