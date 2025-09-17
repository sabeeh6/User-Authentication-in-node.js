// server.js
import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import { setupGoogleStrategy } from "./config/passport.js";

dotenv.config();

const app = express();
setupGoogleStrategy()

// Middleware
app.use(express.json());

// Express session (required for Passport)
app.use(session({
  secret: process.env.SESSION_SECRET || "mysecret",
  resave: false,
  saveUninitialized: false,
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes);

// DB + Server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database Connected 😎");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port`);
    });
  })
  .catch(err => console.log(err));
