"use client";

import PostCard from "@/app/components/PostCard";
import Sidebar from "@/app/components/Sidebar";
import axiosInstance from "@/app/utils/axiosConfig";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Posts() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activePosts, setActivePosts] = useState([]);
  const [draftPosts, setDraftPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    if (user) {
      const fetchPosts = async () => {
        try {
          const [activeRes, draftRes] = await Promise.all([
            axiosInstance.get(
              `/posts?author=${user.userName}&status=published`
            ),
            axiosInstance.get(`/posts?author=${user.userName}&status=draft`),
          ]);
          setActivePosts(activeRes.data.data.posts || []);
          setDraftPosts(draftRes.data.data.posts || []);
        } catch (err) {
          setError(err.response?.data?.message || "Failed to fetch posts");
        }
      };
      fetchPosts();
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 p-4 w-full">
        <h1 className="text-2xl font-bold mb-4">My Posts</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <h2 className="text-xl font-semibold mb-2">Active Posts</h2>
        <div className="grid gap-4 mb-8">
          {activePosts.length > 0 ? (
            activePosts.map((post) => <PostCard key={post._id} post={post} />)
          ) : (
            <p className="text-gray-500">No active posts</p>
          )}
        </div>
        <h2 className="text-xl font-semibold mb-2">Draft/Pending Posts</h2>
        <div className="grid gap-4">
          {draftPosts.length > 0 ? (
            draftPosts.map((post) => <PostCard key={post._id} post={post} />)
          ) : (
            <p className="text-gray-500">No draft posts</p>
          )}
        </div>
      </div>
    </div>
  );
}
