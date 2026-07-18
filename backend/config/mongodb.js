import mongoose from "mongoose";

const connectDB = async () => {
  try {

    mongoose.connection.on("connected", () => {
      console.log("MongoDB connection Successful");
    });

    await mongoose.connect(process.env.MONGODB_URI);

  } catch (error) {
    console.log("MongoDB Error:", error.message);
  }
};

export default connectDB;