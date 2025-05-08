"use client";

import { Demo_Image } from "@/app/assets/demo";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/server";
import axios from "axios";
import { Heart, MessageCircle, Reply, Send, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PostDetail() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyComment, setReplyComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [error, setError] = useState("");
  const [showComments, setShowComments] = useState(false);
  const { user, token, logout, loading } = useAuth();
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    if (!loading) {
      fetchPost();
      fetchComments();
    }
  }, [loading]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts/${params.id}`);
      setPost(response.data.data);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        setError("Session expired. Please log in again.");
      } else {
        setError(err.response?.data?.message || "Error fetching post");
      }
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${API_URL}/comments/${params.id}`);
      setComments(response.data.data);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        setError("Session expired. Please log in again.");
      } else {
        setError(err.response?.data?.message || "Error fetching comments");
      }
    }
  };

  const handleLikeToggle = async (postId, commentId) => {
    if (!user) {
      setError("Please log in to like.");
      return;
    }
    try {
      const payload = postId ? { postId } : { commentId };
      const response = await axios.patch(`${API_URL}/likes/toggle`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (postId) {
        fetchPost();
      } else {
        fetchComments();
      }
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        setError("Session expired. Please log in again.");
      } else {
        setError(err.response?.data?.message || "Error toggling like");
      }
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("Please log in to comment.");
      return;
    }
    if (!newComment.trim()) {
      setError("Comment cannot be empty");
      return;
    }
    try {
      const response = await axios.post(
        `${API_URL}/comments`,
        { content: newComment, postId: params.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment("");
      fetchComments();
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        setError("Session expired. Please log in again.");
      } else {
        setError(err.response?.data?.message || "Error adding comment");
      }
    }
  };

  const handleReply = async (e, parentCommentId) => {
    e.preventDefault();
    if (!user) {
      setError("Please log in to reply.");
      return;
    }
    if (!replyComment.trim()) {
      setError("Reply cannot be empty");
      return;
    }
    try {
      const response = await axios.post(
        `${API_URL}/comments/replies`,
        { content: replyComment, parentCommentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReplyComment("");
      setReplyTo(null);
      fetchComments();
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        setError("Session expired. Please log in again.");
      } else {
        setError(err.response?.data?.message || "Error adding reply");
      }
    }
  };

  const handleDeletePost = async () => {
    if (!user) {
      setError("Please log in to delete.");
      return;
    }
    try {
      const response = await axios.delete(`${API_URL}/posts/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push("/");
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        setError("Session expired. Please log in again.");
      } else {
        setError(err.response?.data?.message || "Error deleting post");
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!user) {
      setError("Please log in to delete.");
      return;
    }
    try {
      const response = await axios.delete(`${API_URL}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchComments();
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        setError("Session expired. Please log in again.");
      } else {
        setError(err.response?.data?.message || "Error deleting comment");
      }
    }
  };

  const renderComments = (comments, depth = 0) => {
    return comments.map((comment) => (
      <div
        key={comment._id}
        className={`border p-4 rounded mb-2`}
        style={{ marginLeft: `${depth * 20}px` }}
      >
        <div className="flex items-center text-sm">
          <img
            src={comment.author.avatar || Demo_Image}
            alt={comment.author.userName}
            className="w-8 h-8 rounded-full mr-2"
          />
          <Link
            href={`/${comment.author.userName}`}
            className="text-blue-500 no-underline"
          >
            {comment.author.userName}
          </Link>
        </div>
        <p>{comment.content}</p>
        <div className="flex space-x-2 mt-2">
          <button
            onClick={() => handleLikeToggle(null, comment._id)}
            className="bg-green-500 text-white p-1 rounded text-sm flex items-center"
          >
            <Heart className="w-5 h-5 mr-1" /> {comment.likes?.length || 0}
          </button>
          {user && (
            <button
              onClick={() => setReplyTo(comment._id)}
              className="bg-blue-500 text-white p-1 rounded text-sm flex items-center"
            >
              <Reply className="w-5 h-5 mr-1" /> Reply
            </button>
          )}
          {(user?._id === comment.author._id || user?.role === "admin") && (
            <button
              onClick={() => handleDeleteComment(comment._id)}
              className="bg-gray-500 text-white p-1 rounded text-sm flex items-center"
            >
              <Trash2 className="w-5 h-5 mr-1" /> Delete
            </button>
          )}
        </div>
        {replyTo === comment._id && (
          <div className="mt-2">
            <textarea
              placeholder="Add a reply..."
              value={replyComment}
              onChange={(e) => setReplyComment(e.target.value)}
              className="w-full p-2 border rounded h-16"
            />
            <div className="flex space-x-2">
              <button
                onClick={(e) => handleReply(e, comment._id)}
                className="bg-blue-500 text-white p-2 rounded flex items-center"
              >
                <Send className="w-5 h-5 mr-1" /> Send
              </button>
              <button
                onClick={() => setReplyTo(null)}
                className="bg-gray-500 text-white p-2 rounded flex items-center"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">
            {renderComments(comment.replies, depth + 1)}
          </div>
        )}
      </div>
    ));
  };

  console.log("user:", user);
  if (loading) return <div>Loading authentication...</div>;
  if (!post && !error) return <div>Loading post...</div>;

  return (
    <div className="container mx-auto p-4">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {post && (
        <>
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <div className="mb-4">
            <div className="flex items-center text-sm">
              <img
                src={post.author.avatar || Demo_Image}
                alt={post.author.userName}
                className="w-8 h-8 rounded-full mr-2"
              />
              <Link
                href={`/${post.author.userName}`}
                className="text-blue-500 no-underline"
              >
                {post.author.userName}
              </Link>
            </div>
            <p className="mb-4">{post.content}</p>
            {post.image && (
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-64 object-cover mb-4"
              />
            )}
          </div>
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => handleLikeToggle(params.id, null)}
              className="bg-green-500 text-white p-2 rounded flex items-center"
            >
              <Heart className="w-5 h-5 mr-1" /> {post.likes?.length || 0}
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="bg-blue-500 text-white p-2 rounded flex items-center"
            >
              <MessageCircle className="w-5 h-5 mr-1" /> Comments
            </button>
            {(user?._id === post.author._id || user?.role === "admin") && (
              <button
                onClick={handleDeletePost}
                className="bg-gray-500 text-white p-2 rounded flex items-center"
              >
                <Trash2 className="w-5 h-5 mr-1" /> Delete
              </button>
            )}
          </div>
          {showComments && (
            <>
              <h2 className="text-2xl font-bold mb-4">Comments</h2>
              {user && (
                <div className="mb-4">
                  <textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-2 border rounded h-24"
                  />
                  <button
                    onClick={handleComment}
                    className="bg-blue-500 text-white p-2 rounded mt-2 flex items-center"
                  >
                    <Send className="w-5 h-5 mr-1" /> Send
                  </button>
                </div>
              )}
              <div className="space-y-4">{renderComments(comments)}</div>
            </>
          )}
        </>
      )}
    </div>
  );
}
