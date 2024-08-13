import express from "express";
const router = express.Router();
import Watchlist from "../models/Watchlist.js";
import { authMiddleware } from "../routes/auth.js";

router.post("/add/:userId", authMiddleware, async (req, res) => {
	try {
		const { userId } = req.params;
		const { stockSymbol } = req.body;

		let watchlist = await Watchlist.findOne({ userId });

		if (!watchlist) {
			watchlist = new Watchlist({ userId, stocks: [] });
		}

		// Check if the stock is already in the watchlist
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

export default router;
