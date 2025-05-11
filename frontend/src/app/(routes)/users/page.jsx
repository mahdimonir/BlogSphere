"use client";

import Error from "@/app/components/Error";
import Loading from "@/app/components/Loading";
import UserCard from "@/app/components/UserCard";
import axiosInstance from "@/app/utils/axiosConfig";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState([]); // Default to an empty array
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/users");
      const fetchedUsers = response.data?.data || [];
      setUsers(fetchedUsers);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <Error errMessage={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        {error && (
          <p className="text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20 p-3 rounded-md mb-6 text-center">
            {error}
          </p>
        )}

        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          All Users
        </h2>
        {users.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <UserCard key={user._id} user={user} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-300 text-center">
            No users available.
          </p>
        )}
      </main>
    </div>
  );
}
