import express from 'express';
import passport from 'passport';
import mongoose from 'mongoose';
import { generateToken } from '../services/passport.js';
import { authenticateToken } from '../services/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();
const FRONTEND_URL = '';
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Initiate Google Login
router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false,
    })
);

// Google Callback
router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${FRONTEND_URL}/login` }),
    (req, res) => {
        // req.user is now the partial user from Passport

        if (!req.user.role) {
            // NEW USER: Send temporary token, redirect to /select-role

            //  Generate a short-lived 15-minute token
            const tempToken = generateToken(req.user, '15m');

            // Set the 15-minute cookie
            res.cookie('jwt', tempToken, {
                ...COOKIE_OPTIONS,
                maxAge: 15 * 60 * 1000, // 15 minutes
            });

            // Redirect to the frontend role selection page
            res.redirect(`/select-role`);

        } else {
            // RETURNING USER: Send final token, redirect to main app 

            // Generate a final 7-day token
            const token = generateToken(req.user, '7d');

            // Set the 7-day cookie
            res.cookie('jwt', token, COOKIE_OPTIONS);

            // Redirect to the main frontend app
            res.redirect('/');
        }
    }
);

// Set Role Endpoint
router.post(
    '/set-role',
    authenticateToken,
    async (req, res) => {
        const { role } = req.body;

        if (!['learner', 'instructor'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        try {
            const user = await User.findById(req.user.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            if (user.role) {
                return res.status(400).json({ message: 'Role is already set' });
            }

            // Update the user's role
            user.role = role;
            await user.save();

            // Generate the FINAL 7-day token
            const finalToken = generateToken(user, '7d');

            // Set the final cookie, overwriting the temporary one
            res.cookie('jwt', finalToken, COOKIE_OPTIONS);

            // Send back the full user object
            res.status(200).json({
                message: 'Role set successfully.',
                user: {
                    _id: user._id,
                    displayName: user.displayName,
                    avatar: user.avatar,
                    role: user.role,
                },
            });

        } catch (err) {
            res.status(500).json({ message: 'Server error', error: err.message });
        }
    }
);

// Get Current User
router.get(
  '/me',
  authenticateToken,
  async (req, res) => {
    // req.user is just the token payload. send the full user.
    try {
      const user = await User.findById(req.user.userId).select('-googleId');
      
      if (!user) {
        // This would happen if the user was deleted but the token is still valid
        return res.status(404).json({ message: 'User not found' });
      }

      // The frontend will check if (user.role) exists.
      res.status(200).json(user);

    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Logout
router.post('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.status(200).json({ message: 'Logged out successfully' });
});

export default router;