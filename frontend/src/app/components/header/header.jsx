"use client";

import ProfileIcon from "@/app/assets/svgs/profile-icon";
import PostCard from "@/app/components/PostCard";
import UserCard from "@/app/components/UserCard";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/server";
import axios from "axios";
import {
  AlignJustify,
  Bell,
  ChevronDown,
  Moon,
  Search,
  Sun,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Loading from "../Loading";

export default function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debounceQuery, setDebounceQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [model, setModel] = useState(false);
  const [dark, setDark] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const { user, logout, loading: authLoading } = useAuth();
  const dropdownRef = useRef(null);
  const navDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const notificationRef = useRef(null);

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

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) {
        setNotifications([]);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/notifications`, {
          params: { page: 1, limit: 10 },
          withCredentials: true,
        });
        setNotifications(response.data.data.notifications || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotifications([]);
      }
    };

    fetchNotifications();
  }, [user]);

  // Mark notification as read
  const markNotificationAsRead = async (id) => {
    try {
      await axios.patch(
        `${API_URL}/notifications/${id}/read`,
        {},
        { withCredentials: true }
      );
      setNotifications(notifications.filter((n) => n._id !== id));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSearchTerm("");
        setSearchOpen(false);
      }
      if (
        navDropdownRef.current &&
        !navDropdownRef.current.contains(event.target)
      ) {
        setNavOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setModel(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
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

  const toggleNavDropdown = () => {
    setNavOpen((prev) => !prev);
  };

  const toggleNotificationDropdown = () => {
    setNotificationOpen((prev) => !prev);
  };

  const toggleSearch = () => {
    setSearchOpen((prev) => !prev);
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-50 dark:bg-gray-900 shadow-xl">
      <div className="max-w-[1200px] mx-auto px-3 py-2 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-lg font-bold text-blue-500">
          BlogSphere
        </Link>

        {/* Search (sm: Button, md: Search Bar) */}
        <div className="flex-1 mx-4 hidden md:block">
          <div className="relative max-w-[28rem] mx-auto" ref={dropdownRef}>
            <input
              type="text"
              placeholder="Search posts and users"
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
          </div>
        </div>
        <div className="md:hidden">
          <button onClick={toggleSearch} className="p-1">
            <Search className="h-5 w-5 text-gray-900 dark:text-gray-100" />
          </button>
        </div>

        {/* Full-Screen Search (sm:) */}
        {searchOpen && (
          <div
            className="absolute top-10 left-0 w-full h-screen bg-gray-50 dark:bg-gray-900 flex flex-col md:hidden"
            ref={dropdownRef}
          >
            <div className="flex items-center p-3 border-b border-gray-200 dark:border-gray-700">
              <input
                type="text"
                placeholder="Search posts and users"
                className="flex-1 rounded-full py-2 px-4 bg-gray-100 text-sm text-gray-950 dark:text-gray-100 dark:bg-gray-700 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
              <X
                className="ml-2 h-5 w-5 text-gray-900 dark:text-gray-100 cursor-pointer"
                onClick={() => {
                  setSearchTerm("");
                  setSearchOpen(false);
                }}
              />
            </div>
          </div>
        )}

        {/* Search Results Dropdown */}
        {debounceQuery && (searchOpen || window.innerWidth >= 768) && (
          <div className="absolute top-[60px] left-0 right-0 mx-auto w-full max-w-[28rem] min-w-[20rem] bg-white dark:bg-gray-900 shadow-lg rounded-lg mt-2 max-h-[400px] overflow-y-auto z-50">
            {loading ? (
              <Loading />
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
                      <div className="mb-2" key={user._id}>
                        <UserCard
                          user={user}
                          onClick={() => {
                            setSearchTerm("");
                            setSearchOpen(false);
                          }}
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
                      <div className="mb-2" key={post._id}>
                        <PostCard
                          post={post}
                          compact
                          onClick={() => {
                            setSearchTerm("");
                            setSearchOpen(false);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Right Side: Theme Toggle, Bell, and Mobile Menu Toggle */}
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

          {/* Notification Bell */}
          {!authLoading && user && (
            <div className="relative" ref={notificationRef}>
              <button onClick={toggleNotificationDropdown}>
                <Bell className="h-5 w-5 text-gray-900 dark:text-gray-100" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
              {notificationOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-900 shadow-lg rounded-lg z-50 max-h-[300px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-600 dark:text-gray-300">
                      No notifications
                    </div>
                  ) : (
                    <div className="p-4">
                      {notifications.map((notification) => (
                        <div
                          key={notification._id}
                          className="mb-2 text-sm text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2"
                        >
                          <p>{notification.message}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                          <div className="flex gap-2">
                            {notification.link && (
                              <Link
                                href={notification.link}
                                className="text-xs text-blue-500 hover:text-blue-600"
                                onClick={() => setNotificationOpen(false)}
                              >
                                View
                              </Link>
                            )}
                            {!notification.isRead && (
                              <button
                                onClick={() =>
                                  markNotificationAsRead(notification._id)
                                }
                                className="text-xs text-blue-500 hover:text-blue-600"
                              >
                                Mark as read
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* User Profile */}
          {!authLoading && user && (
            <Link
              href="/profile"
              className="border-2 w-7 h-7 flex items-center justify-center rounded-full border-gray-900 dark:border-gray-100"
            >
              <ProfileIcon className="h-6 w-6 p-0.5 text-gray-900 dark:text-gray-100" />
            </Link>
          )}

          {/* Navigation Dropdown (Desktop) */}
          <div className="relative hidden md:block" ref={navDropdownRef}>
            <button
              className="flex items-center text-sm text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400"
              onClick={toggleNavDropdown}
            >
              Menu
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            {navOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-900 shadow-lg rounded-lg z-50">
                <Link
                  href="/posts"
                  className="block px-4 py-2 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setNavOpen(false)}
                >
                  Posts
                </Link>
                <Link
                  href="/users"
                  className="block px-4 py-2 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setNavOpen(false)}
                >
                  Users
                </Link>
                {user && (
                  <>
                    <Link
                      href="/posts/create"
                      className="block px-4 py-2 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setNavOpen(false)}
                    >
                      Create Post
                    </Link>
                  </>
                )}
                <Link
                  href="/about"
                  className="block px-4 py-2 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setNavOpen(false)}
                >
                  About
                </Link>
              </div>
            )}
          </div>

          {/* User Actions (Logout/Sign In) */}
          {!authLoading && user ? (
            <button
              onClick={logout}
              className="text-sm text-white bg-red-400 hover:bg-red-500 hover:shadow text-center px-3 py-1 rounded-sm"
            >
              Logout
            </button>
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

          {/* Mobile Menu Toggle */}
          <AlignJustify
            className="md:hidden border rounded-sm text-gray-950 dark:text-gray-100 cursor-pointer"
            onClick={modelHandler}
          />

          {/* Mobile Menu */}
          <div
            className={`fixed top-0 h-full md:hidden ${
              model
                ? "right-0 bg-white dark:bg-[#1C1B1B] w-[12rem] p-4"
                : "-left-full bg-transparent"
            } transition-all z-50`}
            ref={mobileMenuRef}
          >
            <X
              className="text-red-500 self-end cursor-pointer mb-4"
              onClick={() => setModel(false)}
            />

            {/* Profile (Top Center) */}
            {!authLoading && user && (
              <Link href="/profile" className="flex justify-center mb-4">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt="User avatar"
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-gray-900 dark:border-gray-100"
                  />
                ) : (
                  <div className="border-2 w-10 h-10 flex items-center justify-center rounded-full border-gray-900 dark:border-gray-100">
                    <ProfileIcon className="h-8 w-8 p-0.5 text-gray-900 dark:text-gray-100" />
                  </div>
                )}
              </Link>
            )}

            {/* Navigation Links */}
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                className="text-sm text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400"
                onClick={() => setModel(false)}
              >
                Home
              </Link>
              <Link
                href="/posts"
                className="text-sm text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400"
                onClick={() => setModel(false)}
              >
                Posts
              </Link>
              {user && (
                <>
                  <Link
                    href="/posts/create"
                    className="text-sm text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400"
                    onClick={() => setModel(false)}
                  >
                    Create Post
                  </Link>
                  <Link
                    href="/profile"
                    className="text-sm text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400"
                    onClick={() => setModel(false)}
                  >
                    Profile
                  </Link>
                </>
              )}
              <Link
                href="/about"
                className="text-sm text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400"
                onClick={() => setModel(false)}
              >
                About
              </Link>
            </div>

            {/* User Actions (Logout/Sign In) */}
            <div className="mt-4">
              {!authLoading && user ? (
                <button
                  onClick={logout}
                  className="text-sm text-white bg-red-400 hover:bg-red-500 hover:shadow text-center px-3 py-1 rounded-sm w-full"
                >
                  Logout
                </button>
              ) : (
                !authLoading && (
                  <Link
                    href="/login"
                    className="text-sm bg-blue-500 text-white text-center px-3 py-1 rounded-sm hover:bg-blue-600 block w-full"
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
