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

router.get("/success", googleSuccess);
router.get("/failure", googleFailure);
router.get("/logout", logoutUser);

export default router;
