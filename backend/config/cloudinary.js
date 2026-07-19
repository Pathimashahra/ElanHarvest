import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Log configuration (without exposing secrets)
console.log('Cloudinary Config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_NAME,
  has_api_key: !!process.env.CLOUDINARY_API_KEY || !!process.env.CLOUDINARY_KEY,
  has_api_secret: !!process.env.CLOUDINARY_API_SECRET || !!process.env.CLOUDINARY_SECRET
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_SECRET
});

export default cloudinary;