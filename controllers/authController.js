import { clearCookies, setCookies } from "../middleware/cookies.js";
import userAdmin from "../model/userModel.js";
import { createToken } from "./authService.js";
import bcrypt from "bcrypt"


export const googleSuccess = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication failed" });
  }
console.log("USER" , req.user);

  const { tokens, _id, name, email, photo } = req.user;
// console.log("Token also" , accessToken);

  res.status(200).json({
    message: "Login successful",
    user: {
      id: _id,
      name,
      email,
      photo,
    },
    Token:tokens,
    Test:"Hii"
  });
};


export const googleFailure = (req, res) => {
  res.status(401).json({ message: " Google Login failed ❌" });
};


export const signUp = async(req,res)=>{
  try {
        const { email , password } = req.body;
        const userExist = await userAdmin.findOne({email});
        // console.log(userExist);
        
        if (userExist) {
            return  res.status(409).json({message:"User already exist"})
        }

        const hash = await bcrypt.hash(password , 10);
        const newUser = {...req.body , password: hash}
        
        // const userId = userExist._id
        // console.log("userId",userId);
        const loginToken = createToken(newUser._id);
        console.log("Login Token",loginToken);
        const set =setCookies(res , loginToken)
        if (!set) {
          return res.status(401).json({message:"Can't set cookies"})
        }
        await userAdmin.create(newUser);
        
        
        return res.status(200).json({
            message:"User Sign Up Successfully (❁´◡`❁)",
            Data:newUser,
            Token:loginToken
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
        console.log("HERE");
        // console.log(password , validatePassword);
        
        if (!validatePassword) {
            return res.status(409).json({message:"Invalid credentials"});
        }
        
        const userId = userExist._id
        console.log(userId);
        const loginToken = createToken(userId);
        // console.log("Login Token",loginToken);
        const set =setCookies(res , loginToken)
         if (!set) {
            return res.status(401).json({message:"Can't set cookies"})
         }
        

        return res.status(200).json({
            message:"Login Successfully",
            Data:userExist,
            Token:loginToken
        });
    } catch (error) {
        console.error("Login Failed" , error);
        return res.status(500).json({message:"Internal Server Error"})
    }
}

  export const logoutUser = (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ success: false, message: "Logout failed", error: err });
    console.log("Cookies clear");
    clearCookies(res);
    req.session.destroy(() => {
      res.clearCookie("connect.sid", { path: "/" }); // ✅ cookie clear

      // ✅ Sirf JSON response bhejna hai
      res.status(200).json({
        success: true,
        message: "User logged out successfully ✅"
      });
    });
  });
};

