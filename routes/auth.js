import express from "express";
import User from "../models/User.js";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    const newUser = new User({
      username,
      password,
      balance: 10000,
      portfolio: [],
    });
    await newUser.save();
    res.status(200).json(newUser);
  } catch (err) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) throw new Error('Invalid credentials');
    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new Error('Invalid credentials');
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
