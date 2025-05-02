"use client";

import { API_URL } from "@/server";
import axios from "axios";
import { MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function ClientPostPage({ post, initialComments, postId }) {
  const [comments, setComments] = useState(initialComments || []);
  const [replyingTo, setReplyingTo] = useState(null); // Track parentCommentId for replies

  // Form for new comment
  const {
    register: registerComment,
    handleSubmit: handleCommentSubmit,
    reset: resetComment,
    formState: { errors: commentErrors },
  } = useForm();

  // Form for reply
  const {
    register: registerReply,
    handleSubmit: handleReplySubmit,
    reset: resetReply,
    formState: { errors: replyErrors },
  } = useForm();

  // Handle new comment submission
  const onSubmitComment = async (data) => {
    try {
      const response = await axios.post(
        `${API_URL}/comments`,
        {
          content: data.content,
          postId,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setComments([response.data.data, ...comments]);
      resetComment();
      toast.success("Comment posted successfully!");
    } catch (error) {
      console.error("Error posting comment:", error);
      const message = error.response?.data?.message || "Failed to post comment";
      toast.error(message);
      if (error.response?.status === 401) {
        toast.error("Please log in to comment");
        // Optionally redirect to login
        // window.location.href = "/login";
      }
    }
  };

  // Handle reply submission
  const onSubmitReply = async (data, parentCommentId) => {
    try {
      const response = await axios.post(
        `${API_URL}/comments/replies`,
        {
          content: data.content,
          postId,
          parentCommentId,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setComments([response.data.data, ...comments]);
      resetReply();
      setReplyingTo(null);
      toast.success("Reply posted successfully!");
    } catch (error) {
      console.error("Error posting reply:", error);
      const message = error.response?.data?.message || "Failed to post reply";
      toast.error(message);
      if (error.response?.status === 401) {
        toast.error("Please log in to reply");
        // Optionally redirect to login
        // window.location.href = "/login";
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="mb-6 text-gray-700">{post.content}</p>

      {/* New comment form */}
      <form onSubmit={handleCommentSubmit(onSubmitComment)} className="mb-8">
        <textarea
          {...registerComment("content", {
            required: "Comment is required",
            minLength: {
              value: 2,
              message: "Comment must be at least 2 characters",
            },
          })}
          placeholder="Write a comment..."
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
        {commentErrors.content && (
          <p className="text-red-500 text-sm mt-1">
            {commentErrors.content.message}
          </p>
        )}
        <button
          type="submit"
          aria-label="Post comment"
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <Send className="w-4 h-4 mr-2" /> Post Comment
        </button>
      </form>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet. Be the first!</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className={`p-4 border rounded-md ${
                comment.parentComment ? "ml-6 bg-gray-50" : ""
              }`}
            >
              <p className="mb-2">
                <strong className="text-blue-600">
                  {comment.author.userName}
                </strong>
                : {comment.content}
              </p>
              <button
                onClick={() => setReplyingTo(comment._id)}
                aria-label={`Reply to ${comment.author.userName}'s comment`}
                className="text-blue-500 hover:underline flex items-center"
              >
                <MessageCircle className="w-4 h-4 mr-1" /> Reply
              </button>

              {/* Reply form */}
              {replyingTo === comment._id && (
                <form
                  onSubmit={handleReplySubmit((data) =>
                    onSubmitReply(data, comment._id)
                  )}
                  className="mt-4"
                >
                  <textarea
                    {...registerReply("content", {
                      required: "Reply is required",
                      minLength: {
                        value: 2,
                        message: "Reply must be at least 2 characters",
                      },
                    })}
                    placeholder="Write a reply..."
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                  {replyErrors.content && (
                    <p className="text-red-500 text-sm mt-1">
                      {replyErrors.content.message}
                    </p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <button
                      type="submit"
                      aria-label="Post reply"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                    >
                      <Send className="w-4 h-4 mr-2" /> Post Reply
                    </button>
                    <button
                      type="button"
                      onClick={() => setReplyingTo(null)}
                      aria-label="Cancel reply"
                      className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
