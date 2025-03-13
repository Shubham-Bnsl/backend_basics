
import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET_KEY
});

const uploadOnCLoudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;

        const response = await cloudinary.uploader
        .upload(
            localFilePath,{
                resource_Type:"auto"
            })
        
          console.log("file is uploded on cloudinary"+response.url) 
          
          return response

    } catch (error) {
        fs.unlinkSync(localFilePath) //remove the locally temp saved file as upload operation got failed
        return null;
    }
}

export default uploadOnCLoudinary;