import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import { Spinner } from '../components/Spinner';
import PostCard from '../components/PostCard';

const SearchPage = () => {
  // useSearchParams lets us read the URL query (e.g., ?q=node)
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextCursor, setNextCursor] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // useEffect re-runs every time the search query in the URL changes
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setPosts([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const { data } = await api.get(`/api/search?q=${encodeURIComponent(query)}`);
        setPosts(data.posts);
        setNextCursor(data.nextCursor);
      } catch (err) {
        console.error('Failed to fetch search results', err);
        setError('Failed to load results. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  const handleLoadMore = async () => {
    if (!nextCursor || isLoadingMore || !query) return;

    setIsLoadingMore(true);
    setError(null);
    try {
      const { data } = await api.get(`/api/search?q=${encodeURIComponent(query)}&cursor=${nextCursor}`);
      setPosts((prevPosts) => [...prevPosts, ...data.posts]);
      setNextCursor(data.nextCursor);
    } catch (err) {
      console.error('Failed to load more results', err);
      setError('Failed to load more. Please try again.');
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (isLoading) {
    return <Spinner fullPage={true} />;
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Search Results for: <span className="text-blue-600">"{query}"</span>
      </h1>

      {error && (
        <div className="text-center text-red-500 py-8">{error}</div>
      )}

      {!error && posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-16">
          <h2 className="text-2xl font-semibold">No results found.</h2>
          <p className="mt-2">Try searching for a different keyword.</p>
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

export default SearchPage;