import Portfolio from "../models/Portfolio.js";
import User from "../models/User.js";
import fetchCurrentMarketValue from "./fetchCurrentMarketValue.js";

async function updatePortfolioPerformance(portfolioId, userId) {
	try {
		const portfolio = await Portfolio.findById(portfolioId);
		const user = await User.findById(userId);
		if (!portfolio) {
			throw new Error("Portfolio not found");
		}

		let totalValue = user.balance;

		for (const stock of portfolio.stocks) {
			try {
				const currentValue = await fetchCurrentMarketValue(
					stock.stockSymbol
				);

				if (
					currentValue !== null &&
					typeof currentValue === "number" &&
					!isNaN(currentValue)
				) {
					stock.currentValue = currentValue;
					totalValue += currentValue * stock.quantity;
				} else {
					throw new Error(
						`Failed to fetch market value for stock: ${stock.stockSymbol}`
					);
				}
			} catch (fetchError) {
				console.error(
					`Error fetching market value for stock: ${stock.stockSymbol}`,
					fetchError
				);
			}
		}
		if (totalValue === 0) {
			throw new Error(
				`Total value of portfolio ${portfolioId} is zero. Ensure stock data is accurate.`
			);
		}

		portfolio.performance.push({ value: totalValue, date: new Date() });
		portfolio.updatedAt = new Date();

		await portfolio.save();

		return portfolio;
	} catch (error) {
		console.error(`Failed to update portfolio ${portfolioId}:`, error);
	}
}

export default updatePortfolioPerformance;
