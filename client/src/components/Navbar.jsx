import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import ProfileDropdown from './ProfileDropdown';
import SearchBar from './SearchBar';

const Navbar = () => {
    const { user } = useAuth(); // Get user from our context

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3">
                <div className="grid grid-cols-3 items-center gap-4">
                    {/* Left: Logo */}
                    <div className="flex justify-start">
                        <Link to="/" className="text-2xl font-bold theme-color bg-clip-text text-transparent flex items-center">
                            <img src="/icon.png" alt="Learnato Forum Logo" className="w-9 h-9 mr-2"/>
                            Learnato Forum
                        </Link>
                    </div>

                    {/* Center: Search Bar */}
                    <div className="flex justify-center">
                        {user && user.role && <SearchBar />}
                    </div>

                    {/* Right: Auth Buttons */}
                    <div className="flex justify-end items-center space-x-4">
                        {user && user.role && (
                            <Link
                                to="/create-post"
                                className="bg-theme-color px-4 py-2 text-white rounded-lg font-semibold transition-colors"
                            >
                                New Post
                            </Link>
                        )}

                        {user ? (
                            <ProfileDropdown />
                        ) : (
                            <Link
                                to="/login"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;