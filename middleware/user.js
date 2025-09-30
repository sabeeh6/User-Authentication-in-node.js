import jwt from "jsonwebtoken";
// import { verifyToken } from "../controllers/auth/authService.js";
import userAdmin from "../model/userModel.js";

export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.cookies?.authToken;
    
    if (!token){
        return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }
    
    // console.log("env" , process.env.JWT_PEIVATE_KEY_321);
    const decoded = jwt.verify(token, process.env.JWT_PEIVATE_KEY_321);
    const user = await userAdmin.findById(decoded.id).select("-password");

    if (!user) return res.status(401).json({ success: false, message: "Access denied. User not found." });
    if (["banned", "inactive"].includes(user.status))
      return res.status(403).json({ success: false, message: "Access denied. Account is inactive." });

    req.user = user;
    next();
  } catch (err) {
    console.error("Authentication error:", err.message);
    res.clearCookie("authToken"); // token clear
    return res.status(401).json({ success: false, message: "Access denied. Invalid or expired token." });
  }
};