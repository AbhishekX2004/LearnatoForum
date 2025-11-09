import React from 'react';
import { Link } from 'react-router-dom';

const PostSummaryCard = ({ post }) => {
  return (
    <Link
      to={`/post/${post._id}`}
      className="block p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      <h3 className="text-lg font-semibold theme-color truncate">
        {post.title}
      </h3>
      <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
        <span>
          {post.upvoteCount} Upvotes | {post.replyCount} Replies
        </span>
        <span
          className={`font-medium ${
            post.isAnswered ? 'text-green-600' : 'text-gray-500'
          }`}
        >
          {post.isAnswered ? 'Answered' : 'Unanswered'}
        </span>
      </div>
    </Link>
  );
};

export default PostSummaryCard;