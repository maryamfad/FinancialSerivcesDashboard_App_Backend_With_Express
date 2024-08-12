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
cron.schedule("*/30 * * * *", async () => {
	console.log("Cron job executed every 1 minutes");
	try {
		await checkDatabaseConnection();
		const portfolios = await Portfolio.find();
		if (portfolios.length === 0) {
			console.warn("No portfolios found to update.");
			return;
		}
		for (const portfolio of portfolios) {
			try {
				await updatePortfolioPerformance(portfolio._id);
				console.log(`Portfolio ${portfolio._id} updated successfully.`);
			} catch (updateError) {
				console.error(
					`Failed to update portfolio ${portfolio._id}:`,
					updateError
				);
			}
		}
		console.log("portfolio._id", portfolio._id);

		console.log("All portfolios updated successfully.");
	} catch (error) {
		if (error.message.includes("database connection")) {
			console.error(
				"Database connection error. Ensure the database is running and accessible.",
				error
			);
		} else {
			console.error(
				"An error occurred while updating portfolios:",
				error
			);
		}
	}
});
