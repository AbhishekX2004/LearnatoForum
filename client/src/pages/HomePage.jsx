import React, { useState, useEffect } from 'react';
import api from '../api';
import { Spinner } from '../components/Spinner';
import PostCard from '../components/PostCard';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextCursor, setNextCursor] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Initial fetch for posts
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await api.get('/api/posts');
        setPosts(data.posts);
        setNextCursor(data.nextCursor);
      } catch (err) {
        console.error('Failed to fetch posts', err);
        setError('Failed to load the feed. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Function to load more posts
  const handleLoadMore = async () => {
    if (!nextCursor || isLoadingMore) return;

    setIsLoadingMore(true);
    setError(null);
    try {
      const { data } = await api.get(`/api/posts?cursor=${nextCursor}`);
      setPosts((prevPosts) => [...prevPosts, ...data.posts]);
      setNextCursor(data.nextCursor);
    } catch (err) {
      console.error('Failed to load more posts', err);
      setError('Failed to load more. Please try again.');
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (isLoading) {
    return <Spinner fullPage={true} />;
  }

  if (error && posts.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      {posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-16">
          <h2 className="text-2xl font-semibold">No posts yet.</h2>
          <p className="mt-2">Be the first to ask a question!</p>
        </div>
      )}

      {/* Load More Button */}
      {nextCursor && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {isLoadingMore ? <Spinner /> : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;