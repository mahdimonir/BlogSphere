"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");
  const { user, token, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      fetchUserPosts();
      if (user.role === "admin") {
        fetchAllUsers();
        fetchAllPosts();
        fetchAllComments();
      }
    }
  }, [user, router]);

  const fetchUserPosts = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/my`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      setError("Error fetching your posts");
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError("Error fetching users");
    }
  };

  const fetchAllPosts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`);
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      setAllPosts(data);
    } catch (err) {
      setError("Error fetching all posts");
    }
  };

  const fetchAllComments = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch comments");
      const data = await res.json();
      setComments(data);
    } catch (err) {
      setError("Error fetching comments");
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        setPosts(posts.filter((post) => post._id !== postId));
        setAllPosts(allPosts.filter((post) => post._id !== postId));
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (err) {
      setError("Error deleting post");
    }
  };

  const handleSuspendUser = async (userId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/suspend/${userId}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        setUsers(
          users.map((u) => (u._id === userId ? { ...u, isSuspended: true } : u))
        );
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (err) {
      setError("Error suspending user");
    }
  };

  const handleUnsuspendUser = async (userId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/unsuspend/${userId}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        setUsers(
          users.map((u) =>
            u._id === userId ? { ...u, isSuspended: false } : u
          )
        );
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (err) {
      setError("Error unsuspending user");
    }
  };

  const handleSuspendPost = async (postId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/suspend/${postId}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        setAllPosts(
          allPosts.map((p) =>
            p._id === postId ? { ...p, isSuspended: true } : p
          )
        );
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (err) {
      setError("Error suspending post");
    }
  };

  const handleUnsuspendPost = async (postId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/unsuspend/${postId}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        setAllPosts(
          allPosts.map((p) =>
            p._id === postId ? { ...p, isSuspended: false } : p
          )
        );
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (err) {
      setError("Error unsuspending post");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${commentId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        setComments(comments.filter((c) => c._id !== commentId));
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (err) {
      setError("Error deleting comment");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Dashboard</h1>
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
          role="alert"
        >
          {error}
        </div>
      )}
      {user && (
        <div className="space-y-12">
          {/* Profile Section */}
          <section className="bg-white shadow-lg rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p className="text-gray-700">
                <strong>Name:</strong> {user.name}
              </p>
              <p className="text-gray-700">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="text-gray-700">
                <strong>Role:</strong> {user.role}
              </p>
            </div>
            <button
              onClick={logout}
              className="mt-6 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
              aria-label="Log out"
            >
              Logout
            </button>
          </section>

          {/* User's Posts Section */}
          <section className="bg-white shadow-lg rounded-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Your Posts
              </h2>
              <Link
                href="/create"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                aria-label="Create a new post"
              >
                Create New Post
              </Link>
            </div>
            {posts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                You haven't created any posts yet.
              </p>
            ) : (
              <div className="grid gap-6">
                {posts.map((post) => (
                  <div
                    key={post._id}
                    className="border border-gray-200 rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex-1">
                      <Link href={`/posts/${post._id}`}>
                        <h3 className="text-xl font-bold text-blue-600 hover:underline">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 mt-2">
                        {post.content.substring(0, 100)}...
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Posted on{" "}
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex space-x-3">
                      <Link
                        href={`/edit/${post._id}`}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-200"
                        aria-label={`Edit post: ${post.title}`}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                        aria-label={`Delete post: ${post.title}`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Admin Section */}
          {user.role === "admin" && (
            <div className="space-y-12">
              {/* User Management */}
              <section className="bg-white shadow-lg rounded-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  User Management
                </h2>
                {users.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No users found.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="py-3 px-4 text-left text-gray-700 font-semibold">
                            Name
                          </th>
                          <th className="py-3 px-4 text-left text-gray-700 font-semibold">
                            Email
                          </th>
                          <th className="py-3 px-4 text-left text-gray-700 font-semibold">
                            Role
                          </th>
                          <th className="py-3 px-4 text-left text-gray-700 font-semibold">
                            Status
                          </th>
                          <th className="py-3 px-4 text-left text-gray-700 font-semibold">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u._id} className="border-t hover:bg-gray-50">
                            <td className="py-3 px-4 text-gray-700">
                              {u.name}
                            </td>
                            <td className="py-3 px-4 text-gray-700">
                              {u.email}
                            </td>
                            <td className="py-3 px-4 text-gray-700">
                              {u.role}
                            </td>
                            <td className="py-3 px-4 text-gray-700">
                              {u.isSuspended ? (
                                <span className="text-red-600">Suspended</span>
                              ) : (
                                <span className="text-green-600">Active</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {u.isSuspended ? (
                                <button
                                  onClick={() => handleUnsuspendUser(u._id)}
                                  className="bg-green-600 text-white px-4 py-1 rounded-lg hover:bg-green-700 transition-colors duration-200"
                                  aria-label={`Unsuspend user: ${u.name}`}
                                >
                                  Unsuspend
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleSuspendUser(u._id)}
                                  className="bg-red-600 text-white px-4 py-1 rounded-lg hover:bg-red-700 transition-colors duration-200"
                                  aria-label={`Suspend user: ${u.name}`}
                                >
                                  Suspend
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              {/* Post Moderation */}
              <section className="bg-white shadow-lg rounded-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  Post Moderation
                </h2>
                {allPosts.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No posts found.
                  </p>
                ) : (
                  <div className="grid gap-6">
                    {allPosts.map((post) => (
                      <div
                        key={post._id}
                        className="border border-gray-200 rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="flex-1">
                          <Link href={`/posts/${post._id}`}>
                            <h3 className="text-xl font-bold text-blue-600 hover:underline">
                              {post.title}
                            </h3>
                          </Link>
                          <p className="text-gray-600 mt-2">
                            {post.content.substring(0, 100)}...
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Posted by {post.author.name} on{" "}
                            {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            Status:{" "}
                            {post.isSuspended ? (
                              <span className="text-red-600">Suspended</span>
                            ) : (
                              <span className="text-green-600">Active</span>
                            )}
                          </p>
                        </div>
                        <div className="mt-4 md:mt-0 flex space-x-3">
                          {post.isSuspended ? (
                            <button
                              onClick={() => handleUnsuspendPost(post._id)}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                              aria-label={`Unsuspend post: ${post.title}`}
                            >
                              Unsuspend
                            </button>
                          ) : (
                            <button
                              onClick={() => handleSuspendPost(post._id)}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                              aria-label={`Suspend post: ${post.title}`}
                            >
                              Suspend
                            </button>
                          )}
                          <button
                            onClick={() => handleDeletePost(post._id)}
                            className="bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-900 transition-colors duration-200"
                            aria-label={`Delete post: ${post.title}`}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Comment Moderation */}
              <section className="bg-white shadow-lg rounded-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  Comment Moderation
                </h2>
                {comments.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No comments found.
                  </p>
                ) : (
                  <div className="grid gap-6">
                    {comments.map((comment) => (
                      <div
                        key={comment._id}
                        className="border border-gray-200 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <p className="text-gray-700">{comment.content}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          Commented by {comment.author.name} on{" "}
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          Status:{" "}
                          {comment.isSuspended ? (
                            <span className="text-red-600">Suspended</span>
                          ) : (
                            <span className="text-green-600">Active</span>
                          )}
                        </p>
                        <div className="mt-4 flex space-x-3">
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                            aria-label={`Delete comment by ${comment.author.name}`}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
