import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import { setupGoogleStrategy } from "./config/passport.js";
import { connectDb } from "./config/db.js";
import cors from "cors"

dotenv.config();
const app = express();
// ✅ CORS middleware add karein
app.use(cors({
  origin: 'http://localhost:3000',  // frontend ka URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,                // agar cookies/session bhejni hain
}));


setupGoogleStrategy()
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || "mysecret",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.listen(process.env.PORT, () => {
  console.log(`Server running on port`);
});
connectDb();

app.use("/auth", authRoutes);
