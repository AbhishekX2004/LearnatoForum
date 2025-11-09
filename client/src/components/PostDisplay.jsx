import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import UpvoteButton from './UpvoteButton';
import api from '../api';

const PostDisplay = ({ post, onPostAnswered }) => {
  const { user } = useAuth();
  const [isAnswering, setIsAnswering] = useState(false);

  const canMarkAnswered = user && (user._id === post.author._id || user.role === 'instructor');

  const handleMarkAsAnswered = async () => {
    if (isAnswering) return;
    setIsAnswering(true);
    try {
      await api.patch(`/api/posts/${post._id}/answer`);
      onPostAnswered();
    } catch (err) {
      console.error('Failed to mark as answered', err);
    } finally {
      setIsAnswering(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* Title and Answered Badge */}
      <div className="flex justify-between items-start">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{post.title}</h1>
        {post.isAnswered && (
          <span className="flex-shrink-0 ml-4 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
            Answered
          </span>
        )}
      </div>

      {/* Author Info */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <Link to={`/profile/${post.author._id}`}>
          <img 
            src={post.author.avatar} 
            alt={post.author.displayName} 
            className="w-6 h-6 rounded-full"
          />
        </Link>
        <Link to={`/profile/${post.author._id}`} className="font-semibold theme-color hover:underline">
          {post.author.displayName}
        </Link>
        <span>· Asked {new Date(post.createdAt).toLocaleDateString()}</span>
      </div>

      {/* Post Content */}
      <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">
        {post.content}
      </p>

      {/* Action Bar */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
        <UpvoteButton
          postId={post._id}
          initialUpvotes={post.upvotes.length}
          initialUserUpvoted={post.userUpvoted}
        />
        {canMarkAnswered && !post.isAnswered && (
          <button
            onClick={handleMarkAsAnswered}
            disabled={isAnswering}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            {isAnswering ? 'Marking...' : 'Mark as Answered'}
          </button>
        )}
      </div>
    </div>
  );
};

export default PostDisplay;