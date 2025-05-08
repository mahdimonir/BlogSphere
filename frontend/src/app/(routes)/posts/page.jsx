"use client";

import PostCard from "@/app/components/PostCard";
import axiosInstance from "@/app/utils/axiosConfig";
import { useEffect, useState } from "react";

export default function PostsPage() {
  const [posts, setPosts] = useState([]); // Default to an empty array
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axiosInstance.get("/posts");
      const fetchedPosts = response.data?.data?.posts || [];
      setPosts(fetchedPosts);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching posts");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        {error && (
          <p className="text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20 p-3 rounded-md mb-6 text-center">
            {error}
          </p>
        )}
        {loading && !error && (
          <div className="flex items-center justify-center h-screen text-gray-600 dark:text-gray-300">
            Loading...
          </div>
        )}
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          All Posts
        </h2>
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(
              (post) => (
                console.log("posts", post),
                (<PostCard key={post._id} post={post} />)
              )
            )}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-300 text-center">
            No posts available.
          </p>
        )}
      </main>
    </div>
  );
}
