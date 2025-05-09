"use client";
import { API_URL } from "@/server";
import axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/pagination";
import Error from "./components/Error";
import FilterBar from "./components/FilterBar";
import HeroSection from "./components/HeroSection";
import Loading from "./components/Loading";
import PostCard from "./components/PostCard";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Newest"); // Add sortBy state
  const [posts, setPosts] = useState([]); // State to store fetched posts
  const [filteredBlogs, setFilteredBlogs] = useState([]); // State for filtered posts
  const [isSticky, setIsSticky] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch posts from the /posts/ endpoint
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true); // Start loading
        const response = await axios.get(`${API_URL}/posts/`, {
          withCredentials: true,
        });
        const postsData = response.data.data.posts; // Access the correct path in the response
        setPosts(postsData); // Set the posts state
        setFilteredBlogs(postsData); // Initialize filteredBlogs with all posts
        setLoading(false); // Stop loading
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to load posts. Please try again later."); // Set error message
        setLoading(false); // Stop loading
      }
    };

    fetchPosts();
  }, []);

  // Filter blogs based on the active category
  useEffect(() => {
    let filtered = posts;

    if (activeCategory !== "All") {
      filtered = posts.filter((post) => post.catagory.includes(activeCategory));
    }

    // Apply sorting
    if (sortBy === "Newest") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "Oldest") {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "Most Liked") {
      filtered.sort((a, b) => b.likeCount - a.likeCount);
    } else if (sortBy === "Most Commented") {
      filtered.sort((a, b) => b.commentCount - a.commentCount);
    }

    setFilteredBlogs(filtered);
  }, [activeCategory, sortBy, posts]);

  // Handle scroll for sticky button
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;

      if (scrollTop) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filter posts for HeroSection to only include 'Trending' category
  const trendingPosts = posts.filter((post) =>
    post.catagory.includes("Trending")
  );

  // Show loading state
  if (loading) {
    return <Loading />;
  }

  // Show error state
  if (error) {
    return <Error errMessage={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 transition-colors dark:bg-gray-900">
      <Head>
        <title>BlogSphere - Your Personal Blog Space</title>
        <meta
          name="description"
          content="Discover interesting blog posts from various categories"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="mx-auto">
        {Array.isArray(trendingPosts) && trendingPosts.length > 0 ? (
          <HeroSection posts={trendingPosts} />
        ) : (
          <div className="text-center text-gray-900 dark:text-gray-100 py-8">
            No featured posts available.
          </div>
        )}
        <main className="container mx-auto px-4 mt-8 md:mt-0">
          <FilterBar
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory} // Pass setActiveCategory to update category
            sortBy={sortBy}
            setSortBy={setSortBy} // Pass setSortBy to update sorting
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {Array.isArray(filteredBlogs) && filteredBlogs.length > 0 ? (
              filteredBlogs.map((post) => (
                <PostCard key={post._id} post={post} />
              ))
            ) : (
              <div className="text-center text-gray-900 dark:text-gray-100 col-span-full">
                No posts available.
              </div>
            )}
          </div>

          <div
            className={`flex justify-end pb-4 ${
              isSticky ? "sticky bottom-2 right-4" : ""
            }`}
          >
            <button
              className="px-4 py-2 bg-gray-200 hover:bg-blue-500 hover:text-white rounded-full cursor-pointer"
              onClick={scrollToTop}
            >
              Go Top
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
