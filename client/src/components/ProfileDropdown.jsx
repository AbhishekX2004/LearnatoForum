import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import api from '../api';

const ProfileDropdown = () => {
  const { user, setUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
        <img
          src={user.avatar}
          alt={user.displayName}
          className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-blue-500"
          referrerPolicy="no-referrer"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-10 py-1">
          <Link
            to={`/profile/${user._id}`}
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            My Profile
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;