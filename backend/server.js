import express from "express";
import cors from "cors";
import "dotenv/config";
import Stripe from "stripe";

import connectDB from "./config/mongodb.js";

import productRoutes from "./product.js";
import userRoutes from "./user.js";
import cartRoutes from "./cart.js";
import orderRoutes from "./order.js";
import farmerRoutes from "./farmer.js";
import paymentRoutes from "./payment.js";

import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(
 cors({
   origin:true,
   credentials:true
 })
);


app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(
 cors({
   origin: [
     "http://localhost:5173",
     "https://elan-harvest.vercel.app"
   ],
   methods:["GET","POST","PUT","DELETE"],
   allowedHeaders:["Content-Type"],
   credentials:true
 })
);



connectDB();


export const stripe = new Stripe(
 process.env.STRIPE_SECRET_KEY
);



app.get("/",(req,res)=>{
 res.send("API Working");
});


app.get("/test",(req,res)=>{
 res.send("TEST OK");
});



app.use("/api/products",productRoutes);
app.use("/api/users",userRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/farmers",farmerRoutes);
app.use("/api/payment",paymentRoutes);
app.use((err,req,res,next)=>{
 console.log(
  "GLOBAL ERROR:",
  err
 );
 res.status(500).json({
    success:false,
    message:err.message
 });
});

if(process.env.NODE_ENV !== "production"){

const port =
process.env.PORT || 4000;
app.listen(port,()=>{
 console.log(
  `Server running ${port}`
 );
});
}
app.use((err, req, res, next) => {

 console.log("GLOBAL ERROR:", err);

 res.header(
   "Access-Control-Allow-Origin",
   "*"
 );

 res.status(500).json({
   success:false,
   message:err.message
 });

});
export default app;