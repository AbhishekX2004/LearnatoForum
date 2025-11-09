import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

//  Google OAuth Strategy 
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
          return done(null, existingUser); // User found
        }
        
        // New user, create them WITHOUT a role
        const newUser = new User({
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
        });
        
        await newUser.save();
        done(null, newUser); // Pass the new, partial user on
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// JWT Token Generation
export const generateToken = (user, expiresIn = '7d') => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role, 
      displayName: user.displayName,
      avatar: user.avatar,
    },
    process.env.JWT_SECRET,
    { expiresIn } 
  );
};