"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PostDetail({ params }) {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");
  const { user, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, []);

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/posts/${params.id}`);
      if (!res.ok) throw new Error("Failed to fetch post");
      const data = await res.json();
      setPost(data);
    } catch (err) {
      setError("Error fetching post");
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments/${params.id}`);
      if (!res.ok) throw new Error("Failed to fetch comments");
      const data = await res.json();
      setComments(data);
    } catch (err) {
      setError("Error fetching comments");
    }
  };

  const handleLike = async () => {
    try {
      const res = await fetch(`/api/posts/like/${params.id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchPost();
      }
    } catch (err) {
      setError("Error liking post");
    }
  };

  const handleDislike = async () => {
    try {
      const res = await fetch(`/api/posts/dislike/${params.id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchPost();
      }
    } catch (err) {
      setError("Error disliking post");
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment, postId: params.id }),
      });
      if (res.ok) {
        setNewComment("");
        fetchComments();
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (err) {
      setError("Error adding comment");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/posts/${params.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        router.push("/");
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (err) {
      setError("Error deleting post");
    }
  };

  if (!post && !error) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {post && (
        <>
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-64 object-cover mb-4"
            />
          )}
          <p className="mb-4">{post.content}</p>
          <p className="text-sm mb-4">By {post.author.name}</p>
          <div className="flex space-x-4 mb-4">
            <button
              onClick={handleLike}
              className="bg-green-500 text-white p-2 rounded"
            >
              Like ({post.likes.length})
            </button>
            <button
              onClick={handleDislike}
              className="bg-red-500 text-white p-2 rounded"
            >
              Dislike ({post.dislikes.length})
            </button>
            {(user?.id === post.author._id || user?.role === "admin") && (
              <button
                onClick={handleDelete}
                className="bg-gray-500 text-white p-2 rounded"
              >
                Delete
              </button>
            )}
          </div>
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
                className="bg-blue-500 text-white p-2 rounded mt-2"
              >
                Comment
              </button>
            </div>
          )}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment._id} className="border p-4 rounded">
                <p>{comment.content}</p>
                <p className="text-sm">By {comment.author.name}</p>
                {(user?.id === comment.author._id ||
                  user?.role === "admin") && (
                  <button
                    onClick={async () => {
                      try {
                        await fetch(`/api/comments/${comment._id}`, {
                          method: "DELETE",
                          headers: { Authorization: `Bearer ${token}` },
                        });
                        fetchComments();
                      } catch (err) {
                        setError("Error deleting comment");
                      }
                    }}
                    className="bg-gray-500 text-white p-1 rounded mt-2"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
