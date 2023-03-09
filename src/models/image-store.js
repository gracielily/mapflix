import * as cloudinary from "cloudinary";
import { writeFileSync } from "fs";
import dotenv from "dotenv";

dotenv.config();

const CLOUDINARY_CREDENTIALS = {
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
};
cloudinary.config(CLOUDINARY_CREDENTIALS);

export const imageStore = {

  getAllImages: async function() {
    const result = await cloudinary.v2.api.resources();
    return result.resources;
  },

  uploadImage: async function(imagefile) {
    writeFileSync("./public/tmp.img", imagefile);
    const response = await cloudinary.v2.uploader.upload("./public/tmp.img");
    return response.url;
  },

  deleteImage: async function(img) {
    await cloudinary.v2.uploader.destroy(img, {});
  }
};
