import dotenv from "dotenv";
dotenv.config();
const env = process.env.NODE_ENV || "development";
const uri_tail = env === "test" ? "-test" : "";


import express from "express";
import swaggerUI from "swagger-ui-express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
import swaggerDocs from "./swagger.js";
import userRoutes from "./routes/users.js";
import { authRoutes, authMiddleware } from "./routes/auth.js";
import tradeRoutes from "./routes/trade.js";
import User from "./models/User.js";

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_DB_URI + uri_tail)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Error with MongoDB Connection", err));

app.use((req, res, next) => {
  if (req.path === "/") {
    return res.redirect("/api-docs");
  }
  next();
});
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/trade", tradeRoutes);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// module.exports = app;
export default app;
