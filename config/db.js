import mongoose from "mongoose";

export const connectDb = ()=>{
    mongoose.connect(process.env.MONGO_URI).then(
        console.log("Database Connected 😎")        
    ).catch((err)=>{
        console.error("ERROR" , err);
    })
}
