"use client";

import {
  calculateReadTime,
  capitalizeFirstLetter,
  formatDate,
  formatNumber,
} from "@/app/configs/constants";
import axiosInstance from "@/app/utils/axiosConfig";
import { useAuth } from "@/context/AuthContext";
import { HeartIcon, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Demo_Image, Demo_Image2 } from "../assets/demo";

export default function PostCard({ post, compact = false, onClick }) {
  const {
    title = "Untitled Post",
    content = "",
    image = Demo_Image2,
    author = { userName: "Unknown", avatar: Demo_Image },
    _id,
    catagory = ["General"],
    createdAt,
    likeCount = 0,
    commentCount = 0,
    likes = [],
    isLiked = false,
  } = post;

  const { user } = useAuth();
  const initialIsLiked =
    isLiked || likes.some((like) => like.likedBy._id === user?._id);

  const [likesState, setLikes] = useState(likeCount);
  const [liked, setLiked] = useState(initialIsLiked);

  const handleLikeToggle = async () => {
    const optimisticLiked = !liked;
    const optimisticLikes = optimisticLiked ? likesState + 1 : likesState - 1;

    setLiked(optimisticLiked);
    setLikes(optimisticLikes);

    try {
      const response = await axiosInstance.patch(`/likes/toggle`, {
        postId: _id,
      });

      if (response.status === 200 || response.status === 201) {
        setLiked(response.data.data.isLiked);
        setLikes(response.data.data.likeCount);
      } else {
        setLiked(!optimisticLiked);
        setLikes(likesState);
      }
    } catch (error) {
      console.error(
        "Error toggling like:",
        error.response?.data?.message || error.message
      );
      setLiked(!optimisticLiked);
      setLikes(likesState);
    }
  };

  const secureImageUrl =
    image && typeof image === "string" && image.startsWith("http://")
      ? image.replace("http://", "https://")
      : image || Demo_Image2;

  const filteredCategories = catagory
    .filter((category) => category.toLowerCase() !== "trending")
    .slice(0, 1);

  const displayCategories =
    filteredCategories.length > 0 ? filteredCategories : ["General"];

  return (
    <div
      className={`rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white transition-shadow hover:shadow-lg`}
    >
      <Link href={`/posts/${_id}`} onClick={onClick}>
        <div className="relative">
          <Image
            src={secureImageUrl}
            alt={title}
            width={400}
            height={300}
            className={`w-full ${compact ? "h-32" : "h-48"} object-cover`}
            unoptimized
          />
          <div className="absolute top-3 left-3">
            {displayCategories.map((category, index) => (
              <span
                key={index}
                className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-1 px-3 rounded-full text-xs font-medium"
              >
                {capitalizeFirstLetter(category)}
              </span>
            ))}
          </div>
        </div>

        <div className={`p-4 ${compact ? "pb-2" : ""}`}>
          {!compact && createdAt && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex justify-between">
              <span>{formatDate(createdAt)}</span>
              <span>{calculateReadTime(content)}</span>
            </div>
          )}

          <h3 className={`font-bold ${compact ? "text-sm" : "text-lg"} mb-2`}>
            {title}
          </h3>

          {!compact && content && (
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
              {content.slice(0, 100) + (content.length > 100 ? "..." : "")}
            </p>
          )}
        </div>
      </Link>
      <div className={`p-4 ${compact ? "pb-2" : ""}`}>
        <div className="flex items-center justify-between mx-2">
          <Link href={`/profile/${author.userName}`}>
            <div className="flex items-center gap-2">
              <Image
                src={author.avatar || Demo_Image}
                alt={author.userName}
                width={24}
                height={24}
                className="rounded-full h-6 w-6 object-cover"
              />
              <span className="text-sm hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                {capitalizeFirstLetter(author.userName)}
              </span>
            </div>
          </Link>

          {!compact && (
            <>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLikeToggle}
                  className="flex items-center text-sm text-gray-700 dark:text-gray-200"
                >
                  <HeartIcon
                    size={20}
                    fill={liked ? "red" : "none"}
                    className={`mr-1 ${
                      liked
                        ? "text-red-500"
                        : "text-gray-700 dark:text-gray-200"
                    }`}
                  />
                  {formatNumber(likesState)}
                </button>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 dark:text-gray-300 flex items-center">
                  <MessageCircle size={20} className="mr-1" />
                  {formatNumber(commentCount)}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
