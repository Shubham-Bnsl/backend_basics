import { User } from "../models/video/user.model.js";
import uploadOnCLoudinary from "../utility/cloudinary.js";

export const registerUser = async (req,res) => {
        
     //get users details from frontend
     //validation
     //check if already exist or not: username ,email
     //check for images and avatar
     //upload them to cloudinary
     //create user object - creation entry in db
     // remove psswd and refresh token
     // chck for user creation
     //return response

    const {username,email,fullname,password} = req.body
    console.log(email,password);
    
    if( fullname === "" ){
       return res.status(400).json({
            message:"please write your full name"
        })
    }

    const existenceUser = await User.findOne({email})

    if(existenceUser){
        return res.status(400).json({
            message:"User is already exist",
            result:false
        })
    }

    console.log("Got User ",existenceUser);

    const avatarLocalPath = req.files?.avatar[0]?.path;
    console.log(req.files);
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        return res.status(400).json({
                message:"please provide avatar image",
        })
    }

    const avatar = await uploadOnCLoudinary(avatarLocalPath)
    const coverImage = await uploadOnCLoudinary(coverImageLocalPath)

    if(!avatar){
        return res.status(400).json({
            message: "avatar url is not present"
        })
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase() 
    })

    const newUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if(!newUser){
        return res.status(400).json({
            message:"new user not Created"
        })
    }


    res.status(201).json({
            message:"User registered Successfully",
            data:newUser,
            success:true

        })    
}


