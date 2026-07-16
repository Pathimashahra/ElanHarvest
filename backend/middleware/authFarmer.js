import jwt from "jsonwebtoken";
import farmerModel from "../models/farmerModel.js";

const protectFarmer = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.json({ success: false, message: "No token" });
    }
    const realToken = token.split(" ")[1];
    const decoded = jwt.verify(realToken, process.env.JWT_SECRET);
    req.farmer = await farmerModel.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    res.json({ success: false, message: "Invalid token" });
  }
};

export default protectFarmer;