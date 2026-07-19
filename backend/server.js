import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";
import multer from "multer";

import connectDB from "./config/mongodb.js";

import productRoutes from "./product.js";
import userRoutes from "./user.js";
import cartRoutes from "./cart.js";
import orderRoutes from "./order.js";
import farmerRoutes from "./farmer.js";
import paymentRoutes from "./payment.js";


dotenv.config();

const app = express();
const allowedOrigins = [
  "https://elan-harvest-system.vercel.app",
  "http://localhost:5173",
  "http://localhost:4000"
];


app.use(
  cors({
    origin: function(origin, callback){

      if(!origin){
        return callback(null,true);
      }


      if(allowedOrigins.includes(origin)){
        return callback(null,true);
      }


      console.log("Blocked CORS:", origin);

      return callback(null,false);

    },

    credentials:true,

    methods:[
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "OPTIONS"
    ],

    allowedHeaders:[
      "Content-Type",
      "Authorization"
    ]
  })
);

app.use(express.json({
limit:"50mb"
}));

app.use(express.urlencoded({
extended:true,
limit:"50mb"
}));


connectDB();


export const stripe =
new Stripe(
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



app.use((req,res)=>{
res.status(404).json({
success:false,
message:"Route not found"
});
});



app.use((err,req,res,next)=>{

console.log("ERROR:",err);


if(err instanceof multer.MulterError){

return res.status(400).json({
success:false,
message:err.message
});

}


res.status(500).json({
success:false,
message:err.message
});


});



if(process.env.NODE_ENV !== "production"){

app.listen(4000,()=>{
console.log("Server running 4000");
});

}


export default app;