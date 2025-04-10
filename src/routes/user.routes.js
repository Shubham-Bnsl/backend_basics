import { Router } from "express";
import { loginUser, logOutUser, refreshAccessToken, registerUser, updateUserAvatar } from "../controllers/user.controller.js";
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
    .post("/updateAvatar",jwtVerfiy,upload.single('avatar'),updateUserAvatar);

export default router;