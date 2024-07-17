const express = require('express');
const User = require('./models/User');
const router = express.Router();
const axios = require('axios');

// Register User
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const newUser = new User({ username, password, balance: 10000, portfolio: [] });
  await newUser.save();
  res.json(newUser);
});
module.exports = router;