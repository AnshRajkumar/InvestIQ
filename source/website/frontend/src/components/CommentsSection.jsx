import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const CommentsSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const { user } = useAuth();

  const fetchComments = async () => {
    if (!user?.is_premium) return;
    
    setLoading(true);
    try {
      const response = await api.get(`/api/comments/posts/${postId}/comments/`);
      setComments(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showComments && user?.is_premium) {
      fetchComments();
    }
  }, [showComments, postId, user?.is_premium]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user?.is_premium) return;

    try {
      const response = await api.post(`/api/comments/posts/${postId}/comments/`, {
        content: newComment,
      });
      setComments([response.data, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment');
    }
  };

  const handleReply = async (parentCommentId) => {
    if (!replyText.trim() || !user?.is_premium) return;

    try {
      const response = await api.post(
        `/api/comments/posts/${postId}/comments/reply/`,
        {
          content: replyText,
          parent_comment_id: parentCommentId,
        }
      );
      
      // Update parent comment with new reply
      setComments(
        comments.map((comment) => {
          if (comment.id === parentCommentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), response.data],
              reply_count: comment.reply_count + 1,
            };
          }
          return comment;
        })
      );
      setReplyingTo(null);
      setReplyText('');
    } catch (error) {
      console.error('Error adding reply:', error);
      alert('Failed to add reply');
    }
  };

  const handleLike = async (commentId, isLiked) => {
    if (!user?.is_premium) return;

    try {
      const response = await api.post(`/api/comments/posts/${postId}/comments/${commentId}/like/`);
      
      // Update comment like count
      setComments(
        comments.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              is_liked: response.data.liked,
              like_count: response.data.like_count,
            };
          }
          return comment;
        })
      );
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      await api.delete(`/api/comments/posts/${postId}/comments/${commentId}/`);
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment');
    }
  };

  const formatDate = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const CommentThread = ({ comment, isReply = false }) => (
    <div className={`${isReply ? 'ml-6 mt-3 border-l-2 border-gray-700 pl-3' : 'mb-4'}`}>
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
          {comment.author_name?.[0]?.toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{comment.author_name}</span>
            {comment.author_email_verified && (
              <span title="Verified" className="inline-flex items-center">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
            )}
            {comment.author_is_premium && (
              <span title="Premium" className="inline-flex items-center">
                <svg className="w-3 h-3 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 16l-3-9 6 4 4-6 4 6 6-4-3 9H5zm1.5 4a1.5 1.5 0 010-3h11a1.5 1.5 0 010 3h-11z" />
                </svg>
              </span>
            )}
            <span className="text-xs text-gray-500">{formatDate(comment.created_at)}</span>
          </div>
          <p className="text-sm text-gray-200 mt-1">{comment.content}</p>

          {/* Comment actions */}
          <div className="flex gap-3 mt-2 text-xs text-gray-400">
            <button
              onClick={() => handleLike(comment.id, comment.is_liked)}
              className={`flex items-center gap-1 hover:text-gray-200 transition ${
                comment.is_liked ? 'text-red-500' : ''
              }`}
            >
              <span>{comment.is_liked ? '❤️' : '🤍'}</span>
              {comment.like_count > 0 && <span>{comment.like_count}</span>}
            </button>

            {user?.is_premium && (
              <button
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="hover:text-gray-200 transition"
              >
                💬 Reply
              </button>
            )}

            {user?.id === comment.author && (
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="hover:text-red-400 transition"
              >
                🗑️ Delete
              </button>
            )}
          </div>

          {/* Reply input */}
          {replyingTo === comment.id && user?.is_premium && (
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleReply(comment.id);
                  }
                }}
              />
              <button
                onClick={() => handleReply(comment.id)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-sm text-white transition"
              >
                Reply
              </button>
              <button
                onClick={() => setReplyingTo(null)}
                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white transition"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Display replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3">
              {comment.replies.map((reply) => (
                <CommentThread key={reply.id} comment={reply} isReply={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="mt-4 border-t border-gray-800 pt-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => user?.is_premium ? setShowComments(!showComments) : null}
          className="text-sm text-gray-400 hover:text-gray-200 transition flex items-center gap-2"
        >
          <span>{showComments ? '▼' : '▶'}</span>
          <span>Comments ({comments.length})</span>
        </button>
        {!user?.is_premium && (
          <span title="Premium Feature" className="inline-flex items-center ml-auto">
            <svg className="w-4 h-4 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 16l-3-9 6 4 4-6 4 6 6-4-3 9H5zm1.5 4a1.5 1.5 0 010-3h11a1.5 1.5 0 010 3h-11z" />
            </svg>
          </span>
        )}
      </div>

      {showComments && user?.is_premium ? (
        <div className="mt-4 space-y-4">
          {/* Add comment form */}
          <form onSubmit={handleAddComment} className="flex gap-3 pb-4 border-b border-gray-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {user.username?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm text-white transition"
              >
                Post
              </button>
            </div>
          </form>

          {/* Comments list */}
          {loading ? (
            <div className="text-center py-4 text-gray-400">Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-sm">No comments yet. Be the first to comment!</div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <CommentThread key={comment.id} comment={comment} />
              ))}
            </div>
          )}
        </div>
      ) : !user?.is_premium && showComments ? (
        <div className="mt-4 relative">
          <div className="absolute inset-0 bg-black bg-opacity-60 rounded-lg flex items-center justify-center z-10 backdrop-blur-sm">
            <div className="text-center">
              <svg className="w-12 h-12 text-yellow-500 mx-auto mb-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 16l-3-9 6 4 4-6 4 6 6-4-3 9H5zm1.5 4a1.5 1.5 0 010-3h11a1.5 1.5 0 010 3h-11z" />
              </svg>
              <p className="text-white font-bold mb-1">Premium Feature</p>
              <p className="text-gray-300 text-sm mb-3">Unlock community discussions</p>
              <a href="/settings" className="inline-block px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white text-sm transition">
                Upgrade Now
              </a>
            </div>
          </div>
          <div className="opacity-30">
            <div className="text-center py-8 text-gray-500">Coming soon with premium</div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CommentsSection;
