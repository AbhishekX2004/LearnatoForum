import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';

const LoginPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  // If the user is already logged in, redirect them away
  if (user) {
    // If they have a role, send them where they were going (or home)
    if (user.role) {
      return <Navigate to={from} replace />;
    }
    // If they don't have a role, send them to role selection
    return <Navigate to="/select-role" replace />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="p-10 bg-white rounded-2xl shadow-2xl text-center w-full max-w-md border border-gray-100">
        {/* Logo/Icon */}
        <div className="mb-6">
            <img src='/icon.png' alt="Learnato Forum Logo" className="w-30 h-30 mx-auto mb-4"/>          
        </div>

        {/* Title */}
        <h1 className="theme-color text-4xl font-bold bg-clip-text text-transparent mb-3">
          Learnato Forum
        </h1>
        
        {/* Subtitle */}
        <p className="text-gray-600 mb-8 text-lg">
          Empower learning through conversation
        </p>

        {/* Divider */}
        <div className="flex items-center mb-8">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-4 text-sm text-gray-500">Sign in to continue</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* Google Sign-in Button */}
        <a
          href="http://localhost:5001/auth/google"
          className="flex items-center justify-center w-full p-4 bg-white border-2 border-gray-200 rounded-xl shadow-sm text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all duration-200 group"
        >
          {/* Google Icon SVG */}
          <svg className="w-6 h-6 mr-3" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C39.712,35.619,44,29.567,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
          </svg>
          <span className="group-hover:translate-x-0.5 transition-transform duration-200">
            Sign in with Google
          </span>
        </a>

        {/* Footer text */}
        <p className="mt-8 text-xs text-gray-500">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default LoginPage;