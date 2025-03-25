import { Router } from "express";
import { loginUser, logOutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { jwtVerfiy } from "../middlewares/auth.middleware.js";


const router = Router();

router.post("/register", 
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount:1 }]), registerUser)

    .post("/login", loginUser)
    .post("/logout",jwtVerfiy,logOutUser)
    .post("/refreshToken",refreshAccessToken);

export default router;