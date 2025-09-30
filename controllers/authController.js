import userAdmin from "../model/userModel.js";
import { createToken } from "./authService.js";
import bcrypt from "bcrypt"


export const googleSuccess = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication failed" });
  }

  const { tokens, _id, displayName, email, photo } = req.user;

  res.status(200).json({
    message: "Login successful",
    user: {
      id: _id,
      displayName,
      email,
      photo,
    },
    tokens, // access & refresh tokens
  });
};


export const googleFailure = (req, res) => {
  res.status(401).json({ message: " Google Login failed ❌" });
};

export const logoutUser = (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.json({ message: "Logged out ✅" });
  });
};

export const signUp = async(req,res)=>{
    try {
        const { email , password } = req.body;
        const userExist = await userAdmin.findOne({email});
        if (userExist) {
            return  res.status(409).json({message:"User already exist"})
        }

        const hash = await bcrypt.hash(password , 10);
        const newUser = {...req.body , password: hash}
        await userAdmin.create(newUser);
        
        return res.status(200).json({
            message:"User Sign Up Successfully (❁´◡`❁)",
            Data:newUser
        })        
    } catch (error) {
        console.error("Registration Failed" , error);
        return res.status(500).json({message:"Internal Server Error" , error: error.message})
    }
}

export const userLogin = async(req,res)=>{
    try {
        const { email , password} = req.body
        const userExist = await userAdmin.findOne({email})
        if (!userExist) {
            return res.status(409).json({message:"Invalid credentials"});
        }

        const validatePassword = await bcrypt.compare(password , userExist.password);
        console.log(password , validatePassword);
        
        if (!validatePassword) {
            return res.status(409).json({message:"Invalid credentials"});
        }
        
        // const userId = userExist._id
        // console.log(userId);
        const loginToken = createToken(userId);
        console.log("Login Token",loginToken);
        

        return res.status(200).json({
            message:"Login Successfully",
            Data:userExist,
            Token:loginToken
        });
    } catch (error) {
        console.error("Login Failed");
        return res.status(500).json({message:"Internal Server Error" ,error:error.message})
    }
}
