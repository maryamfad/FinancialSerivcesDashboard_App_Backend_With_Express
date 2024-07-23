import express from "express";
import User from "../models/User.js";
const router = express.Router();
import {authMiddleware} from "../routes/auth.js";
/**
 * @swagger
 * /trade/buy:
 *   post:
 *     summary: Perform a buy request
 *     security:
 *       - BearerAuth: []
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
 *                 example: "669ef955f2d651be269c1921"
 *               stockSymbol:
 *                 type: string
 *                 example: "AAPL"
 *               quantity:
 *                 type: number
 *                 example: 3
 *               purchasePrice:
 *                 type: number
 *                 example: 140
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
 *                 stockSymbol:
 *                   type: string                   
 *                 quantity:
 *                   type: number                   
 *                 totalRevenue:
 *                   type: number                  
 *                 balance:
 *                   type: number                  
 *       400:
 *         description: Invalid request
 *         
 *                   
 *     
 */
router.post("/buy", authMiddleware, async (req, res) => {
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
 *     security:
 *       - BearerAuth: []
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
 *                 example: "669ef955f2d651be269c1921"
 *               stockSymbol:
 *                 type: string
 *                 example: "AAPL"
 *               quantity:
 *                 type: number
 *                 example: 3
 *               sellingPrice:
 *                 type: number
 *                 example: 120
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
 *                 stockSymbol:
 *                   type: string                   
 *                 quantity:
 *                   type: number                   
 *                 totalRevenue:
 *                   type: number                   
 *                 balance:
 *                   type: number                   
 *       400:
 *         description: Invalid request or insufficient stock quantity
 *                           
 */

router.post("/sell", authMiddleware, async (req, res) => {
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
export default router;
