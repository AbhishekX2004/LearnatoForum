import express from 'express';
import mongoose from 'mongoose';
import Post from '../models/Post.js';

const router = express.Router();
const SEARCH_RESULTS_PER_PAGE = 10;

// GET /api/search?q=...&sortBy=...&filter=...&cursor=...
router.get('/', async (req, res) => {
  const { q, sortBy, filter, cursor } = req.query;

  try {
    let query = {};
    let sort = {};

    // build query based on search and filters
    if (q) {
      // $text operator uses the text index we created
      query.$text = { $search: q };
    }
    if (filter === 'unanswered') {
      query.isAnswered = false;
    }

    // Build Sort Options
    if (sortBy === 'votes') {
      sort.upvoteCount = -1;
    } else if (q) {
      sort.score = { $meta: 'textScore' };
    } else {
      sort._id = -1;
    }

    const pipeline = [];

    // Match based on text search and filters
    if (Object.keys(query).length > 0) {
      pipeline.push({ $match: query });
    }
    
    // Handle cursor pagination (must be after $match, before $sort)
    if (cursor) {
      if (sortBy === 'votes') {
        console.warn('Cursor pagination is only optimized for date sort');
        pipeline.push({ $match: { _id: { $lt: new mongoose.Types.ObjectId(cursor) } } });
      } else if (sort._id) {
         pipeline.push({ $match: { _id: { $lt: new mongoose.Types.ObjectId(cursor) } } });
      }      
    }

    // Add fields for sorting
    pipeline.push({
      $addFields: {
        upvoteCount: { $size: '$upvotes' },
        ...(q && { score: { $meta: 'textScore' } }) // Add text score if searching
      }
    });

    // Sort the results
    pipeline.push({ $sort: sort });

    // Limit the results
    pipeline.push({ $limit: SEARCH_RESULTS_PER_PAGE });
    
    // Populate Author Info
    pipeline.push({
      $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: '_id',
        as: 'authorInfo'
      }
    });
    
    // Deconstruct author array and project final fields
    pipeline.push({
      $unwind: '$authorInfo'
    });
    
    pipeline.push({
      $project: {
        title: 1,
        isAnswered: 1,
        createdAt: 1,
        upvoteCount: 1,
        replyCount: { $size: '$replies' },
        author: {
          _id: '$authorInfo._id',
          displayName: '$authorInfo.displayName',
          avatar: '$authorInfo.avatar'
        },
        ...(q && { score: 1 }) // Include score if  used it
      }
    });

    const posts = await Post.aggregate(pipeline);

    // Determine next cursor only for date
    let nextCursor = null;
    if (posts.length === SEARCH_RESULTS_PER_PAGE && sort._id) {
      nextCursor = posts[posts.length - 1]._id;
    }

    res.status(200).json({ posts, nextCursor });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;