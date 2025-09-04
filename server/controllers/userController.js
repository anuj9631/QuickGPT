//API for user reg

import User from "../models/user.js";
import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs";

// generate JWT

const generateToken =(id) =>{
  return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '30d'})
}




export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.json({ succes: false, message: "User alreday exists" });
    }

    const user = await User.create({ name, email, password });

    const token = generateToken(user-_id)
    res.json({success: true, token})
  } catch (error) {
    return res.json({success: false, message: error.message})
  }
}


// API login user


export const loginUser = async (req, res) => {
   const { email, password } = req.body;

   try {
     const userExists = await User.findOne({ email });
     if (user){
         const isMatch = await bcrypt.compare(password, user.password)
         if(isMatch){
            const token = generateToken(user._id);
            return res.json({success: true, token})
         }
      }
      return res.json({success: false, message: "Invalid email or Password"})
   } catch (error) {
     return res.json({success: false, message: error.message})
   }
}

// API to get user date 


export const getUser = async (req, res) => {
try {
  const user = req.user;
  return res. json({success: true, user})
} catch (error) {
   return res.json({success: false, message: error.message})
}
}