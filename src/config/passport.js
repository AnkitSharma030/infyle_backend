import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import Vendor from "../models/Vendor.js";
import dotenv from "dotenv";

dotenv.config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/api/vendor/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if vendor exists
                let vendor = await Vendor.findOne({ email: profile.emails[0].value });

                if (vendor) {
                    // If vendor exists but provider is different (e.g. local), we might want to link or just return user
                    // For simplicity, we stick to the existing vendor
                    return done(null, vendor);
                }

                // Create new vendor
                vendor = await Vendor.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: "", // No password for OAuth users
                    phone: "0000000000", // Placeholder or ask user later
                    oauthProvider: "google",
                    role: "vendor",
                });

                return done(null, vendor);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

export default passport;
