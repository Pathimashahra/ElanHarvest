import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import Stripe from "stripe";

import productRoutes from "./product.js";
import userRoutes from "./user.js";
import cartRoutes from "./cart.js";
import orderRoutes from "./order.js";
import farmerRoutes from "./farmer.js";
import paymentRoutes from "./payment.js";


const app = express();
const port = process.env.PORT || 4000;
console.log("Stripe Key:", process.env.STRIPE_SECRET_KEY);
export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY
);
connectDB();
console.log(
  "STRIPE KEY:",
  process.env.STRIPE_SECRET_KEY
);

app.use(cors());
app.use(express.json());
app.use("/api/products",productRoutes);
app.use("/api/users",userRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/farmers",farmerRoutes);
app.use("/api/payment",paymentRoutes);

app.get("/",(req,res)=>{
  res.send("API Working");
});


if(process.env.NODE_ENV !== "production"){
  app.listen(port,()=>{
    console.log(`Server running on ${port}`);
  });
}

export default app;