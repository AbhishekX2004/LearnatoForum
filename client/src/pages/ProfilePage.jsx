import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import api from '../api';
import { Spinner } from '../components/Spinner';
import PostSummaryCard from '../components/PostSummaryCard';

const TABS = {
  POSTS: 'My Posts',
  UPVOTED: 'Upvoted Posts',
};

const ProfilePage = () => {
  const { userId } = useParams();
  const { user: authUser, setUser: setAuthUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [upvotedPosts, setUpvotedPosts] = useState([]);
  const [activeTab, setActiveTab] = useState(TABS.POSTS);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');

  const isMyProfile = authUser?._id === userId;

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch profile info
        const profileRes = await api.get(`/api/users/${userId}`);
        setProfile(profileRes.data);
        setEditName(profileRes.data.displayName);

        // Fetch posts
        const postsRes = await api.get(`/api/users/${userId}/posts`);
        setPosts(postsRes.data.posts);

        // If it's my profile, fetch my upvoted posts
        if (isMyProfile) {
          const upvotedRes = await api.get('/api/users/me/upvoted-posts');
          setUpvotedPosts(upvotedRes.data.posts);
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
        setError('Failed to load profile. The user may not exist.');
        if (err.response?.status === 404) {
          navigate('/404');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [userId, isMyProfile, navigate]);

  const handleEditSave = async (e) => {
    e.preventDefault();
    if (editName.trim() === '') return;
    try {
        const { data: updatedUser } = await api.patch('/api/users/me', {
        displayName: editName.trim(),
        });
        setProfile(prev => ({ ...prev, ...updatedUser }));
        setAuthUser(prev => ({ ...prev, ...updatedUser }));
        setIsEditing(false);
    } catch (err) {
        console.error('Failed to update profile', err);
        setError('Failed to save changes.');
    }
    };

  if (isLoading) return <Spinner fullPage={true} />;
  if (error) {
    return (
      <div className="container mx-auto p-4 text-center text-red-500">
        {error}
      </div>
    );
  }
  if (!profile) return null;

  const postsToDisplay = activeTab === TABS.POSTS ? posts : upvotedPosts;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {/* Profile Header */}
      <div className="p-6 bg-white rounded-lg shadow-md flex flex-col md:flex-row items-center gap-6 mb-6">
        <img
          src={profile.avatar}
          alt={profile.displayName}
          className="w-24 h-24 rounded-full border-4 border-gray-200"
        />
        <div className="flex-1 text-center md:text-left">
          {isEditing ? (
            <form onSubmit={handleEditSave} className="flex gap-2">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md w-full"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-green-800 text-white rounded-md font-semibold"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
              >
                Cancel
              </button>
            </form>
          ) : (
            <h1 className="text-3xl font-bold text-gray-800">
              {profile.displayName}
            </h1>
          )}
          <p className="text-gray-500">
            {profile.role} | Joined {new Date(profile.createdAt).toLocaleDateString()}
          </p>
        </div>
        {isMyProfile && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-theme-color text-white rounded-lg font-semibold"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-4 border-b border-gray-200">
        <nav className="flex space-x-4">
          <TabButton
            title={TABS.POSTS}
            isActive={activeTab === TABS.POSTS}
            onClick={() => setActiveTab(TABS.POSTS)}
          />
          {isMyProfile && (
            <TabButton
              title={TABS.UPVOTED}
              isActive={activeTab === TABS.UPVOTED}
              onClick={() => setActiveTab(TABS.UPVOTED)}
            />
          )}
        </nav>
      </div>

      {/* Post List */}
      <div className="space-y-4">
        {postsToDisplay.length > 0 ? (
          postsToDisplay.map((post) => (
            <PostSummaryCard key={post._id} post={post} />
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">
            No posts to display.
          </p>
        )}
        {/* We can add a "Load More" button here for pagination later */}
      </div>
    </div>
  );
};

// tabs components
const TabButton = ({ title, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`py-2 px-4 font-semibold ${
      isActive
        ? 'border-b-2 border-blue-800 blue-800'
        : 'text-gray-500 hover:text-gray-700'
    }`}
  >
    {title}
  </button>
);

export default ProfilePage;