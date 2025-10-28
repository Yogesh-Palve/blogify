const { Schema, model} = require("mongoose")

const commentSchema = new Schema({
    content : {
        type : String,
        required : true,
    },
    blogId : {
        type : Schema.Types.ObjectId,
        ref : "blog" // it expects the model name 
    },
    createdBy : {
        type : Schema.Types.ObjectId,
        ref : "user"
    }
},{ timestamps : true})

const Comment = model("comment", commentSchema)

module.exports = Comment