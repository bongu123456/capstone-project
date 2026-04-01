import exp from 'express'
import { ArticleModel } from '../models/ArticleModel.js'
import { UserTypeModel } from '../models/UserModel.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { authenticate } from '../services/authService.js';
export const adminRoute=exp.Router()


//Read all articles
adminRoute.get('/articles', async (req, res) => {
    const articles = await ArticleModel.find();
    res.status(200).json({ message: "All articles fetched", payload: articles });
});


//block 
adminRoute.put('/block-user',verifyToken,async(req,res)=>{
    let {userId}=req.body
    let BlockedUser=await UserTypeModel.findById(userId,{isActive:true})
    if(!userId){
        res.status(200).json({message:"UserId not found"})
    }
    await UserTypeModel.findByIdAndUpdate(userId,{
        $set:{isActive:false}
    })
    res.json({message:"User is blocked"})
})

//unblock user role
adminRoute.put('/unblock-user',verifyToken,async(req,res)=>{
let {userId}=req.body
let BlockedUser=await UserTypeModel.findById(userId,{isActive:false})
if(!userId){
    res.status(200).json({message:"UserId not found"})
}
await UserTypeModel.findByIdAndUpdate(userId,{
    $set:{isActive:true}
})
res.json({message:"User is unblocked"})
})
