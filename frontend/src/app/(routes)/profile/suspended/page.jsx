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
  const [tab, setTab] = useState("users");

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
      <div className="ml-64 p-4 w-full">
        <h1 className="text-2xl font-bold mb-4">Suspended Content</h1>
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setTab("users")}
            className={`px-4 py-2 rounded ${
              tab === "users" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setTab("posts")}
            className={`px-4 py-2 rounded ${
              tab === "posts" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setTab("comments")}
            className={`px-4 py-2 rounded ${
              tab === "comments" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Comments
          </button>
        </div>
        <SuspendedList type={tab} isAdmin={user.role === "admin"} />
      </div>
    </div>
  );
}
