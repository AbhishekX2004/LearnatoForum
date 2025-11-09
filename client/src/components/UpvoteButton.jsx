import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import api from '../api';

const UpvoteButton = ({ postId, initialUpvotes, initialUserUpvoted }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [upvoteCount, setUpvoteCount] = useState(initialUpvotes);
  const [userUpvoted, setUserUpvoted] = useState(initialUserUpvoted);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpvote = async () => {
    if (!user) return navigate('/login');
    if (!user.role) return navigate('/select-role');
    if (isLoading) return;

    setIsLoading(true);

    // Optimistic UI update
    const originalCount = upvoteCount;
    const originalUpvoted = userUpvoted;
    
    setUpvoteCount(userUpvoted ? upvoteCount - 1 : upvoteCount + 1);
    setUserUpvoted(!userUpvoted);

    try {
      // Sync with server
      const { data } = await api.post(`/api/posts/${postId}/upvote`);
      // Update with server's source of truth
      setUpvoteCount(data.upvotes);
      setUserUpvoted(data.userUpvoted);
    } catch (err) {
      console.error('Upvote failed', err);
      // Rollback on error
      setUpvoteCount(originalCount);
      setUserUpvoted(originalUpvoted);
    } finally {
      setIsLoading(false);
    }
  };

  const buttonClass = userUpvoted
    ? 'bg-theme-color text-white hover:bg-theme-color-dark'
    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105';

  return (
    <button
      onClick={handleUpvote}
      disabled={isLoading}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-colors ${buttonClass}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a.75.75 0 01-.75-.75V4.66L6.03 8.22a.75.75 0 01-1.06-1.06l4.5-4.5a.75.75 0 011.06 0l4.5 4.5a.75.75 0 01-1.06 1.06L10.75 4.66V17.25A.75.75 0 0110 18z" clipRule="evenodd" />
      </svg>
      <span>{upvoteCount}</span>
    </button>
  );
};

export default UpvoteButton;