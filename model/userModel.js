import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true },
  displayName: { type: String },
  email: { type: String, unique: true },
  photo: { type: String }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
