import mongoose from "mongoose";

const connectDB = async()=>{

 try{

   await mongoose.connect(
     process.env.MONGODB_URI,
     {
       serverSelectionTimeoutMS:10000
     }
   );

   console.log(
     "MongoDB connection Successful"
   );

 }
 catch(error){

   console.log(
     "MongoDB ERROR:",
     error.message
   );
 }
};

export default connectDB;