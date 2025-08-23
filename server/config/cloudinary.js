// cloudinary.js
import { v2 as cloudinary } from "cloudinary";

export const cloudinaryConnect = () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    console.log("Cloudinary connected successfully ✅");
  } catch (error) {
    console.error("Cloudinary connection failed ❌", error);
  }
};
