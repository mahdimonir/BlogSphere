"use client";

import { capitalizeFirstLetter } from "@/app/configs/constants";
import axiosInstance from "@/app/utils/axiosConfig";
import { useAuth } from "@/context/AuthContext";
import { Ban, CheckCircle, Edit, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Demo_Image } from "../assets/demo";

export default function UserCard({ user, onClick }) {
  const { user: currentUser, loading: authLoading } = useAuth();
  const [isSuspended, setIsSuspended] = useState(user.isSuspended || false);
  const [suspending, setSuspending] = useState(false);
  const [error, setError] = useState(null);

  const {
    name = "Unknown User",
    userName = "unknown",
    avatar = Demo_Image,
  } = user;

  // Ensure the avatar URL uses https if possible
  const secureAvatarUrl =
    avatar && typeof avatar === "string" && avatar.startsWith("http://")
      ? avatar.replace("http://", "https://")
      : avatar || Demo_Image;

  const handleSuspend = async () => {
    if (!currentUser || currentUser.role !== "admin") return;
    setSuspending(true);
    setError(null);
    try {
      const response = await axiosInstance.patch(`/admin/suspend/${userName}`);
      setIsSuspended(response.data.data.isSuspended);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update suspension status"
      );
      console.error(err);
    } finally {
      setSuspending(false);
    }
  };

  return (
    <div className="rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white transition-shadow hover:shadow-lg">
      {/* Avatar Section */}
      <div className="relative">
        <div className="flex justify-center items-center my-4">
          {secureAvatarUrl ? (
            <Image
              src={secureAvatarUrl}
              alt={userName}
              width={80}
              height={80}
              className="object-cover rounded-full border-2 border-gray-200 dark:border-gray-700"
              unoptimized
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl font-bold">
              {userName[0]?.toUpperCase() || "?"}
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 text-center">
        {/* Name */}
        <h3 className="font-bold text-lg mb-1">
          {capitalizeFirstLetter(name || userName)}
        </h3>

        {/* Username */}
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          @{capitalizeFirstLetter(userName)}
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Link
            href={`/users/${userName}`}
            onClick={onClick}
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 text-sm"
          >
            View Profile
          </Link>

          {/* Edit Button (Owner) */}
          {!authLoading && currentUser && currentUser.userName === userName && (
            <Link
              href="/profile/edit"
              className="inline-block px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 text-sm flex items-center justify-center gap-2"
            >
              <Edit className="h-4 w-4" /> Edit Profile
            </Link>
          )}

          {/* Suspend Button (Admin) */}
          {!authLoading &&
            currentUser &&
            currentUser.role === "admin" &&
            currentUser.userName !== userName && (
              <button
                onClick={handleSuspend}
                disabled={suspending}
                className={`px-4 py-2 rounded-full text-sm flex items-center justify-center gap-2 ${
                  isSuspended
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-red-500 text-white hover:bg-red-600"
                } ${suspending ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {suspending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isSuspended ? (
                  <>
                    <CheckCircle className="h-4 w-4" /> Unsuspend
                  </>
                ) : (
                  <>
                    <Ban className="h-4 w-4" /> Suspend
                  </>
                )}
              </button>
            )}
        </div>

        {/* Error Message */}
        {error && (
          <p className="mt-2 text-red-600 dark:text-red-400 text-xs">{error}</p>
        )}
      </div>
    </div>
  );
}
