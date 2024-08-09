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
			try {
				const currentValue = await fetchCurrentMarketValue(
					stock.stockSymbol
				);

				if (currentValue !== null) {
					stock.currentValue = currentValue;
					totalValue += currentValue * stock.quantity;
				} else {
					console.warn(
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
			console.warn(
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
