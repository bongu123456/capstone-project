import exp from 'express'
import { authenticate } from '../services/authService.js'
import {hash,compare} from 'bcryptjs'
import { UserTypeModel } from '../models/UserModel.js'
import { verifyToken } from '../middlewares/verifyToken.js'
export const commonRouter=exp.Router()


//login
commonRouter.post("/login",async(req,res)=>{
    //get user cred obj
    let userCred=req.body
    //call authenticate
    let {token,user}= await authenticate(userCred)
    //save token
    res.cookie("token",token,{
        httpOnly:true,
        sameSite:"lax",
        secure:false
    });
    res.status(200).json({message:"Login Success",payload:user})

})

//logout
commonRouter.get('/logout',async(req,res)=>{
     //clear the cookie named token
  res.clearCookie('token',{
    httpOnly:true,
    secure:false,
    sameSite:"lax"
  })
  res.status(200).json({message:"Logout sucesssfull"})
})


//change password
commonRouter.put('/change-password',verifyToken,async(req,res)=>{
  //get current password and new password
  let {email,currentPassword,newPassword}=req.body
  let user=await UserTypeModel.findOne({email:email})
  if(!user){
    res.json({message:"user not found"})
  }
  //check the current password is correct
  let isMatch=await compare(currentPassword,user.password)
  if(!isMatch){
   return res.json({message:"Invalid Old password"})
  }
  //replace  current password with new password
  // hash new password
  const hashedPassword = await hash(newPassword, 12)
  // update password
  user.password = hashedPassword
  await user.save()
  //send res
  res.json({message:"Password changed successfully",payload:user})
})

//Page Refresh 
commonRouter.get("/check-auth",verifyToken("USER","AUTHOR","ADMIN"),(req,res)=>{
  res.status(200).json({
    message:"authenticated",
    payload:req.user
  })
})