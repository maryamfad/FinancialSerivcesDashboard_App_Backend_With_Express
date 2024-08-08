import Portfolio from "../models/Portfolio.js";
import fetchCurrentMarketValue from "../utils/fetchCurrentMarketValue.js";

async function updatePortfolioPerformance(portfolioId) {
	try {
		const portfolio = await Portfolio.findById(portfolioId);

		if (!portfolio) {
			throw new Error("Portfolio not found");
		}

		let totalValue = 0;

		for (const stock of portfolio.stocks) {
			const currentValue = await fetchCurrentMarketValue(
				stock.stockSymbol
			);
			if (currentValue !== null) {
				stock.currentValue = currentValue;
				totalValue += currentValue * stock.quantity;
			}
		}

		portfolio.performance.push({ value: totalValue, date: new Date() });
		portfolio.updatedAt = Date.now();

		await portfolio.save();

		return portfolio;
	} catch (error) {
		console.error(`Failed to update portfolio ${portfolioId}:`, error);
		throw error;
	}
}

export default updatePortfolioPerformance;
