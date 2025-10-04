// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  googleId: { 
    type: String 
  },
  name: { 
    type: String, 
  },
  email: { 
    type: String,   
  },
  password: { 
    type: String 
  },
  photo: { 
    type: String 
  },
  // Biometric Fields
  faceDescriptor: { 
    type: [Number], // Array of 128/512 numbers
    default: null 
  },
  fingerprintHash: { 
    type: String,
    default: null 
  },
  tokens: {
    accessToken: String,
    refreshToken: String
  }
}, { timestamps: true });

const userAdmin = mongoose.model("User", userSchema);
export default userAdmin;