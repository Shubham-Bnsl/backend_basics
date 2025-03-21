import { User } from "../models/video/user.model.js";
import uploadOnCLoudinary from "../utility/cloudinary.js";
import errorHandler from "../utility/errorHandler.js";


const generateAccessTokenAndRefreshToken= async(user)=>{
        try {
            const accessToken = user.generateAccessToken();
            const refreshToken = user.generateRefreshToken();
            
            return {accessToken, refreshToken};
        } catch (error) {
           next(errorHandler(500,"something went wron while generating access and refresh token")) 
        }
}

export const registerUser = async (req,res,next) => {
        
     //get users details from frontend
     //validation
     //check if already exist or not: username ,email
     //check for images and avatar
     //upload them to cloudinary
     //create user object - creation entry in db
     // remove psswd and refresh token
     // chck for user creation
     //return response

     
    const {username,fullname,email,password} = req.body
    
    if(fullname ===""){
        return next(errorHandler(400,"Please write your fullname"));
    }

    const existenceUser = await User.findOne({email})

    if(existenceUser){
        return next(errorHandler(400,"User is already exist"))
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

export const loginUser = async (req,res,next)=>{
        // req body ->data
        //username or email
        //find the user
        //password check 
        //access refresh token
        // send cookies 
        //response


    const {email,password,username} =  req.body

    if(!username || !email || !password){
        return next(errorHandler(400,"username or email orpassword is missing"))
    }
    
    const user = await User.findOne({email: email});

    if(!user){
        return next(errorHandler(400,"User not registered Please signup"))
    }

     const isPasswordValid = await user.isPasswordCorrect(password);
    
     if(!isPasswordValid){
        return next(errorHandler(400,"invalid User Credentials"))
     }

     const {accessToken,refreshToken} = await generateAccessTokenAndRefreshToken(user)
     user.refreshToken = refreshToken;

     await user.save()


     return res.status(200)
     .json({
        message:"user is logged in Successfully",
        user:user,

     })
     .cookie("accessToken",accessToken,{httpOnly:true,secure:true})
     .cookie("refreshToken",refreshToken,{httpOnly:true,secure:true})

} 

export const logOutUser = async(req,res)=>{
      const user = req.user;

      res.status(200)
      .clearCookies("accessToken")
      .clearCookies("refreshToken")
      .json({
            message:"user is deleted Successfully",

      })

      user.refreshToken = null;


}

