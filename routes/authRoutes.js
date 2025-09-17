import express from "express";
import passport from "passport";
import { googleSuccess, googleFailure, logoutUser } from "../controllers/authController.js";

const router = express.Router();

// Step 1: Redirect to Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Step 2: Google callback
router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failure" }),
  (req, res) => res.redirect("/auth/success")
);


// Success
router.get("/success", (req, res) => {
  res.json({ message: "Login successful 😎", user: req.user });
});

// Failure
router.get("/failure", (req, res) => {
  res.status(401).json({ message: "Login failed ❌" });
});

// Logout
router.get("/logout", (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.json({ message: "Logged out ✅" });
  });
});

export default router;
