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


const app = express();

app.use(
  cors({
    origin:[
      "https://elan-harvest-system.vercel.app",
      "http://localhost:5173"
    ],
    credentials:true
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended:true
  })
);

const port = process.env.PORT || 4000;


const startServer = async()=>{

  await connectDB();

  if(process.env.NODE_ENV !== "production"){

    app.listen(port,()=>{
      console.log(
        `Server Started ${port}`
      );
    });

  }

};
app.get("/dbtest",(req,res)=>{

 res.json({
   readyState: mongoose.connection.readyState
 });

});

startServer();
export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY
);

console.log(
  "STRIPE KEY LOADED"
);

app.get("/test",(req,res)=>{
  res.send("TEST OK");
});

console.log("Loading Product Route");

app.use("/api/products",productRoutes);
app.use("/api/users",userRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/farmers",farmerRoutes);
app.use("/api/payment",paymentRoutes);
app.get("/",(req,res)=>{
  res.send("API Working");
});

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
  const port = process.env.PORT || 4000;
  app.listen(port,()=>{
    console.log(
      `Server Started on Port ${port}`
    );
  });
}


export default app;