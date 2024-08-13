import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    stocks: [
      {
        stockSymbol: { type: String, required: true },
        price:{ type: String, required:true},
        marketCap:{ type: String, required:true },
        change:{ type: String, required: true },
        changePercentage:{ type: String, required: true },
        addedAt: { type: Date, default: Date.now },
      },
    ],
  });
  
  const Watchlist = mongoose.model('Watchlist', watchlistSchema);
export default Watchlist;