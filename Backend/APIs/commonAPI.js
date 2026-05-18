import exp from 'express'
import { authenticate } from '../services/authService.js'
import {hash,compare} from 'bcryptjs'
import { UserTypeModel } from '../models/UserModel.js'
import { verifyToken } from '../middlewares/verifyToken.js'
import jwt from 'jsonwebtoken'
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
        sameSite: "none",
        secure: true
    });
    res.status(200).json({message:"Login Success",payload:user})

})

//logout
commonRouter.get('/logout',async(req,res)=>{
     //clear the cookie named token
  res.clearCookie('token',{
    httpOnly:true,
    secure: true,
    sameSite: "none"
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
commonRouter.get("/check-auth", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(200).json({ isAuthenticated: false, message: "No token found", payload: null });
    }

    // Verify and decode token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Check if role is allowed
    const allowedRoles = ["USER", "AUTHOR", "ADMIN"];
    if (!allowedRoles.includes(decodedToken.role)) {
      return res.status(200).json({ isAuthenticated: false, message: "Role not allowed", payload: null });
    }

    res.status(200).json({
      isAuthenticated: true,
      message: "authenticated",
      payload: decodedToken
    });
  } catch (err) {
    res.status(200).json({ isAuthenticated: false, message: "Invalid or expired token", payload: null });
  }
})