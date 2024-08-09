import cron from "node-cron";
import Portfolio from "../models/Portfolio.js";
import updatePortfolioPerformance from "../utils/updatePortfolioPerformance.js";

cron.schedule("*/5 * * * *", async () => {
	console.log("Cron job executed every 5 minutes");
	try {
		const portfolios = await Portfolio.find();

		for (const portfolio of portfolios) {
			await updatePortfolioPerformance(portfolio._id);
		}

		console.log("All portfolios updated successfully.");
	} catch (error) {
		console.error("Failed to update portfolios:", error);
	}
});
