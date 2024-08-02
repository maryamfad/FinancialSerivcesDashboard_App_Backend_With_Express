import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stockSymbol: { type: String, required: true },
  orderType: { type: String, enum: ['buy', 'sell'], required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'executed', 'canceled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  executedAt: { type: Date }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;