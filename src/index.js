
import 'dotenv/config'
import app from './app.js'
import connectDB from './db/index.js'

const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is running http://localhost:${process.env.PORT}/`)
})

server.on("error",(err)=>{
    console.log("Server Error "+ err);
    // throw err;
    process.exit(1)
})


connectDB() 