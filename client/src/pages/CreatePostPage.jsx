import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../contexts/auth-context';
import { Spinner } from '../components/Spinner';

const CreatePostPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const { user } = useAuth(); 

  if (!user) {
    navigate('/login');
    return null; 
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim() === '' || content.trim() === '') {
      setError('Title and content cannot be empty.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Call the API endpoint to create the post
      const { data: newPost } = await api.post('/api/posts', {
        title,
        content,
      });
      
      // On success, navigate to the new post's detail page
      navigate(`/post/${newPost._id}`);

    } catch (err) {
      console.error('Failed to create post', err);
      setError('Failed to create post. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Ask a New Question
        </h1>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label 
              htmlFor="title" 
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., How do I deploy Node.js on Cloud Run?"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:theme-color"
              disabled={isLoading}
            />
          </div>

          <div className="mb-6">
            <label 
              htmlFor="content" 
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="10"
              placeholder="Provide more details, code snippets, or what you've already tried."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:theme-color"
              disabled={isLoading}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          <div className="flex justify-end items-center">
            {isLoading ? (
              <Spinner />
            ) : (
              <button
                type="submit"
                className="px-6 py-2 bg-theme-color text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                Post Your Question
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;