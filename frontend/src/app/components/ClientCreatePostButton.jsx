"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function ClientCreatePostButton() {
  const { user } = useAuth();
  return (
    user && (
      <Link
        href="/posts/create"
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        aria-label="Create a new post"
      >
        Create Post
      </Link>
    )
  );
}
