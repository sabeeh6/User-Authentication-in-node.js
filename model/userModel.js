import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  googleId: { type: String, },
  name: { type: String },
  email: { type: String, unique: true },
  password:{type:String},
  photo: { type: String }
}, { timestamps: true });

const userAdmin = mongoose.model("User", userSchema);
export default userAdmin;
