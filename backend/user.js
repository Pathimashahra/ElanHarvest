import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userRouter = express.Router();
const userSchema = new mongoose.Schema({
  _id: String,
  name: String,
  email: String,
  password: String,
  phone: String,
  address: String,
});

userSchema.pre("save", async function () {
  if (this.isNew && !this._id) {
    const User = mongoose.models.User;
    const users = await User.find({}, "_id");
    let maxNum = 0;
    users.forEach((user) => {
      if (user._id?.startsWith("us")) {
        const num = parseInt(user._id.substring(2));
        if (num > maxNum) {
          maxNum = num;
        }
      }
    });
    this._id = `us${String(maxNum + 1).padStart(4, "0")}`;
  }
});

const userModel =
  mongoose.models.User ||
  mongoose.model("User", userSchema);

const createToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET
  );
};

userRouter.post("/register", async (req, res) => {
  try {
    const {
      name,
      phone,
      address,
      email,
      password
    } = req.body;

    const exists = await userModel.findOne({
      email
    });


    if (exists) {
      return res.json({
        success:false,
        message:"User already exists"
      });
    }

    const hashedPassword =
      await bcrypt.hash(password,10);

    const user =
      await userModel.create({
        name,
        phone,
        address,
        email,
        password:hashedPassword
      });

    const token =
      createToken(user._id);

    res.json({
      success:true,
      token,
      user
    });

  } catch(error) {
    console.log(error);
    res.json({
      success:false,
      message:error.message
    });
  }
});

userRouter.post("/login", async(req,res)=>{
  try {
      const {
        email,
        password
    } = req.body;

    const user =
      await userModel.findOne({
        email
      });

    if(!user){
      return res.json({
        success:false,
        message:"User not found"
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if(!isMatch){
      return res.json({
        success:false,
        message:"Invalid credentials"
      });
    }

    const token =
      createToken(user._id);

    res.json({
      success:true,
      token,
      user
    });
  } catch(error){
    console.log(error);
    res.json({
      success:false,
      message:error.message
    });
  }
});

userRouter.get("/", async(req,res)=>{
  try{
    const users =
      await userModel.find();
    res.json({
      success:true,
      users
    });
  }catch(err){
    res.status(500).json({
      success:false,
      message:err.message
    });
  }
});

userRouter.delete("/:id", async (req, res) => {
  try {

    const user = await userModel.findOneAndDelete({
      _id: req.params.id,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default userRouter;