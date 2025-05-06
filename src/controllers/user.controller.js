import { User } from "../models/video/user.model.js";
import uploadOnCLoudinary from "../utility/cloudinary.js";
import errorHandler from "../utility/errorHandler.js";
import jwt from "jsonwebtoken";

const generateAccessTokenAndRefreshToken = async (user) => {
    try {
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        return { accessToken, refreshToken };
    } catch (error) {
        next(errorHandler(500, "something went wron while generating access and refresh token"))
    }
}

export const registerUser = async (req, res, next) => {

    //get users details from frontend
    //validation
    //check if already exist or not: username ,email
    //check for images and avatar
    //upload them to cloudinary
    //create user object - creation entry in db
    // remove psswd and refresh token
    // chck for user creation
    //return response


    const { username, fullname, email, password } = req.body

    if (fullname === "") {
        return next(errorHandler(400, "Please write your fullname"));
    }

    const existenceUser = await User.findOne({ email })

    if (existenceUser) {
        return next(errorHandler(400, "User is already exist"))
    }
    // console.log("Got User ",existenceUser);

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // console.log(req.files);
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        return res.status(400).json({
            message: "please provide avatar image",
        })
    }

    const avatar = await uploadOnCLoudinary(avatarLocalPath)
    const coverImage = await uploadOnCLoudinary(coverImageLocalPath)

    if (!avatar) {
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

    if (!newUser) {
        return res.status(400).json({
            message: "new user not Created"
        })
    }


    res.status(201).json({
        message: "User registered Successfully",
        data: newUser,
        success: true

    })
}

export const loginUser = async (req, res, next) => {
    // req body ->data
    //username or email
    //find the user
    //password check 
    //access refresh token
    // send cookies 
    //response


    const { email, password, username } = req.body

    if (!email || !password) {
        return next(errorHandler(400, "email or password is missing"))
    }


    const user = await User.findOne({ email: email });

    if (!user) {
        return next(errorHandler(400, "User not registered Please signup"))
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        return next(errorHandler(400, "invalid User Credentials"))
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user)
    user.refreshToken = refreshToken;

    await user.save()


    return res.status(200)
        .cookie("accessToken", accessToken, { httpOnly: true, secure: true })
        .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true })
        .json({
            message: "user is logged in Successfully",
            user: user,

        })

}

export const logOutUser = async (req, res) => {


    try {
        const user = req.user;

        user.refreshToken = null;

        await user.save();

        res.status(200)
            .clearCookie("accessToken")
            .clearCookie("refreshToken")
            .json({
                message: "user is deleted Successfully",

            })

    } catch (error) {
        return error;
    }


}


export const refreshAccessToken = async (req, res, next) => {
    const incomingRefreshToken = req.cookies.refreshToken;

    if (!incomingRefreshToken) {
        return next(errorHandler(401, "unauthorized request"))
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN)

        if (!decodedToken) {
            return next(errorHandler(401, "unauthorized User"))
        }

        console.log(decodedToken)

        const { _id } = decodedToken
        const user = await User.findById(_id);

        console.log(user)
        if (!user) {
            return next(errorHandler(401, "invalid refresh token"))
        }

        if (incomingRefreshToken !== user.refreshToken) {
            return next(errorHandler(401, "refresh token is expired or used"))
        }


        const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user)


        return res.status(200)
            .cookie("accessToken", accessToken, { secure: true, httpOnly: true })
            .cookie("refreshToken", refreshToken, { secure: true, httpOnly: true }).
            json({
                message: " Access Token is Generated and New Refresh Token is Generated",
                accessToken,
                refreshToken: refreshToken
            })



    } catch (error) {
        return next(errorHandler(401, "Invalid hi refreshToken"));
    }

}

export const changeCurrentPassword = async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        next(errorHandler(400, "invalid Old Password"))
    }


    user.password = newPassword

    await user.save({ validateBeforeSave: false });

    return res.status(200).josn({
        message: "Password Changed Successfully"
    })

}



export const getUser = async (req, res, next) => {
    const user = req.user;

    if (!user) {
        return next(errorHandler(400, "User Not Found"))
    }

    return res.status(200).json({
        message: "Current User Fetched Successfully",
        user,
    })
}

export const updateAccountDetails = async (req, res, next) => {

    const { fullname, email } = req.body

    if (!fullname || !email) {
        return next(errorHandler(400, "All fields are required"))
    }

    const updateUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname: fullname,
                email: email
            }
        },
        { new: true }
    ).select("-password ")

    res.status(200)
        .json({
            mesage: "account details are updated",
            updateUser
        })
}

export const updateUserAvatar = async (req, res, next) => {

    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        return next(errorHandler(400, "Avatar file is missing"))
    }

    const avatar = await uploadOnCLoudinary(avatarLocalPath);

    if (!avatar.url) {
        return next(errorHandler(400, "error while uploading avatar"))
    }

    const UpdateAvatar = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select("-password")


    return res.status(200)
        .json({
            mesage: "Avatar image is updated",
            UpdateAvatar
        })
}


export const getUserChannelProfile = async (req, res) => {
    const { username } = req.params;

    if (!username?.trim()) {
        return next(errorHandler(400, "username is missing"));
    }

    const channel = await User.aggregate(
        [
            {
                $match: {
                    username: username?.toLowerCase()
                }
            },
            {
                $lookup: {
                    from: "subscriptions",
                    localField: "_id",
                    foreignField: "channel",
                    as: "subscribers"
                }
            },
            {
                $lookup: {
                    from: "subscriptions",
                    localField: "_id",
                    foreignField: "subscriber",
                    as: "subscribedTo"
                }
            },
            {
                $addFields: {
                    subscribersCount: {
                        $size: "$subscribers"
                    },

                    channelSubscribedCount: {
                        $size: "$subscribedTo"
                    },
                    isSubscribed: {
                        $cond: {
                            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                            then: true,
                            else: false
                        }
                    }
                }
            },
            {
                $project: {
                    fullname: 1,
                    username: 1,
                    subscribersCount: 1,
                    channelSubscribedCount: 1,
                    isSubscribed: 1,
                    avatar: 1,
                    coverImage: 1,
                    email: 1

                }
            }
        ]
    )

    if (!channel?.length) {
        return next(errorHandler(404, "channel doesn't exists"))
    }

    return res
        .status(200)
        .json({
            channelDetails: channel[0],
            message: "User channel fetched SuccessFully",
        })
}

export const getWatchHistory = async (req, res, next) => {

    const user = await User.aggregate(
        [
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(req.user._id)
                }
            },
            {
                $lookup: {
                    from: "videos",
                    localField: "watchHistory",
                    foreignField: "_id",
                    as: "watchHistory",
                    pipeline: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "owner",
                                foreignField: "_id",
                                as: "owner",
                                pipeline: [

                                    {
                                        $project: {
                                            fullname: 1,
                                            username: 1,
                                            avatar: 1

                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        ]
    )

    return res
    .status(200)
    .json({
        message:"watchHistory fetched Sucessfully",
        data:user[0].watchHistory
    })

}