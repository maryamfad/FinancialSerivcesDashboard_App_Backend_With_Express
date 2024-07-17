const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.post('/buy', async (req, res) => {
    // console.log("buy");
    const { userId, stockSymbol, quantity, purchasePrice } = req.body;
    const user = await User.findById(userId);
    const totalCost = quantity * purchasePrice;
    if (user.balance >= totalCost) {
      user.balance -= totalCost;
      user.portfolio.push({ stockSymbol, quantity, purchasePrice });
      await user.save();
      res.json(user);
    } else {
      res.status(400).json({ error: 'Insufficient funds' });
    }
  });

  module.exports = router;