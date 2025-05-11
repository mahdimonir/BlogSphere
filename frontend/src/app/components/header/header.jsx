"use client";

import ProfileIcon from "@/app/assets/svgs/profile-icon";
import Loading from "@/app/components/Loading";
import PostCard from "@/app/components/PostCard";
import UserCard from "@/app/components/UserCard";
import axiosInstance from "@/app/utils/axiosConfig";
import { useAuth } from "@/context/AuthContext";
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

// Custom hook for outside click detection
const useClickOutside = (callback) => {
  const ref = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [callback]);
  return ref;
};

// Search Input Component
const SearchInput = ({ value, onChange, onClear, className, autoFocus }) => (
  <div className={`relative ${className}`}>
    <input
      type="text"
      placeholder="Search posts and users"
      className="w-full rounded-full py-2 px-4 bg-gray-100 text-sm text-gray-950 dark:text-gray-100 dark:bg-gray-700 focus:outline-none"
      value={value}
      onChange={onChange}
      autoFocus={autoFocus}
      aria-label="Search posts and users"
    />
    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-300" />
    {value && (
      <X
        className="absolute right-8 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-300 cursor-pointer"
        onClick={onClear}
        aria-label="Clear search"
      />
    )}
  </div>
);

// Navigation Links Component
const NavLinks = ({ onClick, user, isMobile }) => {
  const links = [
    { href: "/", label: "Home" },
    { href: "/posts", label: "Posts" },
    ...(user
      ? [
          { href: "/posts/create", label: "Create Post" },
          { href: `/users/${user.userName}`, label: "Profile" },
        ]
      : []),
    { href: "/users", label: "Users" },
    { href: "/about", label: "About" },
  ];

  return (
    <div
      className={`${
        isMobile
          ? "bg-white dark:bg-gray-900 shadow-lg rounded-lg p-4"
          : "flex flex-col"
      }`}
    >
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`block px-4 py-2 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md ${
            isMobile ? "mb-2" : ""
          }`}
          onClick={onClick}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
};

// User Actions Component
const UserActions = ({ user, logout, authLoading, model }) => {
  if (authLoading || model) return null;
  return user ? (
    <button
      onClick={logout}
      className="text-sm text-white bg-red-400 hover:bg-red-500 hover:shadow text-center px-3 py-1 rounded-sm w-full"
      aria-label="Logout"
    >
      Logout
    </button>
  ) : (
    <Link
      href="/login"
      className="text-sm bg-blue-500 text-white text-center px-3 py-1 rounded-sm hover:bg-blue-600 block w-full"
      aria-label="Sign In"
    >
      Sign In
    </Link>
  );
};

// User Section Component
const UserSection = ({
  user,
  authLoading,
  notifications,
  toggleNotificationDropdown,
  notificationOpen,
  markNotificationAsRead,
  notificationRef,
  model,
}) => {
  if (authLoading || (model && window.innerWidth < 768)) return null;
  if (!user) return null;

  return (
    <>
      <div className="relative" ref={notificationRef}>
        <button onClick={toggleNotificationDropdown} aria-label="Notifications">
          <Bell className="h-5 w-5 text-gray-900 dark:text-gray-100" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </button>
        {notificationOpen && (
          <div className="absolute top-full right-0 md:left-1/2 md:-translate-x-1/2 mt-2 w-64 bg-white dark:bg-gray-900 shadow-lg rounded-lg z-50 max-h-[300px] overflow-y-auto">
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
                          onClick={toggleNotificationDropdown}
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
                          aria-label="Mark notification as read"
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
      <Link
        href={`/users/${user.userName}`}
        className="border-2 w-7 h-7 flex items-center justify-center rounded-full border-gray-900 dark:border-gray-100"
        aria-label="Profile"
      >
        {user.avatar ? (
          <Image
            src={user.avatar}
            alt="User avatar"
            width={28}
            height={28}
            className="rounded-full object-cover"
          />
        ) : (
          <ProfileIcon className="h-6 w-6 p-0.5 text-gray-900 dark:text-gray-100" />
        )}
      </Link>
    </>
  );
};

export default function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debounceQuery, setDebounceQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dark, setDark] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const { user, logout, loading: authLoading } = useAuth();
  const [model, setModel] = useState(false);

  const searchRef = useClickOutside(() => {
    setSearchTerm("");
    setSearchOpen(false);
  });
  const navRef = useClickOutside(() => setNavOpen(false));
  const mobileMenuRef = useClickOutside(() => setModel(false));
  const notificationRef = useClickOutside(() => setNotificationOpen(false));

  // Theme handling
  useEffect(() => {
    const isDark = localStorage.getItem("Dark") === "true";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  useEffect(() => {
    localStorage.setItem("Dark", dark.toString());
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
          axiosInstance.get("/search/posts", {
            params: { query: debounceQuery },
          }),
          axiosInstance.get("/search/users", {
            params: { query: debounceQuery },
          }),
        ]);

        const postsData =
          postsResult.status === "fulfilled"
            ? postsResult.value.data.data || []
            : [];
        const usersData =
          usersResult.status === "fulfilled"
            ? usersResult.value.data.data || []
            : [];

        setPosts(postsData);
        setUsers(usersData);

        if (
          postsResult.status === "rejected" &&
          usersResult.status === "rejected"
        ) {
          setError("Failed to load search results.");
        }
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to load search results."
        );
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
        const response = await axiosInstance.get("/notifications", {
          params: { page: 1, limit: 10 },
        });
        setNotifications(response.data.data.notifications || []);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to load notifications."
        );
        setNotifications([]);
      }
    };

    fetchNotifications();
  }, [user]);

  // Mark notification as read
  const markNotificationAsRead = async (id) => {
    try {
      await axiosInstance.patch(`/notifications/${id}/read`, {});
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to mark notification as read."
      );
    }
  };

  const toggleTheme = () => setDark((prev) => !prev);
  const toggleNavDropdown = () => setNavOpen((prev) => !prev);
  const toggleNotificationDropdown = () => setNotificationOpen((prev) => !prev);
  const toggleSearch = () => setSearchOpen((prev) => !prev);
  const modelHandler = () => setModel(true);

  return (
    <nav className="sticky top-0 z-50 bg-gray-50 dark:bg-gray-900 shadow-xl">
      <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-bold text-blue-500"
          aria-label="BlogSphere Home"
        >
          BlogSphere
        </Link>

        {/* Search (Desktop) */}
        <div className="flex-1 mx-4 hidden md:block">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm("")}
            className="max-w-[28rem] mx-auto"
            ref={searchRef}
          />
        </div>
        <div className="md:hidden">
          <button onClick={toggleSearch} aria-label="Toggle search">
            <Search className="h-5 w-5 text-gray-900 dark:text-gray-100" />
          </button>
        </div>

        {/* Full-Screen Search (Mobile) */}
        {searchOpen && (
          <div
            className="fixed top-16 left-0 w-full h-screen bg-gray-50 dark:bg-gray-900 flex flex-col md:hidden z-50"
            ref={searchRef}
          >
            <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <SearchInput
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClear={() => {
                  setSearchTerm("");
                  setSearchOpen(false);
                }}
                className="flex-1"
                autoFocus
              />
              <button
                className="ml-2 text-gray-900 dark:text-gray-100"
                onClick={() => {
                  setSearchTerm("");
                  setSearchOpen(false);
                }}
                aria-label="Close search"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Search Results Dropdown */}
        {debounceQuery && (
          <div
            className={`absolute left-0 right-0 mx-auto w-full max-w-[28rem] min-w-[20rem] bg-white dark:bg-gray-900 shadow-lg rounded-lg max-h-[400px] overflow-y-auto z-40 ${
              searchOpen ? "top-[120px] mt-8" : "top-[80px] mt-6"
            }`}
          >
            {loading ? (
              <div className="flex justify-center py-4">
                <Loading />
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

        {/* Right Side: Theme, Notifications, Profile, Menu */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <div
            className="w-[50px] h-[23px] overflow-hidden rounded-full shadow-inner bg-gray-300 dark:bg-white relative flex justify-center items-center cursor-pointer"
            onClick={toggleTheme}
            role="button"
            aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
          >
            <div
              className={`absolute flex items-center w-full h-full transition-transform duration-300 ${
                dark ? "translate-x-[20px]" : "translate-x-0"
              }`}
            >
              <Moon
                className="absolute left-1 top-[2.5px] h-5 w-5 dark:hidden"
                color="white"
              />
              <Sun
                className="absolute left-0 top-[2px] h-5 w-5 hidden dark:block"
                color="gray"
              />
            </div>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-3">
            <UserSection
              user={user}
              authLoading={authLoading}
              notifications={notifications}
              toggleNotificationDropdown={toggleNotificationDropdown}
              notificationOpen={notificationOpen}
              markNotificationAsRead={markNotificationAsRead}
              notificationRef={notificationRef}
              model={model}
            />
          </div>

          {/* Navigation Dropdown (Desktop) */}
          <div
            className={model ? "hidden" : "relative hidden md:block"}
            ref={navRef}
          >
            <button
              className="flex items-center text-sm text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400"
              onClick={toggleNavDropdown}
              aria-label="Toggle navigation menu"
            >
              Menu
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            {navOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-900 shadow-lg rounded-lg z-50">
                <NavLinks
                  user={user}
                  onClick={() => setNavOpen(false)}
                  isMobile={false}
                />
              </div>
            )}
          </div>

          {/* User Actions (Desktop) */}
          <div className={model ? "hidden" : "hidden md:block"}>
            <UserActions
              user={user}
              logout={logout}
              authLoading={authLoading}
              model={model}
            />
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden border rounded-sm text-gray-950 dark:text-gray-100"
            onClick={modelHandler}
            aria-label="Toggle mobile menu"
          >
            <AlignJustify className="h-5 w-5" />
          </button>

          {/* Mobile Menu */}
          <div
            className={`fixed top-0 h-screen md:hidden ${
              model
                ? "right-0 bg-white dark:bg-gray-900 w-[16rem] p-4"
                : "-left-full bg-transparent"
            } transition-all duration-300 ease-in-out z-50`}
            ref={mobileMenuRef}
          >
            <button
              className="text-red-500 self-end mb-4"
              onClick={() => setModel(false)}
              aria-label="Close mobile menu"
            >
              <X className="h-5 w-5" />
            </button>
            {user && (
              <Link
                href={`/users/${user.userName}`}
                className="flex justify-center mb-6"
                onClick={() => setModel(false)}
              >
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt="User avatar"
                    width={48}
                    height={48}
                    className="rounded-full border-2 border-gray-900 dark:border-gray-100 object-cover"
                  />
                ) : (
                  <div className="border-2 w-12 h-12 flex items-center justify-center rounded-full border-gray-900 dark:border-gray-100">
                    <ProfileIcon className="h-10 w-10 p-1 text-gray-900 dark:text-gray-100" />
                  </div>
                )}
              </Link>
            )}
            <NavLinks
              user={user}
              onClick={() => setModel(false)}
              isMobile={true}
            />
            <div className="mt-4">
              <UserActions
                user={user}
                logout={logout}
                authLoading={authLoading}
                model={model}
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
