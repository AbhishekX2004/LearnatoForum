import React, { useState } from 'react';
import api from '../api';
import { Spinner } from './Spinner';

const ReplyForm = ({ postId, onReplyAdded }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (content.trim() === '') return;

    setIsSubmitting(true);
    setError(null);

    try {
      const { data: newReply } = await api.post(`/api/posts/${postId}/reply`, { content });
      onReplyAdded(newReply);
      setContent('');
    } catch (err) {
      console.error('Failed to post reply', err);
      setError('Failed to post reply. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Add Your Answer</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="5"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Share your knowledge or solution..."
          disabled={isSubmitting}
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <div className="flex justify-end mt-3">
          {isSubmitting ? (
            <Spinner />
          ) : (
            <button
              type="submit"
              className="px-6 py-2 bg-theme-color text-white rounded-lg font-semibold transition-colors"
              disabled={isSubmitting}
            >
              Post Reply
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ReplyForm;