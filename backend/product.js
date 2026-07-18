import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./config/cloudinary.js";

const router = express.Router();


const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "elan-harvest-products",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage });


const productSchema = new mongoose.Schema(
  {
    _id: String,
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    farmerId: {
      type: String,
      ref: "Farmer",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


productSchema.pre("save", async function () {
  if (this.isNew && !this._id) {
    const Product = mongoose.model("Product");
    const products = await Product.find({}, "_id");
    let maxNum = 0;
    products.forEach((product)=>{
      if(product._id?.startsWith("pr")){
        const num = parseInt(
          product._id.substring(2)
        );
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



router.post("/",upload.single("image"),async(req,res)=>{
    console.log("PRODUCT BODY:",req.body);
    console.log("PRODUCT FILE:",req.file);
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
          price:Number(price),
          category,
          farmerId,
          image:req.file.path
        });

      res.json({
        success:true,
        product
      });

    }catch(err){
      console.log(
        "PRODUCT ERROR:",
        err
      );

      res.status(500).json({
        success:false,
        message:err.message
      });
    }
  }
);


router.get("/",async(req,res)=>{
    try{
      const products =
        await Product.find()
        .populate("farmerId");

      res.json({
        success:true,
        products
      });

    }catch(err){

      console.log(
        "GET PRODUCT ERROR:",
        err
      );

      res.status(500).json({
        success:false,
        message:err.message
      });
    }
  }
);

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

    }catch(err){
      res.status(500).json({
        success:false,
        message:err.message
      });
    }
  }
);


router.put("/:id",upload.single("image"),async(req,res)=>{
    try{
      const updateData = {
        name:req.body.name,
        price:Number(req.body.price),
        category:req.body.category,
        farmerId:req.body.farmerId
      };

      if(req.file){
        updateData.image =
          req.file.path;
      }

      const updated =
        await Product.findByIdAndUpdate(
          req.params.id,
          updateData,
          {
            new:true
          }
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

      console.log(
        "UPDATE ERROR:",
        err
      );
      res.status(500).json({
        success:false,
        message:err.message
      });
    }
  }
);


router.delete("/:id",async(req,res)=>{
    try{
      await Product.findByIdAndDelete(
        req.params.id
      );
      res.json({
        success:true,
        message:"Product Deleted"
      });
    }catch(err){
      res.status(500).json({
        success:false,
        message:err.message
      });
    }
  }
);

export default router;