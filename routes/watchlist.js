import express from "express";
const router = express.Router();
import Watchlist from "../models/Watchlist.js";
import { authMiddleware } from "../routes/auth.js";


/**
 * @swagger
 * /watchlist/add/{userId}:
 *   post:
 *     summary: Add a stock to Watchlist
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Watchlist
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stockSymbol:
 *                 type: string
 *                 example: "AAPL"
 *     responses:
 *       200:
 *         description: Buy request was successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 watchlist:
 *                   type: object
 *       400:
 *         description: Invalid request
 *
 *
 *
 */
router.post("/add/:userId", authMiddleware, async (req, res) => {
	try {
		const { userId } = req.params;
		const { stockSymbol } = req.body;

		let watchlist = await Watchlist.findOne({ userId });

		if (!watchlist) {
			watchlist = new Watchlist({ userId, stocks: [] });
		}

		const stockExists = watchlist.stocks.some(
			(stock) => stock.stockSymbol === stockSymbol
		);

		if (!stockExists) {
			watchlist.stocks.push({ stockSymbol });
			await watchlist.save();
			res.status(201).json({
				message: "Stock added to watchlist",
				watchlist,
			});
		} else {
			res.status(400).json({ message: "Stock already in watchlist" });
		}
	} catch (error) {
		res.status(500).json({
			error: "An error occurred while adding to the watchlist",
			details: error.message,
		});
	}
});

/**
 * @swagger
 * /watchlist/{userId}/:
 *   get:
 *     summary: Retrieve the list of the sotcks in the watchlist
 *     security:
 *       - BearerAuth: []
 *     tags:
 *      - Watchlist
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: A list of the sotcks in the watchlist
 */

router.get('/:userId',authMiddleware, async (req, res) => {
    try {
      const { userId } = req.params;
  
      const watchlist = await Watchlist.findOne({ userId });
  
      if (watchlist) {
        res.json(watchlist);
      } else {
        res.status(404).json({ message: 'No watchlist found for this user' });
      }
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while retrieving the watchlist', details: error.message });
    }
  });
export default router;
