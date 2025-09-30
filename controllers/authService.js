import jwt from "jsonwebtoken";

export const createToken = (userId)=>{
if (!process.env.JWT_SECRET) {
        throw new error("Private Key is missing")
    }    
    try {
        return jwt.sign({id : userId} ,process.env.JWT_SECRET , {expiresIn : "1d"} )
    } catch (error) {
        console.error("Error while creating loginToken" , error.message);
        return null
    }
}
