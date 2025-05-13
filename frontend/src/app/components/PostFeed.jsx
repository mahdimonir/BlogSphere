"use client";

import axiosInstance from "@/app/utils/axiosConfig";
import { useCallback, useEffect, useState } from "react";
import Error from "./Error";
import FilterBar from "./FilterBar";
import Loading from "./Loading";
import PostCard from "./PostCard";

export default function PostFeed({ initialPosts, defaultCategory }) {
  const [posts, setPosts] = useState(initialPosts || []);
  const [activeCategory, setActiveCategory] = useState(
    defaultCategory || "All"
  );
  const [sortBy, setSortBy] = useState("Newest");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch posts from server when needed
  const fetchPosts = useCallback(async (category, sort) => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
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
          sortField = "likes";
          order = "desc";
        }
        if (sortField === "most_commented") {
          sortField = "comments";
          order = "desc";
        }
        params.sort = sortField;
        params.order = order;
      }

      const response = await axiosInstance.get("/posts", { params });

      const fetchedPosts = response.data.data.posts || [];
      setPosts(fetchedPosts);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to load posts";
      console.error("Fetch error:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Client-side filtering and sorting
  const updatePosts = useCallback(() => {
    let updatedPosts = [...initialPosts];

    // Filter by category
    if (activeCategory !== "All") {
      updatedPosts = updatedPosts.filter((post) =>
        post.catagory.includes(activeCategory)
      );
    }

    // Sort posts
    switch (sortBy) {
      case "Newest":
        updatedPosts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      case "Oldest":
        updatedPosts.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        break;
      case "Most Liked":
        updatedPosts.sort(
          (a, b) =>
            (b.likeCount || b.likes || 0) - (a.likeCount || a.likes || 0)
        );
        break;
      case "Most Commented":
        updatedPosts.sort(
          (a, b) =>
            (b.commentCount || b.comments?.length || 0) -
            (a.commentCount || a.comments?.length || 0)
        );
        break;
      default:
        break;
    }

    setPosts(updatedPosts);

    // If no posts after filtering and initialPosts is non-empty, fetch from server
    if (updatedPosts.length === 0 && initialPosts?.length > 0) {
      fetchPosts(activeCategory, sortBy);
    }
  }, [initialPosts, activeCategory, sortBy, fetchPosts]);

  // Update posts when category or sort changes
  useEffect(() => {
    // Use initialPosts if available and matches filters
    if (
      initialPosts?.length > 0 &&
      (activeCategory === defaultCategory || activeCategory === "All") &&
      sortBy === "Newest"
    ) {
      setPosts(initialPosts);
      setLoading(false);
    } else {
      // Apply client-side filtering/sorting
      updatePosts();
    }
  }, [initialPosts, defaultCategory, activeCategory, sortBy, updatePosts]);

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 py-4">
          No posts available.
        </div>
      )}
    </div>
  );
}
