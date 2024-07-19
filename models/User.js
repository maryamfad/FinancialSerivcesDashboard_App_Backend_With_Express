import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  portfolio: [
    {
      stockSymbol: String,
      quantity: Number,
      purchasePrice: Number,
    },
  ],
  balance: { type: Number, default: 10000 },
});

const User = mongoose.model("User", UserSchema);

// module.exports = User;
export default User;
