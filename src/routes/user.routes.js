import { Router } from "express";
import { changeCurrentPassword, getUser, getUserChannelProfile, getWatchHistory, loginUser, logOutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { jwtVerfiy } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", 
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount:1 }]), registerUser)

    .post("/login", loginUser)
    .post("/logout",jwtVerfiy,logOutUser)
    .post("/refreshToken",refreshAccessToken)
    .post("/change-password",jwtVerfiy,changeCurrentPassword)
    .get("/current-user",jwtVerfiy,getUser)
    .patch("/update-account",jwtVerfiy,updateAccountDetails)
    .patch("/updateAvatar",jwtVerfiy,upload.single('avatar'),updateUserAvatar)
    .get("/c/:username",jwtVerfiy,getUserChannelProfile)
    .get("/watch-history",jwtVerfiy,getWatchHistory)

export default router;