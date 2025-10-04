// services/biometricService.js
import bcrypt from "bcrypt";
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




// Face descriptor ko hash karna (security)
export const hashFaceDescriptor = async (descriptor) => {
  try {
    const descriptorString = JSON.stringify(descriptor);
    return await bcrypt.hash(descriptorString, 10);
  } catch (error) {
    throw new Error("Face hashing failed");
  }
};

// Cosine similarity calculate karna (face matching)
export const calculateSimilarity = (desc1, desc2) => {
  if (!desc1 || !desc2 || desc1.length !== desc2.length) {
    return 0;
  }

  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;

  for (let i = 0; i < desc1.length; i++) {
    dotProduct += desc1[i] * desc2[i];
    mag1 += desc1[i] * desc1[i];
    mag2 += desc2[i] * desc2[i];
  }

  const magnitude = Math.sqrt(mag1) * Math.sqrt(mag2);
  return magnitude === 0 ? 0 : dotProduct / magnitude;
};

// Fingerprint hash karna
export const hashFingerprint = async (fingerprintData) => {
  try {
    return await bcrypt.hash(fingerprintData, 12);
  } catch (error) {
    throw new Error("Fingerprint hashing failed");
  }
};

// Fingerprint verify karna
export const verifyFingerprint = async (inputData, storedHash) => {
  try {
    return await bcrypt.compare(inputData, storedHash);
  } catch (error) {
    return false;
  }
};