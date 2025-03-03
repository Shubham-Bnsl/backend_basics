import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";


const connectDB = async()=>{

    try{
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
         
        console.log(`MongoDb is connected Successfully`)
    }
    catch(error){
        console.log(`MongoDb Error ${error}`)
    }
}

export default connectDB;