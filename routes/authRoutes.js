import express from "express";
import passport from "passport";
import { googleSuccess, googleFailure, logoutUser, signUp, userLogin } from "../controllers/authController.js";
import { signInValidationRequest, SignUpValidationRequest } from "../middleware/index.js";

const router = express.Router();



router.post("/signUp" ,[SignUpValidationRequest] ,signUp);
router.post("/signIn" ,[signInValidationRequest] , userLogin );

// Step 1: Redirect to Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Step 2: Google callback
router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failure" }),
  (req, res) => res.redirect("http://localhost:3000/dashboard")
);

router.get("/success", googleSuccess);
router.get("/failure", googleFailure);
router.post("/logout", logoutUser);

export default router;
