import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reply',
  }],
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  isAnswered: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);
export default Post;