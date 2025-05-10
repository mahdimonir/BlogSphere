"use client";

import ProfileIcon from "@/app/assets/svgs/profile-icon";
import PostCard from "@/app/components/PostCard";
import UserCard from "@/app/components/UserCard";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/server";
import axios from "axios";
import { AlignJustify, Bell, Moon, Search, Sun, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debounceQuery, setDebounceQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [model, setModel] = useState(false);
  const [dark, setDark] = useState(false);
  const { user, logout, loading: authLoading } = useAuth();
  const dropdownRef = useRef(null);

  // Theme handling
  useEffect(() => {
    const isDark = localStorage.getItem("Dark") === "true";
    setDark(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("Dark", dark ? "true" : "false");
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // Debounce search input
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceQuery(searchTerm.trim());
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  // Fetch posts and users
  useEffect(() => {
    const fetchData = async () => {
      if (!debounceQuery) {
        setPosts([]);
        setUsers([]);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const [postsResult, usersResult] = await Promise.allSettled([
          axios.get(`${API_URL}/search/posts`, {
            params: { query: debounceQuery },
            withCredentials: true,
          }),
          axios.get(`${API_URL}/search/users`, {
            params: { query: debounceQuery },
            withCredentials: true,
          }),
        ]);

        const postsData =
          postsResult.status === "fulfilled"
            ? postsResult.value.data.data || []
            : [];
        if (postsResult.status === "rejected") {
          console.error("Posts fetch error:", postsResult.reason);
        }

        const usersData =
          usersResult.status === "fulfilled"
            ? usersResult.value.data.data || []
            : [];
        if (usersResult.status === "rejected") {
          console.error("Users fetch error:", usersResult.reason);
        }

        setPosts(postsData);
        setUsers(usersData);

        if (
          postsResult.status === "rejected" &&
          usersResult.status === "rejected"
        ) {
          setError("Failed to load search results.");
        }
      } catch (error) {
        console.error("Unexpected error during fetch:", error);
        setError("Failed to load search results.");
        setPosts([]);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debounceQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setDark((prev) => !prev);
  };

  const modelHandler = () => {
    setModel(true);
  };

  return (
    <nav className="flex items-center sticky top-0 z-50 h-full justify-between py-1 shadow-xl bg-gray-50 dark:bg-gray-900">
      <div className="max-w-[1200px] px-3 w-full mx-auto flex my-2 items-center">
        {/* Logo */}
        <Link href="/" className="text-lg font-bold text-blue-500">
          BlogSphere
        </Link>

        {/* Search Bar (Centered) */}
        <div
          className="relative flex-1 max-w-[20rem] mx-auto sm:max-w-[24rem] md:max-w-[28rem]"
          ref={dropdownRef}
        >
          <input
            type="text"
            placeholder={model ? "_" : "Search posts and users"}
            className="w-full rounded-full py-2 px-4 bg-gray-100 text-sm text-gray-950 dark:text-gray-100 dark:bg-gray-700 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-300" />
          {searchTerm && (
            <X
              className="absolute right-8 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-300 cursor-pointer"
              onClick={() => setSearchTerm("")}
            />
          )}

          {/* Search Results Dropdown */}
          {debounceQuery && (
            <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-lg rounded-lg mt-2 max-h-[400px] overflow-y-auto z-50 sm:w-[calc(100%+2rem)] sm:-left-4">
              {loading ? (
                <div className="p-4 text-center text-gray-600 dark:text-gray-300">
                  Loading...
                </div>
              ) : error ? (
                <div className="p-4 text-center text-red-500">{error}</div>
              ) : users.length === 0 && posts.length === 0 ? (
                <div className="p-4 text-center text-gray-600 dark:text-gray-300">
                  No results found.
                </div>
              ) : (
                <div className="p-4">
                  {users.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Users
                      </h3>
                      {users.map((user) => (
                        <div className="mb-2">
                          <UserCard
                            key={user._id}
                            user={user}
                            onClick={() => setSearchTerm("")}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  {posts.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Posts
                      </h3>
                      {posts.map((post) => (
                        <div className="mb-2">
                          <PostCard
                            key={post._id}
                            post={post}
                            compact
                            onClick={() => setSearchTerm("")}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Theme Toggle and User Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <div
            className="w-[50px] h-[23px] overflow-hidden rounded-full shadow-inner bg-gray-300 dark:bg-white relative flex justify-center items-center cursor-pointer"
            onClick={toggleTheme}
          >
            <div
              className={`absolute flex items-center w-full h-full transition-transform ${
                dark ? "translate-x-[20px]" : "translate-x-0"
              }`}
            >
              <button className="absolute left-1 top-[2.5px]">
                <Moon className="h-5 w-5 dark:hidden" color="white" />
              </button>
              <button className="absolute left-0 top-[2px] hidden dark:block">
                <Sun className="h-5 w-5" color="gray" />
              </button>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <AlignJustify
            className="md:hidden border rounded-sm text-gray-950 dark:text-gray-100 cursor-pointer"
            onClick={modelHandler}
          />

          {/* User Actions */}
          <div
            className={`flex items-center md:justify-center pt-3 md:pt-0 gap-3 flex-col md:flex-row fixed md:static top-0 h-full ${
              model
                ? "right-0 bg-white dark:bg-[#1C1B1B] w-[12rem] p-4"
                : "-left-full bg-transparent"
            } md:w-auto transition-all z-50`}
          >
            <X
              className="md:hidden text-red-500 self-end cursor-pointer"
              onClick={() => setModel(false)}
            />
            {!authLoading && user ? (
              <>
                <div className="relative">
                  <Bell className="h-5 w-5 text-gray-900 dark:text-gray-100" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    7
                  </span>
                </div>
                <Link
                  href="/profile"
                  className="border-2 w-7 h-7 flex items-center justify-center rounded-full border-gray-900 dark:border-gray-100"
                >
                  <ProfileIcon className="h-6 w-6 p-0.5 text-gray-900 dark:text-gray-100" />
                </Link>
                <button
                  onClick={logout}
                  className="text-sm text-white bg-red-400 hover:bg-red-500 hover:shadow text-center px-3 py-1 rounded-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              !authLoading && (
                <Link
                  href="/login"
                  className="text-sm bg-blue-500 text-white text-center px-3 py-1 rounded-sm hover:bg-blue-600"
                >
                  Sign In
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
