import express from "express";
import mongoose from "mongoose";
import fs from "fs";
import multer from "multer";

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}
const router = express.Router();

const productSchema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    price: Number,
    image: String,
    category: String,
    farmerId: {
      type: String,
      ref: "Farmer",
      required: true,
    },
  },
  { timestamps: true }
);



productSchema.pre("save", async function () {
  if (this.isNew && !this._id) {
    const Product = mongoose.models.Product;
    const products = await Product.find({}, "_id");
    let maxNum = 0;
    products.forEach((product)=>{
      if(product._id?.startsWith("pr")){
        const num =
          parseInt(product._id.substring(2));
        if(num > maxNum){
          maxNum = num;
        }
      }
    });
    this._id =
      `pr${String(maxNum + 1).padStart(4,"0")}`;
  }
});

const Product =
  mongoose.models.Product ||
  mongoose.model("Product", productSchema);

const storage = multer.diskStorage({
  destination:"uploads/",
  filename:(req,file,cb)=>{
    cb(
      null,
      Date.now()+"-"+file.originalname
    );
  }
});

const upload = multer({
  storage
});

router.post("/", upload.single("image"), async(req,res)=>{
  try{
    const {
      name,
      price,
      category,
      farmerId
    } = req.body;
    if(!req.file){
      return res.status(400).json({
        success:false,
        message:"Image missing"
      });
    }
    const product =
      await Product.create({
        name,
        price,
        category,
        farmerId,
        image:
        `/uploads/${req.file.filename}`
      });

    res.json({
      success:true,
      product
    });

  }catch(err){
    res.status(500).json({
      success:false,
      message:err.message
    });
  }
});

router.get("/",async(req,res)=>{
  try{
    const products =
      await Product.find().populate("farmerId");
    res.json({
      success:true,
      products
    });

  }catch(err){
    res.status(500).json({
      success:false,
      message:err.message
    });
  }
});

router.put("/:id", upload.single("image"), async(req,res)=>{
  try{
    const {
      name,
      price,
      category,
      farmerId
    } = req.body;

    const updateData = {
      name,
      price,
      category,
      farmerId
    };

    if(req.file){
     updateData.image =
     `/uploads/${req.file.filename}`;
    }

    const updated =
      await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        {new:true}
      );

    if(!updated){
      return res.status(404).json({
        success:false,
        message:"Product not found"
      });
    }

    res.json({
      success:true,
      product:updated
    });
  }catch(err){
    res.status(500).json({
      success:false,
      message:err.message
    });
  }
});

router.get("/farmer/:id", async(req,res)=>{
  try{
    const products =
      await Product.find({
        farmerId:req.params.id
      });

    res.json({
      success:true,
      products
    });

  }catch(err){
    res.status(500).json({
      success:false,
      message:err.message
    });
  }
});

router.delete("/:id",async(req,res)=>{
  try{
    await Product.findByIdAndDelete(
      req.params.id
    );
    res.json({
      success:true,
      message:"Deleted"
    });

  }catch(err){
    res.status(500).json({
      success:false,
      message:err.message
    });
  }
});

export default router;