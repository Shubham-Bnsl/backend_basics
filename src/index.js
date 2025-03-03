
import 'dotenv/config'
import app from './app.js'
import connectDB from './db/index.js'
import cookieParser from 'cookie-parser'
import express, { urlencoded } from "express"

const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is running http://localhost:${process.env.PORT}/`)
})

server.on("error",(err)=>{
    console.log("Server Error "+ err);
    // throw err;
    process.exit(1)
})

app.use(cookieParser())

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded())
app.use(express.static("public"))

connectDB() 