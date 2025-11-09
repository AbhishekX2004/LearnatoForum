import React from 'react';
import { Link } from 'react-router-dom';
import UpvoteButton from './UpvoteButton';

const PostCard = ({ post }) => {
  return (
    <div className="flex gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Upvote Button */}
      <div className="flex-shrink-0">
        <UpvoteButton
          postId={post._id}
          initialUpvotes={post.upvoteCount || post.upvotes?.length || 0}
          initialUserUpvoted={post.userUpvoted}
        />
      </div>

      {/* Post Details */}
      <div className="flex-1 overflow-hidden">
        {/* Author and Date */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
          <Link to={`/profile/${post.author._id}`}>
            <img
              src={post.author.avatar}
              alt={post.author.displayName}
              className="w-6 h-6 rounded-full"
            />
          </Link>
          <Link
            to={`/profile/${post.author._id}`}
            className="font-semibold text-gray-800 hover:underline"
          >
            {post.author.displayName}
          </Link>
          <span>· {new Date(post.createdAt).toLocaleDateString()}</span>
        </div>

        {/* Post Title */}
        <Link
          to={`/post/${post._id}`}
          className="block"
        >
          <h2 className="text-xl font-bold text-gray-800 truncate hover:text-blue-900">
            {post.title}
          </h2>
        </Link>

        {/* Stats and Status */}
        <div className="flex justify-between items-center mt-3">
          <span className="text-sm text-gray-500">
            {post.replyCount || post.replies?.length || 0} Replies
          </span>
          {post.isAnswered && (
            <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
              Answered
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;