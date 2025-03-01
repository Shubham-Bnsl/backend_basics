import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({

    productId:{
        type:mongoose.Schema.Types.ObjectID,
        ref:"Product"
    },

    quantity:{
        type:Number,
        required: true
    }

})


const orderSchema = new mongoose.Schema({

    orderPrice:{
        type:Number,
        required:true
    },
    Customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    orderItems:{
        type: [orderItemSchema],
        required:true
    },
    address:{
        type:String,
        required:true
    }, 
    status:{
        type:String,
        enum:["PENDING","CANCELLED","DELIVERED"],
        default:"PENDING"
    }  


},{timstamps:true})

export const Order = mongoose.model("Order",orderSchema)