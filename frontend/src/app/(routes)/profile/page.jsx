"use client";

import ProfileDetails from "@/app/components/ProfileDetails";
import Sidebar from "@/app/components/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Profile() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 p-4 w-full">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <ProfileDetails user={user} />
      </div>
    </div>
  );
}
