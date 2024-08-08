import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PortfolioPerformanceSchema = new Schema({
  date: { type: Date, default: Date.now },
  value: { type: Number, required: true }
});
const StockSchema = new Schema({
  stockSymbol: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});

const PortfolioSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stocks: [StockSchema],
  performance: [PortfolioPerformanceSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update the updatedAt field before saving
PortfolioSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Portfolio = mongoose.model('Portfolio', PortfolioSchema);

export default Portfolio;