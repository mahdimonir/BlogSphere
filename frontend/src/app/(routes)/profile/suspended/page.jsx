"use client";

import Loading from "@/app/components/Loading";
import Sidebar from "@/app/components/Sidebar";
import SuspendedList from "@/app/components/SuspendedList";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Suspended() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState(user?.role === "admin" ? "users" : "posts");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <Loading />;
  }

  if (!user) return null;

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-4 w-full">
        <h1 className="text-2xl font-bold text-gray-950 dark:text-gray-100 mb-4">
          Suspended Content
        </h1>
        <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 mb-4">
          {user.role === "admin" && (
            <button
              className={`pb-2 px-4 ${
                tab === "users"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-600 dark:text-gray-400"
              }`}
              onClick={() => setTab("users")}
              aria-selected={tab === "users"}
            >
              Users
            </button>
          )}
          <button
            className={`pb-2 px-4 ${
              tab === "posts"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-600 dark:text-gray-400"
            }`}
            onClick={() => setTab("posts")}
            aria-selected={tab === "posts"}
          >
            Posts
          </button>
          <button
            className={`pb-2 px-4 ${
              tab === "comments"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-600 dark:text-gray-400"
            }`}
            onClick={() => setTab("comments")}
            aria-selected={tab === "comments"}
          >
            Comments
          </button>
        </div>
        <SuspendedList
          type={tab}
          isAdmin={user.role === "admin"}
          userId={user._id}
        />
      </div>
    </div>
  );
}
