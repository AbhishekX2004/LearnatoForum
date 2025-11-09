import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex-grow max-w-md mx-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search questions..."
        className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:theme-color"
      />
    </form>
  );
};

export default SearchBar;