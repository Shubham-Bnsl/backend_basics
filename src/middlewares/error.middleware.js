const errorMiddleware = (err,req,res,next)=>{
       const statusCode =  err.statusCode || 500;
       const message = err.message || "something went Wrong";
       
       return res.status(statusCode).json({
        message:message,
        success:false,
       })
}

export default errorMiddleware
