"use client";

import Loading from "@/app/components/Loading";
import PostCard from "@/app/components/PostCard";
import UserCard from "@/app/components/UserCard";
import axiosInstance from "@/app/utils/axiosConfig";
import { useAuth } from "@/context/AuthContext";
import { Ban, CheckCircle, UserMinus, UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Profile Actions Component
const ProfileActions = ({
  user,
  profile,
  isFollowing,
  handleFollow,
  handleSuspend,
}) => {
  if (!user) return null;
  const isOwnProfile = user.userName === profile.userName;
  const isAdmin = user.role === "admin";

  return (
    <div className="mt-4 flex gap-4">
      {isOwnProfile ? (
        <Link
          href="/profile/edit"
          className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
          aria-label="Edit Profile"
        >
          Edit Profile
        </Link>
      ) : (
        <button
          onClick={handleFollow}
          className={`px-4 py-2 rounded-full flex items-center gap-2 ${
            isFollowing
              ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
          aria-label={isFollowing ? "Unfollow" : "Follow"}
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
      {isAdmin && !isOwnProfile && (
        <button
          onClick={handleSuspend}
          className={`px-4 py-2 rounded-full flex items-center gap-2 ${
            profile.isSuspended
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-red-500 text-white hover:bg-red-600"
          }`}
          aria-label={profile.isSuspended ? "Unsuspend User" : "Suspend User"}
        >
          <Ban className="h-5 w-5" />
          {profile.isSuspended ? "Unsuspend" : "Suspend"}
        </button>
      )}
    </div>
  );
};

// User Details Component
const UserDetails = ({ profile }) => {
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="mt-4 text-gray-600 dark:text-gray-400">
      <p>
        <strong>Email:</strong> {profile.email}
      </p>
      <p>
        <strong>Role:</strong> {profile.role}
      </p>
      <p className="flex items-center gap-2">
        <strong>Verified:</strong>
        {profile.isVerified ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <span>Not Verified</span>
        )}
      </p>
      <p>
        <strong>Status:</strong> {profile.isSuspended ? "Suspended" : "Active"}
      </p>
      <p>
        <strong>Joined:</strong> {formatDate(profile.createdAt)}
      </p>
      <p>
        <strong>Last Updated:</strong> {formatDate(profile.updatedAt)}
      </p>
    </div>
  );
};

export default function UserProfile() {
  const { userName } = useParams();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get(`/users/${userName}`);
        const profileData = response.data.data;
        setProfile(profileData);
        setPosts(profileData.posts || []);
        setIsFollowing(
          user &&
            profileData.followers.some((f) => f.userName === user.userName)
        );
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
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
      const response = await axiosInstance.patch(
        `/users/${userName}/follow`,
        {}
      );
      setIsFollowing(response.data.data.isFollowing);
      setProfile((prev) => ({
        ...prev,
        followers: response.data.data.isFollowing
          ? [...prev.followers, { _id: user._id, userName: user.userName }]
          : prev.followers.filter((f) => f.userName !== user.userName),
      }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update follow status");
    }
  };

  const handleSuspend = async () => {
    try {
      const response = await axiosInstance.patch(
        `/admin/suspend/${userName}`,
        {}
      );
      setProfile((prev) => ({
        ...prev,
        isSuspended: response.data.data.isSuspended,
      }));
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update suspend status"
      );
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <Loading />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="text-center py-10 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <p className="text-red-500">{error || "User not found"}</p>
        <Link
          href="/users"
          className="mt-4 inline-block text-blue-500 hover:text-blue-600"
        >
          Back to Users
        </Link>
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
            <button
              onClick={() => setActiveTab("posts")}
              className="hover:text-blue-500"
              aria-label="View Posts"
            >
              {posts.length} Posts
            </button>
            <button
              onClick={() => setActiveTab("followers")}
              className="hover:text-blue-500"
              aria-label="View Followers"
            >
              {profile.followers?.length || 0} Followers
            </button>
            <button
              onClick={() => setActiveTab("following")}
              className="hover:text-blue-500"
              aria-label="View Following"
            >
              {profile.following?.length || 0} Following
            </button>
          </div>
          <ProfileActions
            user={user}
            profile={profile}
            isFollowing={isFollowing}
            handleFollow={handleFollow}
            handleSuspend={handleSuspend}
          />
          <UserDetails profile={profile} />
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8">
        <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 mb-4">
          <button
            className={`pb-2 px-4 ${
              activeTab === "posts"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-600 dark:text-gray-400"
            }`}
            onClick={() => setActiveTab("posts")}
            aria-selected={activeTab === "posts"}
          >
            Posts
          </button>
          <button
            className={`pb-2 px-4 ${
              activeTab === "followers"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-600 dark:text-gray-400"
            }`}
            onClick={() => setActiveTab("followers")}
            aria-selected={activeTab === "followers"}
          >
            Followers
          </button>
          <button
            className={`pb-2 px-4 ${
              activeTab === "following"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-600 dark:text-gray-400"
            }`}
            onClick={() => setActiveTab("following")}
            aria-selected={activeTab === "following"}
          >
            Following
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "posts" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Posts</h2>
            {posts.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">No posts yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === "followers" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Followers</h2>
            {profile.followers.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">
                No followers yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {profile.followers.map((follower) => (
                  <UserCard key={follower._id} user={follower} />
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === "following" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Following</h2>
            {profile.following.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">
                Not following anyone yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {profile.following.map((followed) => (
                  <UserCard key={followed._id} user={followed} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
