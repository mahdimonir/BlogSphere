"use client";

import { calculateReadTime, formatDate } from "@/app/configs/constants";
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
    category = "General",
    createdAt,
  } = post;

  // Ensure the image URL uses https if possible
  const secureImageUrl = image.startsWith("http://")
    ? image.replace("http://", "https://")
    : image;

  return (
    <Link href={`/posts/${_id}`}>
      <div className="rounded-lg overflow-hidden shadow-md dark:shadow-neutral-950 transition-shadow hover:shadow-lg">
        <div className="relative">
          <Image
            src={image} // Use the secure URL
            alt={title}
            width={400}
            height={300}
            className="w-full h-75 object-cover"
            unoptimized // Skip optimization for debugging
          />
          <div className="absolute top-3 left-3">
            <span className="bg-white dark:bg-gray-700 py-1 px-3 rounded-full text-xs font-medium text-gray-800 dark:text-gray-100">
              {category}
            </span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-100">
            {title}
          </h3>
          {content && (
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
              {content.slice(0, 100) + (content.length > 100 ? "..." : "")}
            </p>
          )}

          <div className="flex items-center justify-between">
            {/* <Link href={`/users/${author?._id}`}> */}
            <div className="flex items-center gap-2">
              <img
                src={author.avatar}
                alt={author.userName}
                width={25}
                height={25}
                className="rounded-full h-6 w-6 object-cover"
              />
              <span className="hover:text-blue-500 dark:hover:text-blue-400 no-underline text-gray-700 dark:text-gray-200">
                {author.userName}
              </span>
            </div>
            {/* </Link> */}
            {createdAt && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(createdAt)} · {calculateReadTime(content)}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
