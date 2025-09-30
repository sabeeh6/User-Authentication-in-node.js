import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
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

          if (!user) {
            user = await User.create({
              googleId: profile.id,
              displayName: profile.displayName,
              email: profile.emails?.[0]?.value,
              photo: profile.photos?.[0]?.value,
            });
          }

          // 🔹 JWT Tokens
          const jwtAccessToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
          );

          const jwtRefreshToken = jwt.sign(
            { id: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "7d" }
          );

          // 🔹 Tokens ko directly callback me bhej dete hain
          done(null, {
            ...user.toObject(),
            tokens: {
              accessToken: jwtAccessToken,
              refreshToken: jwtRefreshToken,
            },
          });
        } catch (err) {
          console.error("ERROR", err.message);
          done(err, null);
        }
      }
    )
  );
};
