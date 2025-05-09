"use client";

import {
  calculateReadTime,
  capitalizeFirstLetter,
  formatDate,
  formatNumber,
} from "@/app/configs/constants";
import { HeartIcon, MessageCircle } from "lucide-react"; // Adjust import path if necessary
import Image from "next/image";
import Link from "next/link";
import { Demo_Image, Demo_Image2 } from "../assets/demo";

export default function PostCard({ post }) {
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
  } = post;

  // Ensure the image URL uses https if possible
  const secureImageUrl = image.startsWith("http://")
    ? image.replace("http://", "https://")
    : image;

  // Filter out 'Trending' and limit to 1 category for display
  const filteredCategories = catagory
    .filter((category) => category.toLowerCase() !== "trending")
    .slice(0, 1);

  // Default to 'General' if no categories remain
  const displayCategories =
    filteredCategories.length > 0 ? filteredCategories : ["General"];

  return (
    <Link href={`/posts/${_id}`}>
      <div className="rounded-lg overflow-hidden bg-black text-white transition-shadow hover:shadow-lg">
        {/* Image Section */}
        <div className="relative">
          <Image
            src={secureImageUrl}
            alt={title}
            width={400}
            height={300}
            className="w-full h-48 object-cover"
            unoptimized
          />
          <div className="absolute top-3 left-3">
            {displayCategories.map((category, index) => (
              <span
                key={index}
                className="bg-white text-black py-1 px-3 rounded-full text-xs font-medium"
              >
                {capitalizeFirstLetter(category)}
              </span>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Date and Read Time */}
          {createdAt && (
            <div className="text-xs text-gray-400 mb-2 flex justify-between">
              <span>{formatDate(createdAt)}</span>
              <span>{calculateReadTime(content)}</span>
            </div>
          )}

          {/* Title */}
          <h3 className="font-bold text-lg mb-2">{title}</h3>

          {/* Description */}
          {content && (
            <p className="text-gray-300 text-sm mb-4 line-clamp-2">
              {content.slice(0, 100) + (content.length > 100 ? "..." : "")}
            </p>
          )}

          {/* Author, Likes, and Comments */}
          <div className="flex items-center justify-between mx-2">
            {/* Author */}
            <div className="flex items-center gap-2">
              <Image
                src={author.avatar}
                alt={author.userName}
                width={24}
                height={24}
                className="rounded-full h-6 w-6 object-cover"
              />
              <span className="text-sm text-white">
                {capitalizeFirstLetter(author.userName)}
              </span>
            </div>

            {/* Likes and Comments */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-300 flex items-center">
                <HeartIcon size={20} className="mr-1" />
                {formatNumber(likeCount)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-300 flex items-center">
                <MessageCircle size={20} className="mr-1" />
                {formatNumber(commentCount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
