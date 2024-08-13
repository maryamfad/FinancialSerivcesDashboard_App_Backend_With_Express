import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    stocks: [
      {
        stockSymbol: { type: String, required: true },
        price:{ type: String, required:true},
        marketCapacity:{ type: String, required:true },
        change:{ type: String, required: true },
        addedAt: { type: Date, default: Date.now },
      },
    ],
  });
  
  const Watchlist = mongoose.model('Watchlist', watchlistSchema);
export default Watchlist;