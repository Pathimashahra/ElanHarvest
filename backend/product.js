import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import {CloudinaryStorage} from "multer-storage-cloudinary";
import cloudinary from "./config/cloudinary.js";

const router = express.Router();
const storage = new CloudinaryStorage({
 cloudinary,
 params:{
    folder:"elan-harvest-products",
    allowed_formats:[
        "jpg",
        "jpeg",
        "png",
        "webp"
    ]
 }

});


const upload = multer({
   storage,
   limits:{
    fileSize:5*1024*1024
 }

});

const productSchema =
new mongoose.Schema({
   _id:String,
   name:{
      type:String,
      required:true
   },
   price:{
      type:Number,
      required:true
   },
   image:{
      type:String,
      required:true
   },
   category:{
      type:String,
      required:true
   },
   farmerId:{
      type:String,
      required:true
   }
},
{
   timestamps:true
});

productSchema.pre(
"save",
async function(){

if(this.isNew && !this._id){
   const Product =
   mongoose.model("Product");
const count =
await Product.countDocuments();


this._id =
"pr"+String(count+1)
.padStart(4,"0");
}
});

const Product =
mongoose.models.Product ||
mongoose.model(
"Product",
productSchema
);

router.get("/test",(req,res)=>{
   res.send("PRODUCT ROUTE WORKING");
});

router.get("/",async(req,res)=>{
   try{
      const products =
      await Product.find();
      res.json({
         success:true,
         products
      });
   }
catch(err){

console.log("GET ERROR:",err);
res.status(500).json({
   success:false,
   message:err.message
});
}
});

router.post("/",upload.single("image"),
async(req,res)=>{
   console.log(
      "BODY:",
      req.body
   );
   
   console.log("FILE:",req.file);
   try{
      if(!req.file){
         return res.status(400).json({
            success:false,
            message:"Image required"
         });
      }

      const product =await Product.create({
         name:req.body.name,
         price:Number(
            req.body.price
         ),
         category:req.body.category,
         farmerId:req.body.farmerId,
         image:req.file.path
   });
   res.status(201).json({
      success:true,
      product
   });
   }
   catch(err){
      console.log("PRODUCT ERROR:",err.message);
      console.log(err.stack);
      res.status(500).json({
         success:false,
         message:err.message
      });
   }
});

router.get("/farmer/:id",async(req,res)=>{
   try{
      const products =
      await Product.find({
         farmerId:req.params.id
      });
      res.json({
         success:true,
         products
      });
   }
   catch(err){
      console.log(err);
      res.status(500).json({
         success:false,
         message:err.message
      });
   }
});
export default router;