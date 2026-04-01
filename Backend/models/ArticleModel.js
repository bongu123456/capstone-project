import { Schema, model } from "mongoose";

// Comment Schema
const userCommentSchema = new Schema(
{
    user:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    comment:{
        type:String,
        required:true
    }
},
{ timestamps:true }
)

// Article Schema
const articleSchema = new Schema({
    author:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:[true,"Author Id required"]
    },

    title:{
        type:String,
        required:[true,"Title is required"]
    },

    category:{
        type:String,
        required:[true,"Category is required"]
    },

    content:{
        type:String,
        required:[true,"Content is required"]
    },

    comments:[userCommentSchema],

    isArticleActive:{
        type:Boolean,
        default:true
    },

},{
    timestamps:true,
    strict:"throw",
    versionKey:false
})

export const ArticleModel = model('article', articleSchema)