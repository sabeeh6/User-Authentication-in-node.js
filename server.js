import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import { setupGoogleStrategy } from "./config/passport.js";
import { connectDb } from "./config/db.js";

dotenv.config();

const app = express();
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
