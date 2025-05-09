"use client";

import ProfileIcon from "@/app/assets/svgs/profile-icon";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/server";
import axios from "axios";
import { AlignJustify, Bell, Moon, Search, Sun, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import PostCard from "./components/PostCard";
import UserCard from "./components/UserCard";

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

      try {
        setLoading(true);

        // Fetch posts
        const postsResponse = await axios.get(`${API_URL}/search/posts`, {
          params: { query: debounceQuery },
          withCredentials: true,
        });
        const postsData = postsResponse.data.data || [];
        setPosts(postsData);

        // Fetch users
        const usersResponse = await axios.get(`${API_URL}/search/users`, {
          params: { query: debounceQuery },
          withCredentials: true,
        });
        const usersData = usersResponse.data.data || [];
        setUsers(usersData);

        setError(null);
      } catch (error) {
        console.error("Error fetching search data:", error);
        setError("Failed to load search results.");
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
      <div className="max-w-[1200px] px-3 w-full mx-auto flex my-2">
        <Link href="/" className="text-lg font-bold text-blue-500">
          BlogSphere
        </Link>

        <div className="relative mx-4 flex-1 max-w-[20rem]" ref={dropdownRef}>
          <input
            type="text"
            placeholder="Search blogs or users"
            className="w-full rounded-full py-2 px-4 bg-gray-100 text-sm text-gray-950 dark:text-gray-100 dark:bg-gray-700"
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

          {debounceQuery && (
            <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg mt-2 max-h-[400px] overflow-y-auto z-50">
              {loading ? (
                <div className="p-4 text-center text-gray-600 dark:text-gray-300">
                  Loading...
                </div>
              ) : error ? (
                <div className="p-4 text-center text-red-500">{error}</div>
              ) : posts.length === 0 && users.length === 0 ? (
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
                        <UserCard
                          key={user._id}
                          user={user}
                          onClick={() => setSearchTerm("")}
                        />
                      ))}
                    </div>
                  )}
                  {posts.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Posts
                      </h3>
                      {posts.map((post) => (
                        <PostCard
                          key={post._id}
                          post={post}
                          compact
                          onClick={() => setSearchTerm("")}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end items-center ml-auto gap-5">
          <div
            className="w-[50px] h-[23px] overflow-hidden rounded-full shadow-inner bg-gray-300 dark:bg-white relative flex justify-center items-center"
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

          <div className="flex items-center gap-4 relative justify-center">
            <AlignJustify
              className="md:hidden border rounded-sm text-gray-950 dark:text-gray-100"
              onClick={modelHandler}
            />

            <div
              className={`flex items-center md:justify-center pt-3 md:pt-0 gap-3 
                 flex-col md:flex-row fixed md:relative top-0 h-full ${
                   model
                     ? "right-0 bg-white dark:bg-[#1C1B1B]"
                     : "-left-full bg-transparent"
                 } md:left-0 w-[12rem] font-semibold md:w-auto transition-all`}
            >
              <X
                className="right-0 md:hidden text-red-500"
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
      </div>
    </nav>
  );
}
