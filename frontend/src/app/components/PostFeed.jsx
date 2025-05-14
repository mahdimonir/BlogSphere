"use client";

import axiosInstance from "@/app/utils/axiosConfig";
import { useAuth } from "@/context/AuthContext";
import { useCallback, useEffect, useState } from "react";
import Error from "./Error";
import FilterBar from "./FilterBar";
import Loading from "./Loading";
import PostCard from "./PostCard";

export default function PostFeed({
  initialPosts = [],
  defaultCategory = "All",
  isAdminView = false,
}) {
  const { user } = useAuth();
  const [posts, setPosts] = useState(initialPosts);
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  const [sortBy, setSortBy] = useState("Newest");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Fetch posts from the server
  const fetchPosts = useCallback(async () => {
    try {
      // setLoading(true);
      setError(null);

      const params = { page, limit };
      if (activeCategory !== "All") params.catagory = activeCategory;

      if (sortBy) {
        let sortField = "";
        let order = "desc";

        if (sortBy === "Newest") {
          sortField = "createdAt";
        } else if (sortBy === "Oldest") {
          sortField = "createdAt";
          order = "asc";
        } else if (sortBy === "Most Liked") {
          sortField = "likeCount";
        } else if (sortBy === "Most Commented") {
          sortField = "commentCount";
        }

        params.sort = sortField;
        params.order = order;
      }

      const endpoint =
        isAdminView && user?.role === "admin" ? "/posts/pending" : "/posts";
      const response = await axiosInstance.get(endpoint, { params });

      setPosts(response.data.data.posts || []);
      setTotalPages(response.data.data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching posts:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to load posts.");
    } finally {
      setLoading(false);
    }
  }, [activeCategory, sortBy, page, isAdminView, user?.role]);

  // Fetch posts when category, sort, or page changes
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

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
      {/* { posts.length > 0 ? ( */}
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
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
      {/* ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 py-4">
          No posts available.
        </div>
      )} */}
    </div>
  );
}
