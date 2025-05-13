"use client";

import { useAuth } from "@/context/AuthContext";
import { Edit, FileText, Home, Plus, Shield } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <div className="w-64 bg-gray-100 dark:bg-gray-800 p-4 h-screen fixed">
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>
      <nav className="space-y-2">
        <Link
          href="/profile"
          className="flex items-center p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <Home className="h-5 w-5 mr-2" /> Profile
        </Link>
        <Link
          href="/profile/posts"
          className="flex items-center p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <FileText className="h-5 w-5 mr-2" /> Posts
        </Link>
        <Link
          href="/profile/create"
          className="flex items-center p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <Plus className="h-5 w-5 mr-2" /> Create Post
        </Link>
        <Link
          href="/profile/edit"
          className="flex items-center p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <Edit className="h-5 w-5 mr-2" /> Edit Profile
        </Link>
        {user?.role === "admin" && (
          <Link
            href="/profile/suspended"
            className="flex items-center p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <Shield className="h-5 w-5 mr-2" /> Suspended
          </Link>
        )}
      </nav>
    </div>
  );
}
