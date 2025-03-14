import mongoose from "mongoose";

import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true

    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,

    },
    fullname: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    coverImage: {
        type: String,
    },
    watchHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video",
        }

    ],

    password: {
        type: String,
        required: [true, 'password is required'],

    },
    refreshToken: {
        type: String
    }




}, { timestamps: true })


userSchema.pre('save', async function (next) {

    if (!this.isModified("password")) return next();

    this.password = bcrypt.hash(this.password, 10);

    next();
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(this.password, password);
}

userSchema.methods.generateAccessToken = function () {

    return jwt.sign(

        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    )

};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id, 
    },
        process.env.REFRESH_TOKEN,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    )

}



export const User = mongoose.model("User", userSchema);