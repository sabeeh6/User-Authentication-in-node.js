import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../model/userModel.js";

export function setupGoogleStrategy() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            user = await User.create({
              googleId: profile.id,
              displayName: profile.displayName,
              email: profile.emails?.[0]?.value,
              photo: profile.photos?.[0]?.value,
            });
          }

          done(null, user);
          console.log("User" , user);
          
        } catch (err) {
            console.error("ERROR",err.message);
            
          done(err, null);
        }
      }
    )
  );
  // ✅ Passport serialize / deserialize
  passport.serializeUser((user, done) => {
      done(null, user.id); // sirf MongoDB ka user._id session me save karte hain
    });
    
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user); // full user object req.user me milega
        } catch (err) {
            done(err, null);
        }
    });
}

