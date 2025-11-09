import express from 'express';
import mongoose from 'mongoose';
import { authenticateToken } from '../services/authMiddleware.js';
import User from '../models/User.js';
import Post from '../models/Post.js';

const router = express.Router();
const POSTS_PER_PAGE = 10;

// Update User Profile 
// PATCH /api/users/me
router.patch('/me', authenticateToken, async (req, res) => {
    const { displayName } = req.body;

    if (!displayName || displayName.trim().length === 0) {
        return res.status(400).json({ message: 'Display name cannot be empty' });
    }

    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.displayName = displayName.trim();
        await user.save();

        res.status(200).json({
            _id: user._id,
            displayName: user.displayName,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});


// Get All Posts by a Specific User
// GET /api/users/:userId/posts?cursor=...
router.get('/:userId/posts', async (req, res) => {
    const { userId } = req.params;
    const { cursor } = req.query;

    try {
        // Check if user exists
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const query = [
            // Match posts by the author
            { $match: { author: new mongoose.Types.ObjectId(userId) } },

            // Handle cursor pagination
            // If a cursor is provided, find posts older than it
            ...(cursor ? [{ $match: { _id: { $lt: new mongoose.Types.ObjectId(cursor) } } }] : []),

            // Sort by most recent
            { $sort: { _id: -1 } },

            // Limit the results
            { $limit: POSTS_PER_PAGE },

            // Project the fields we need
            {
                $project: {
                    title: 1,
                    isAnswered: 1,
                    createdAt: 1,
                    replyCount: { $size: '$replies' },
                    upvoteCount: { $size: '$upvotes' },
                },
            },
        ];

        const posts = await Post.aggregate(query);

        // Determine the next cursor
        let nextCursor = null;
        if (posts.length === POSTS_PER_PAGE) {
            nextCursor = posts[posts.length - 1]._id;
        }

        res.status(200).json({ posts, nextCursor });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get All Posts Upvoted by the Current User (for "Upvoted Posts" tab)
// GET /api/users/me/upvoted-posts?cursor=...
router.get('/me/upvoted-posts', authenticateToken, async (req, res) => {
    const { cursor } = req.query;
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    try {
        const query = [
            // Find all posts where the 'upvotes' array contains the user's ID
            { $match: { upvotes: userId } },

            // Handle cursor pagination
            ...(cursor ? [{ $match: { _id: { $lt: new mongoose.Types.ObjectId(cursor) } } }] : []),

            // Sort by most recent
            { $sort: { _id: -1 } },

            // Limit the results
            { $limit: POSTS_PER_PAGE },

            // Project the same fields as the "My Posts" route for a consistent UI
            {
                $project: {
                    title: 1,
                    isAnswered: 1,
                    createdAt: 1,
                    replyCount: { $size: '$replies' },
                    upvoteCount: { $size: '$upvotes' },
                },
            },
        ];

        const posts = await Post.aggregate(query);

        // Determine the next cursor
        let nextCursor = null;
        if (posts.length === POSTS_PER_PAGE) {
            nextCursor = posts[posts.length - 1]._id;
        }

        res.status(200).json({ posts, nextCursor });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// User Data
// GET /api/users/:userId
router.get('/:userId', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(req.params.userId).select(
      'displayName avatar createdAt role'
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;