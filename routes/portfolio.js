import express from "express";
import Portfolio from "../models/Portfolio.js";
import updatePortfolioPerformance from "../utils/updatePortfolioPerformance.js";

const router = express.Router();
import { authMiddleware } from "../routes/auth.js";

/**
 * @swagger
 * /portfolio/{userId}:
 *   get:
 *     summary: Get the portfolio by id
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Trade
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
 *         description: An order information
 *       401:
 *         description: There is no portfolio
 *       500:
 *         description: server error
 */
router.get("/:userId", authMiddleware, async (req, res) => {
	const { userId } = req.params;

	try {
		const portfolio = await Portfolio.find({ userId });

		if (!portfolio || portfolio.length === 0) {
			return res
				.status(401)
				.json({ message: "No portfolio found for this user" });
		}

		res.json(portfolio);
	} catch (error) {
		res.status(500).json({
			message: "An error occurred while retrieving the portfolio",
			details: error.message,
		});
	}
});

/**
 * @swagger
 * /portfolio/update/{userId}:
 *   get:
 *     summary: Update the portfolio by id
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Portfolio
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
 *         description: An order information
 *       401:
 *         description: There is no portfolio
 *       500:
 *         description: server error
 */
router.put("/update/:userId", authMiddleware, async (req, res) => {
	const { userId } = req.params;

	try {
		const portfolio = await Portfolio.find({ userId });
		if (!portfolio || portfolio.length === 0) {
			return res
				.status(401)
				.json({ message: "No portfolio found for this user" });
		}
		const updatedPortfolio = await updatePortfolioPerformance(
			portfolio[0]._id
		);
		res.json(updatedPortfolio);
	} catch (error) {
		res.status(500).json({
			message: "Failed to update portfolio",
			details: error.message,
		});
	}
});

/**
 * @swagger
 * /portfolio/holdings/{userId}:
 *   get:
 *     summary: get Holdings by id
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Portfolio
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
 *         description: A list of holdings
 *       401:
 *         description: There is no holding
 *       500:
 *         description: server error
 */

router.get("/holdings/:userId", authMiddleware, async (req, res) => {
	try {
		const { userId } = req.params;

		const portfolio = await Portfolio.findOne({ userId });

		if (!portfolio || portfolio.stocks.length === 0) {
			return res
				.status(404)
				.json({ message: "No Holding found for this user" });
		}

		const totalPortfolioValue = portfolio.stocks.reduce((acc, stock) => {
			if (!stock.quantity || !stock.price) {
				throw new Error('Stock data is incomplete');
			}
			return acc + stock.quantity * stock.price;
		}, 0);

		const holdingsWithPercentages = portfolio.stocks.map((stock) => {
			const holdingValue = stock.quantity * stock.price;
			const holdingPercentage =
				(holdingValue / totalPortfolioValue) * 100;

			return {
				stockSymbol: stock.stockSymbol,
				quantity: stock.quantity,
				value: holdingValue,
				percentage: holdingPercentage.toFixed(2),
			};
		});

		res.json(holdingsWithPercentages);
	} catch (error) {
		console.error(error);
		res.status(500).json({
			error: "An error occurred while retrieving the holdings",
		});
	}
});

export default router;
