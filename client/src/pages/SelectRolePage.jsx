import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import api from '../api';
import { Spinner } from '../components/Spinner';

const SelectRolePage = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleSelect = async (role) => {
    setIsLoading(true);
    setError(null);
    setSelectedRole(role);
    
    try {
      const { data } = await api.post('/auth/set-role', { role });
      setUser(data.user);
      setTimeout(() => {
        navigate('/');
      }, 300);
      
    } catch (err) {
      console.error('Failed to set role', err);
      setError('An error occurred. Please try again.');
      setSelectedRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <Spinner fullPage={true} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
            <img
                src={user.avatar}
                alt={user.displayName}
                className="w-20 h-20 rounded-full border-2 border-gray-300"
                referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Welcome, {user.displayName}! 👋
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose your role to get started.
          </p>
        </div>

        {/* Role Cards Container */}
        <div className="bg-white rounded-2xl shadow-xl p-4 mb-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Spinner />
              <p className="mt-4 text-gray-600">Setting up your account...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Learner Card */}
              <RoleCard
                title="Learner"
                description="Browse questions, post your own, and learn from the community."
                icon={
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                }
                features={[
                  'Ask questions and get expert answers',
                  'Browse and search community Q&A',
                ]}
                isSelected={selectedRole === 'learner'}
                onSelect={() => handleRoleSelect('learner')}
                accentColor="blue"
              />
              
              {/* Instructor Card */}
              <RoleCard
                title="Instructor"
                description="Share your knowledge, answer questions, and help guide learners."
                icon={
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                }
                features={[
                  'Answer questions in your expertise',
                  'Create educational content',
                  'Mentor and guide learners'
                ]}
                isSelected={selectedRole === 'instructor'}
                onSelect={() => handleRoleSelect('instructor')}
                accentColor="green"
              />
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-center font-medium">{error}</p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

const RoleCard = ({ title, description, icon, features, isSelected, onSelect, accentColor }) => {
  const colorClasses = {
    blue: {
      border: 'border-blue-500',
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconText: 'text-blue-600',
      hover: 'hover:border-blue-400 hover:shadow-blue-100',
      ring: 'ring-blue-500',
      checkBg: 'bg-blue-600'
    },
    green: {
      border: 'border-green-500',
      bg: 'bg-green-50',
      iconBg: 'bg-green-100',
      iconText: 'text-green-600',
      hover: 'hover:border-green-400 hover:shadow-green-100',
      ring: 'ring-green-500',
      checkBg: 'bg-green-600'
    }
  };

  const colors = colorClasses[accentColor];

  return (
    <button
      onClick={onSelect}
      className={`
        relative p-6 rounded-xl border-2 text-left transition-all duration-200
        ${isSelected 
          ? `${colors.border} ${colors.bg} shadow-lg` 
          : `border-gray-200 bg-white ${colors.hover} hover:shadow-lg`
        }
        focus:outline-none focus:ring-2 focus:ring-offset-2 ${colors.ring}
        group
      `}
    >
      {/* Selected Indicator */}
      {isSelected && (
        <div className={`absolute top-4 right-4 w-6 h-6 ${colors.checkBg} rounded-full flex items-center justify-center`}>
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      {/* Icon */}
      <div className={`inline-flex p-3 ${colors.iconBg} rounded-lg mb-4 ${colors.iconText} transition-transform group-hover:scale-110`}>
        {icon}
      </div>

      {/* Title and Description */}
      <h2 className={`text-2xl font-bold mb-2 ${colors.iconText}`}>
        {title}
      </h2>
      <p className="text-gray-600 mb-4">
        {description}
      </p>

      {/* Features List */}
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start text-sm text-gray-700">
            <svg className={`w-5 h-5 ${colors.iconText} mr-2 flex-shrink-0 mt-0.5`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* Hover Arrow */}
      <div className={`mt-4 flex items-center text-sm font-semibold ${colors.iconText} opacity-0 group-hover:opacity-100 transition-opacity`}>
        <span>Select {title}</span>
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
};

export default SelectRolePage;