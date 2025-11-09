import React from 'react';
import { Link } from 'react-router-dom';

const ReplyItem = ({ reply }) => {
  return (
    <div className="flex gap-4 py-4 border-b border-gray-200">
      <Link to={`/profile/${reply.author._id}`}>
        <img
          src={reply.author.avatar}
          alt={reply.author.displayName}
          className="w-10 h-10 rounded-full"
        />
      </Link>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Link to={`/profile/${reply.author._id}`} className="font-semibold text-gray-800 hover:underline">
            {reply.author.displayName}
          </Link>
          <span className="text-sm text-gray-500">
            · {new Date(reply.createdAt).toLocaleDateString()}
          </span>
        </div>
        <p className="text-gray-700 mt-1">{reply.content}</p>
      </div>
    </div>
  );
};

export default ReplyItem;