import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../model/userModel.js";

export const setupGoogleStrategy = () => {
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
          console.log("TOKEN" , accessToken);          
          if (!user) {
            user = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails?.[0]?.value,
              photo: profile.photos?.[0]?.value,
              tokens: { accessToken, refreshToken }
            });
          }

          done(null, user); // Sirf user object pass karo
        } catch (err) {
          done(err, null);
        }
      }
    )
  );

  // Serialize user (session mein store karne ke liye)
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // Deserialize user (session se retrieve karne ke liye)
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};