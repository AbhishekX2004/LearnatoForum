import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import api from '../api';
import { Spinner } from '../components/Spinner';
import PostDisplay from '../components/PostDisplay';
import ReplyForm from '../components/ReplyForm';
import ReplyItem from '../components/ReplyItem';

const PostDetailPage = () => {
  const { postId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get(`/api/posts/${postId}`);
        setPost(data);
      } catch (err) {
        console.error('Failed to fetch post', err);
        setError('Post not found.');
        if (err.response?.status === 404) {
          navigate('/404');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId, navigate]);

  // Callback to add a new reply to the state
  const handleReplyAdded = (newReply) => {
    setPost((prevPost) => ({
      ...prevPost,
      replies: [...prevPost.replies, newReply],
    }));
  };

  // Callback to update the post's answered state
  const handlePostAnswered = () => {
    setPost((prevPost) => ({
      ...prevPost,
      isAnswered: true,
    }));
  };

  if (isLoading) return <Spinner fullPage={true} />;
  if (error) {
    return (
      <div className="container mx-auto p-4 text-center text-red-500">
        {error}
      </div>
    );
  }
  if (!post) return null;

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      {/*Post */}
      <PostDisplay post={post} onPostAnswered={handlePostAnswered} />

      {/*Replies*/}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {post.replies.length} {post.replies.length === 1 ? 'Answer' : 'Answers'}
        </h2>
        <div className="space-y-4">
          {post.replies.length > 0 ? (
            post.replies.map((reply) => (
              <ReplyItem key={reply._id} reply={reply} />
            ))
          ) : (
            <p className="text-gray-500">No answers yet. Be the first!</p>
          )}
        </div>
      </div>

      {/* Reply Form (logged in) */}
      {user && user.role && (
        <ReplyForm postId={post._id} onReplyAdded={handleReplyAdded} />
      )}
    </div>
  );
};

export default PostDetailPage;