import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "./config/email.js";
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
  },
  status:{
    type:String,
    enum:["Pending","Approved","Rejected"],
    default:"Pending"
  }
});

const sendEmail = async (to, subject, text) => {
  try {

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: to,
      subject: subject,
      text: text,
    });

    console.log(" Email Sent Successfully");

    return true;

  } catch (error) {

    console.log("Email Error:", error.message);

    return false;

  }
};

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

if (farmer.status !== "Approved") {
    return res.json({
        success:false,
        message: `Your account is currently ${farmer.status || "Pending"}. You can only log in after admin approval.`
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


router.put("/status/:id", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        success:false,
        message:"Invalid status"
      });
    }

    const farmer = await Farmer.findById(req.params.id);
    if(!farmer){

      return res.status(404).json({
        success:false,
        message:"Farmer not found"
      });
    }
    farmer.status = status;
    await farmer.save();

    let subject;
    let text;

    if(status === "Approved"){
      subject =
      "Farmer Account Approved - Organic Fruits & Vegetables Ordering System";

      text =
      `Dear ${farmer.name},
      Your farmer account has been approved by the Administrator.
      You can now login and manage your products.
      
      Registered Email:
      ${farmer.email}
      Thank you.
      Elan Harvest Administrator`;
    }
    else{

      subject =
      "Farmer Account Rejected - Organic Fruits & Vegetables Ordering System";

      text =
      `Dear ${farmer.name},
      Thank you for your interest in joining Elan Harvest.
      We regret to inform you that your farmer account application has not been approved by the Administrator at this time.
      If you need further information, please contact our support team.
      Tank you for your understanding.
      Best Regards,
      Elan Harvest Team`;
    }

    const emailSent = await sendEmail(
      farmer.email,
      subject,
      text
    );

    if(emailSent){
      return res.json({
        success:true,
        message:
        status==="Approved"
        ?
        "Farmer Approved & Email Sent"
        :
        "Farmer Rejected & Email Sent",
        farmer
      });
    }
    else{
      return res.json({
        success:false,
        message:
        "Status Updated but Email Failed",
        farmer
      });
    }
  }

  catch(error){
    res.status(500).json({
      success:false,
      message:error.message
    });

  }

});

export default router;