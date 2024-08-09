import cron from "node-cron";
import mongoose from "mongoose";
import Portfolio from "../models/Portfolio.js";
import updatePortfolioPerformance from "../utils/updatePortfolioPerformance.js";
function checkDatabaseConnection() {
	if (mongoose.connection.readyState === 1) {
		// 1 means connected
		return Promise.resolve();
	} else {
		return mongoose
			.connect(process.env.MONGO_DB_URI)
			.then(() => console.log("MongoDB connected"))
			.catch((err) =>
				console.error("Error with MongoDB Connection", err)
			);
	}
}
cron.schedule("*/5 * * * *", async () => {
	console.log("Cron job executed every 5 minutes");
	try {
		await checkDatabaseConnection();
		const portfolios = await Portfolio.find();

		for (const portfolio of portfolios) {
			await updatePortfolioPerformance(portfolio._id);
		}

		console.log("All portfolios updated successfully.");
	} catch (error) {
		console.error("Failed to update portfolios:", error);
	}
});
