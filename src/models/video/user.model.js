import mongoose from "mongoose";

import bcrypt from "bcrypt"
import jsonwebtoken from 'jsonwebtoken'

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

userSchema.methods.isPasswordCorrect = async function(password){
           return await bcrypt.compare(this.password,password);
}

userSchema.methods.generateAccessToken = function(){};
userSchema.methods.generateRefreshToken = function(){};



export const User = mongoose.model("User", userSchema);