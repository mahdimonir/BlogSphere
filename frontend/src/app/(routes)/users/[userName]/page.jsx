"use client";

import PostCard from "@/app/components/PostCard";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/server";
import axios from "axios";
import { Loader2, UserMinus, UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserProfile() {
  const { userName } = useParams();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/users/${userName}`, {
          withCredentials: true,
        });
        const { data } = response.data;
        setProfile(data);
        setPosts(data.posts || []);
        if (user) {
          const followingResponse = await axios.get(
            `${API_URL}/users/${userName}/follow`,
            {
              withCredentials: true,
            }
          );
          setIsFollowing(followingResponse.data.data.isFollowing);
        }
      } catch (err) {
        setError("Failed to load profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userName, user]);

  const handleFollow = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    try {
      const response = await axios.patch(
        `${API_URL}/users/${userName}/follow`,
        {},
        { withCredentials: true }
      );
      setIsFollowing(response.data.data.isFollowing);
    } catch (err) {
      console.error("Follow error:", err);
      setError("Failed to update follow status");
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="text-center py-10 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <p>{error || "User not found"}</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
        <div className="relative w-24 h-24 md:w-32 md:h-32">
          {profile.avatar ? (
            <Image
              src={profile.avatar}
              alt={profile.userName}
              fill
              className="rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl font-bold">
              {profile.userName[0].toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold">
            {profile.name || profile.userName}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            @{profile.userName}
          </p>
          {profile.bio && (
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {profile.bio}
            </p>
          )}
          <div className="mt-4 flex gap-4 justify-center md:justify-start">
            <p>{posts.length} Posts</p>
            <p>{profile.followers?.length || 0} Followers</p>
            <p>{profile.following?.length || 0} Following</p>
          </div>
          {user && user.userName !== profile.userName && (
            <button
              onClick={handleFollow}
              className={`mt-4 px-4 py-2 rounded-full flex items-center gap-2 ${
                isFollowing
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {isFollowing ? (
                <>
                  <UserMinus className="h-5 w-5" /> Unfollow
                </>
              ) : (
                <>
                  <UserPlus className="h-5 w-5" /> Follow
                </>
              )}
            </button>
          )}
          {user && user.userName === profile.userName && (
            <Link
              href="/profile/edit"
              className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
            >
              Edit Profile
            </Link>
          )}
        </div>
      </div>

      {/* Posts */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Posts</h2>
        {posts.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No posts yet.</p>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
