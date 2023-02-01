import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoute from "./routes/auth.js";
import userRoute from "./routes/user.js";
import router from "./routes/user.js";
import productRoute from "./routes/product.js";
import cartRoute from "./routes/cart.js";
import orderRoute from "./routes/order.js";

const app = express();
dotenv.config();
const port = process.env.PORT || 5000;
app.use(express.json());
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB server successfully!"))
  .catch((err) => console.error("Error to connect with database server", err));

app.use("/api/", router);
app.use("/api/update", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.get("/", (req, res) => {
  res.status(200).json({ staatus: true, message: "hello form API server" });
});
app.listen(port, () => {
  console.log(`Background Server is running http://localhost:${port}`);
});
