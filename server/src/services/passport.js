import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

//  Google OAuth Strategy 
export function initAuth() {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL='/auth/google/callback' } = process.env;
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) throw new Error('Missing Google creds');
  passport.use(new GoogleStrategy({ clientID: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET, callbackURL: GOOGLE_CALLBACK_URL, proxy: true },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = (await User.findOne({ googleId: profile.id })) ||
                     (await new User({ googleId: profile.id, displayName: profile.displayName, email: profile.emails?.[0]?.value, avatar: profile.photos?.[0]?.value }).save());
        done(null, user);
      } catch (e) { done(e); }
    }));
}

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