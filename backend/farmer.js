import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

const farmerSchema = new mongoose.Schema({
  _id:String,
  name:String,
  email:String,
  password:String,
  phone:String,
  address:String,
  role:{
    type:String,
    default:"farmer"
  }
});

farmerSchema.pre("save",async function(){
    if(this.isNew && !this._id){
        const Farmer =
        mongoose.models.Farmer;
        const farmers =
        await Farmer.find({}, "_id");
        let maxNum = 0;
        
        farmers.forEach((farmer)=>{
            if(farmer._id?.startsWith("fa")){
                const num =
                parseInt(farmer._id.substring(2)
            );
            if(num > maxNum){
                maxNum=num;
            }
        }
    });
    
    this._id =
    `fa${String(maxNum+1).padStart(4,"0")}`;
}
});


const Farmer =
mongoose.models.Farmer ||
mongoose.model(
    "Farmer",farmerSchema
);

const createToken=(id)=>{
    return jwt.sign(
        {id},
        process.env.JWT_SECRET,
        {
            expiresIn:"7d"
        }
    );
};

router.post("/register",async(req,res)=>{
    try{
        const {
            name,
            phone,
            address,
            email,
            password
        }=req.body;


const exists =
await Farmer.findOne(
    {email}
);

if(exists){
    return res.json(
        {
            success:false,
            message:"Farmer already exists"
        }
    );
}

const hashedPassword =
await bcrypt.hash(
    password,
    10
);


const farmer =
await Farmer.create({
    name,
    phone,
    address,
    email,
    password:hashedPassword
});

const token =
createToken(
    farmer._id
);

res.json({
    success:true,
    message:"Successfully Registered",
    token,
    farmer
});
}catch(err){
    res.json({
        success:false,
        message:err.message
    });
}
});


router.post("/login",async(req,res)=>{
    try{
        const {
            email,
            password
        }=req.body;


const farmer =
await Farmer.findOne({
    email
});

if(!farmer){
    return res.json({
        success:false,
        message:"Farmer not found"
    });
}

const match =
await bcrypt.compare(
    password,
    farmer.password
);

if(!match){
    return res.json({
        success:false,
        message:"Invalid credentials"
    });
}

const token =
createToken(
    farmer._id
);

res.json({
    success:true,
    message:"Successfully Logged In",
    token,
    farmer
});
}catch(err){
    res.json({
        success:false,
        message:err.message
    });
}
});


router.get("/profile",async(req,res)=>{
    try{
        const farmerId =req.headers.userid;
        const farmer =await Farmer.findById(
            farmerId
        );
        res.json(farmer);
    }catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        });
    }
});

router.get("/",async(req,res)=>{
    try{
        const farmers =await Farmer.find();
        res.json({
            success:true,
            farmers
        });
}catch(err){
    res.status(500).json({
        success:false,
        message:err.message
    });
}
});


router.delete("/:id", async (req, res) => {
  try {

    const farmer = await Farmer.findOneAndDelete({
      _id: req.params.id,
    });

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found",
      });
    }

    res.json({
      success: true,
      message: "Farmer deleted successfully",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});


export default router;