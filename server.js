const express = require("express");

const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const app = express();
const { swaggerDocs, swaggerUI } = require("./swagger");
const userRoutes = require("./routes/users");
const tradeRoutes = require("./routes/trade");
const User = require("./models/User");

app.use(cors());
app.use(express.json());

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.5td036n.mongodb.net/dashboard`
);

app.use("/users", userRoutes);
app.use("/trade", tradeRoutes);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
