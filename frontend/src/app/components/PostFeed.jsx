"use client";

import axiosInstance from "@/app/utils/axiosConfig";
import { useAuth } from "@/context/AuthContext";
import { useCallback, useEffect, useState } from "react";
import Error from "./Error";
import FilterBar from "./FilterBar";
import Loading from "./Loading";
import PostCard from "./PostCard";

export default function PostFeed({
  initialPosts,
  defaultCategory,
  isAdminView = false,
}) {
  const { user } = useAuth();
  const [posts, setPosts] = useState(initialPosts || []);
  const [activeCategory, setActiveCategory] = useState(
    defaultCategory || "All"
  );
  const [sortBy, setSortBy] = useState("Newest");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 9;

  // Fetch posts from server
  const fetchPosts = useCallback(
    async (category, sort, pageNum) => {
      try {
        setLoading(true);
        setError(null);

        const params = { page: pageNum, limit };
        if (category !== "All") params.catagory = category;

        if (sort) {
          let sortField = sort.toLowerCase().replace(" ", "_");
          let order = "desc";
          if (sortField === "newest") {
            sortField = "createdAt";
            order = "desc";
          }
          if (sortField === "oldest") {
            sortField = "createdAt";
            order = "asc";
          }
          if (sortField === "most_liked") {
            sortField = "likeCount";
            order = "desc";
          }
          if (sortField === "most_commented") {
            sortField = "commentCount";
            order = "desc";
          }
          params.sort = sortField;
          params.order = order;
        }

        const endpoint =
          isAdminView && user?.role === "admin" ? "/posts/pending" : "/posts";
        const response = await axiosInstance.get(endpoint, { params });

        const fetchedPosts = response.data.data.posts || [];
        setPosts(fetchedPosts);
        setTotalPages(response.data.data.totalPages || 1);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to load posts";
        console.error("Fetch error:", err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [isAdminView, user?.role]
  );

  // Handle post deletion
  const handlePostDeleted = useCallback((postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  }, []);

  // Fetch posts when category, sort, or page changes
  useEffect(() => {
    fetchPosts(activeCategory, sortBy, page);
  }, [fetchPosts, activeCategory, sortBy, page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (error) {
    return <Error errMessage={error} />;
  }
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full">
      <FilterBar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      {posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onPostDeleted={handlePostDeleted}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-800 dark:text-gray-100">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 py-4">
          No posts available.
        </div>
      )}
    </div>
  );
}
