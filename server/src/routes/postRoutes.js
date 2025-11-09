import express from 'express';
import mongoose from 'mongoose';
import { authenticateToken } from '../services/authMiddleware.js';
import { optionalAuthenticateToken } from '../services/optionalAuthMiddleware.js';
import Post from '../models/Post.js';
import Reply from '../models/Reply.js';
import User from '../models/User.js';

const router = express.Router();
const POSTS_PER_PAGE = 10;

// Create a New Post
// POST /api/posts
router.post('/', authenticateToken, async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }
  if (!req.user.role) {
    return res.status(403).json({ message: 'Forbidden: Role not set' });
  }

  try {
    const post = new Post({
      title,
      content,
      author: req.user.userId,
    });
    await post.save();
    
    // Populate author info before sending
    const populatedPost = await Post.findById(post._id).populate('author', 'displayName avatar');
    
    res.status(201).json(populatedPost);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get All Posts
// GET /api/posts?cursor=...
router.get('/', optionalAuthenticateToken, async (req, res) => {
  const { cursor } = req.query;
  const userId = req.user ? new mongoose.Types.ObjectId(req.user.userId) : null;

  try {
    const query = {};
    if (cursor) {
      query._id = { $lt: new mongoose.Types.ObjectId(cursor) };
    }
    
    // We must switch to an aggregation pipeline
    const pipeline = [
      { $match: query },
      { $sort: { _id: -1 } },
      { $limit: POSTS_PER_PAGE },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'authorInfo'
        }
      },
      { $unwind: '$authorInfo' },
      {
        $project: {
          title: 1,
          isAnswered: 1,
          createdAt: 1,
          upvoteCount: { $size: '$upvotes' },
          replyCount: { $size: '$replies' },
          author: {
            _id: '$authorInfo._id',
            displayName: '$authorInfo.displayName',
            avatar: '$authorInfo.avatar'
          },
          // add a 'userUpvoted' field to the response
          userUpvoted: {
            $cond: {
              if: { $eq: [userId, null] }, // If no user is logged in
              then: false,                // Then always false
              else: { $in: [userId, '$upvotes'] } // Else, check if user ID is in the upvotes array
            }
          }
        }
      }
    ];

    const posts = await Post.aggregate(pipeline);

    let nextCursor = null;
    if (posts.length === POSTS_PER_PAGE) {
      nextCursor = posts[posts.length - 1]._id;
    }

    res.status(200).json({ posts, nextCursor });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get a Single Post with All Replies
// GET /api/posts/:postId
router.get('/:postId', optionalAuthenticateToken, async (req, res) => {
  const userId = req.user ? new mongoose.Types.ObjectId(req.user.userId) : null;

  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }
    
    const post = await Post.findById(req.params.postId)
      .populate('author', 'displayName avatar')
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          select: 'displayName avatar',
        },
        options: { sort: { createdAt: -1 } } // Sort replies newest-first
      })
      .lean();

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Manually add the 'userUpvoted' field
    if (userId) {
      // .some() is fast. .equals() correctly compares ObjectIds.
      post.userUpvoted = post.upvotes.some(upvoterId => upvoterId.equals(userId));
    } else {
      post.userUpvoted = false; // Not logged in, can't have upvoted
    }

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete a Post
// DELETE /api/posts/:postId
router.delete('/:postId', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden: You are not the author' });
    }

    // Delete all associated replies
    await Reply.deleteMany({ post: post._id });
    // Delete the post
    await post.deleteOne();

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Add a Reply to a Post
// POST /api/posts/:postId/reply
router.post('/:postId/reply', authenticateToken, async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ message: 'Reply content is required' });
  }
  if (!req.user.role) {
    return res.status(403).json({ message: 'Forbidden: Role not set' });
  }
  
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const reply = new Reply({
      content,
      author: req.user.userId,
      post: req.params.postId,
    });
    await reply.save();

    // Add reply reference to the post
    post.replies.push(reply._id);
    await post.save();
    
    // Populate the reply with author info before sending
    const populatedReply = await Reply.findById(reply._id).populate('author', 'displayName avatar');

    res.status(201).json(populatedReply);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Toggle Upvote on a Post
// POST /api/posts/:postId/upvote
router.post('/:postId/upvote', authenticateToken, async (req, res) => {
  if (!req.user.role) {
    return res.status(403).json({ message: 'Forbidden: Role not set' });
  }

  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (post.author.equals(req.user.userId)) {
      return res.status(403).json({ message: 'Forbidden: Cannot upvote your own post' });
    }
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    const hasUpvoted = post.upvotes.includes(userId);
    let userUpvotedStatus;

    if (hasUpvoted) {
      // User has already upvoted -> Remove upvote
      post.upvotes.pull(userId);
      userUpvotedStatus = false;
    } else {
      // User has not upvoted -> Add upvote
      post.upvotes.push(userId);
      userUpvotedStatus = true;
    }

    await post.save();

    res.status(200).json({
      upvotes: post.upvotes.length,
      userUpvoted: userUpvotedStatus,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Mark a Post as Answered
// PATCH /api/posts/:postId/answer
router.patch('/:postId/answer', authenticateToken, async (req, res) => {
  if (!req.user.role) {
    return res.status(403).json({ message: 'Forbidden: Role not set' });
  }
  
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is author OR an instructor
    if (post.author.toString() !== req.user.userId && req.user.role !== 'instructor') {
      return res.status(403).json({ message: 'Forbidden: Only the author or an instructor can mark as answered' });
    }

    post.isAnswered = true;
    await post.save();
    
    // Send back the minimal update
    res.status(200).json({ _id: post._id, isAnswered: post.isAnswered });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;