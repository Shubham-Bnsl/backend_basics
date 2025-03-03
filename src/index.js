
import 'dotenv/config'
import app from './app.js'
import connectDB from './db/index.js'

app.listen(process.env.PORT,()=>{
    console.log(`Server is running http://localhost:${process.env.PORT}/`)
})
connectDB() 