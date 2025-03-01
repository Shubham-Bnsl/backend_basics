import mongoose from "mongoose";

const SubTodoSchema = new mongoose.Schema({

content:{
    type:String,
    required:true,

},
complete:{
    type:boolean,
    default:false
},
createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
}


},{timestamps:true})

export const SubTodo =  mongoose.model("SubTodo",SubTodoSchema)
