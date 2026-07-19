import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./config/cloudinary.js";

const router = express.Router();


// ================= CLOUDINARY =================

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
    fileSize:10 * 1024 * 1024
  }
});



// ================= SCHEMA =================

const productSchema = new mongoose.Schema(
{
  _id: {
    type: String,
    default: () =>
      "pr" + Date.now() + Math.floor(Math.random() * 10000)
  },

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
}
);


const Product =
mongoose.models.Product ||
mongoose.model(
"Product",
productSchema
);


// ================= GET =================

router.get("/",async(req,res)=>{

try{

const products = await Product.find();

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




// ================= POST =================


router.post(
"/",
upload.single("image"),
async(req,res)=>{


try{


console.log("BODY",req.body);
console.log("FILE",req.file);



if(!req.file){

return res.status(400).json({
success:false,
message:"Image required"
});

}

const productId =
"pr" + Date.now();
const product = new Product({

name:req.body.name,

price:Number(req.body.price),

category:req.body.category,

farmerId:req.body.farmerId,

image:req.file.path

});

console.log("PRODUCT ID:", product._id);


await product.save();


console.log("SAVED");



res.status(201).json({

success:true,
product

});



}
catch(err){

console.log("========== PRODUCT SAVE ERROR ==========");
console.log(err.name);
console.log(err.message);
console.log(err.stack);

res.status(500).json({

success:false,
message:err.message

});

}


});




// ================= FARMER PRODUCTS =================


router.get(
"/farmer/:id",
async(req,res)=>{


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

res.status(500).json({
success:false,
message:err.message
});

}


});




// ================= DELETE =================


router.delete("/:id",
async(req,res)=>{


try{


const result =
await Product.deleteOne({
_id:req.params.id
});


res.json({

success:true,
result

});


}
catch(err){

res.status(500).json({
success:false,
message:err.message
});

}


});



export default router;