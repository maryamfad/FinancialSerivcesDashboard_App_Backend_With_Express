import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	stocks: [
		{
			stockSymbol: { type: String, required: true },
			price: { type: String },
      name: { type: String},
      exchange: { type: String},
			marketCap: { type: String },
			change: { type: String },
			changesPercentage: { type: String },
			addedAt: { type: Date, default: Date.now },
		},
	],
});

const Watchlist = mongoose.model("Watchlist", watchlistSchema);
export default Watchlist;
