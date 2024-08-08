import express from "express";
import Portfolio from "../models/Portfolio.js";
import updatePortfolioPerformance from "../utils/updatePortfolioPerformance.js";

const router = express.Router();
import { authMiddleware } from "../routes/auth.js";

/**
 * @swagger
 * /trade/portfolio/{userId}:
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
 * /update/{userId}:
 *   get:
 *     summary: Update the portfolio by id
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
export default router;
