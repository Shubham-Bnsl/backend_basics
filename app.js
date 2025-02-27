import express from "express"

const app = express();

app.get("/",(req,res)=>{
    res.send("Home page bhaiii")
})

export default app
