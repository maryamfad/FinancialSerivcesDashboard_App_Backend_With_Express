import express from "express";
import User from "../models/User.js";
const router = express.Router();

/**
 * @swagger
 * /trade/buy:
 *   post:
 *     summary: Perform a buy request
 *     tags:
 *       - Trade
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user
 *               stockSymbol:
 *                 type: string
 *                 description: The symbol of the stock to sell
 *               quantity:
 *                 type: number
 *                 description: The quantity of stock to sell
 *               purchasePrice:
 *                 type: number
 *                 description: The price at which to sell the stock
 *     responses:
 *       200:
 *         description: Buy request was successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   description: The ID of the user
 *                 stockSymbol:
 *                   type: string
 *                   description: The symbol of the stock bought
 *                 quantity:
 *                   type: number
 *                   description: The quantity of stock bought
 *                 totalRevenue:
 *                   type: number
 *                   description: The total revenue after the stock bought
 *                 balance:
 *                   type: number
 *                   description: The updated balance of the user
 *       400:
 *         description: Invalid request or insufficient stock quantity
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message
 */
router.post("/buy", async (req, res) => {
  const { userId, stockSymbol, quantity, purchasePrice } = req.body;
  const user = await User.findById(userId);
  const totalCost = quantity * purchasePrice;
  if (user.balance >= totalCost) {
    user.balance -= totalCost;
    user.portfolio.push({ stockSymbol, quantity, purchasePrice });
    await user.save();
    res.json(user);
  } else {
    res.status(400).json({ error: "Insufficient funds" });
  }
});

/**
 * @swagger
 * /trade/sell:
 *   post:
 *     summary: Perform a sell request
 *     tags:
 *       - Trade
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user
 *               stockSymbol:
 *                 type: string
 *                 description: The symbol of the stock to sell
 *               quantity:
 *                 type: number
 *                 description: The quantity of stock to sell
 *               sellingPrice:
 *                 type: number
 *                 description: The price at which to sell the stock
 *     responses:
 *       200:
 *         description: Sell request was successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   description: The ID of the user
 *                 stockSymbol:
 *                   type: string
 *                   description: The symbol of the stock sold
 *                 quantity:
 *                   type: number
 *                   description: The quantity of stock sold
 *                 totalRevenue:
 *                   type: number
 *                   description: The total revenue from the sale
 *                 balance:
 *                   type: number
 *                   description: The updated balance of the user
 *       400:
 *         description: Invalid request or insufficient stock quantity
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message
 */

router.post("/sell", async (req, res) => {
  const { userId, stockSymbol, quantity, sellingPrice } = req.body;
  const user = await User.findById(userId);
  const stock = user.portfolio.find((s) => s.stockSymbol === stockSymbol);

  if (stock && stock.quantity >= quantity) {
    const totalRevenue = quantity * sellingPrice;
    stock.quantity -= quantity;
    if (stock.quantity === 0) {
      user.portfolio = user.portfolio.filter(
        (s) => s.stockSymbol !== stockSymbol
      );
    }
    user.balance += totalRevenue;
    await user.save();
    res.json(user);
  } else {
    res.status(400).json({ error: "Insufficient stock quantity" });
  }
});

// module.exports = router;
export default router
