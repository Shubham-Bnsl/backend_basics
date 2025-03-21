import { jwt } from "jsonwebtoken";
import errorHandler from "../utility/errorHandler";
import { User } from "../models/video/user.model";

export const jwtVerfiy = async(req,res,next)=>{

    try {
        const token = req.cookies?.accessToken;
    
        if(!token){
            return next(errorHandler(401,"unauthrozied request"))
        }
    
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN)
        const {_id} = decodedToken._id
        const user = await User.findById(_id)
    
        if(!user){
            return next(errorHandler(401,"Invalid Access Token"))
        }
    
        req.user = user;
        next();
    } catch (error) {
        return next(errorHandler(400,"Unauthrozied User"))
    }
}