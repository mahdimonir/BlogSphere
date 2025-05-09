"use client";

import { API_URL } from "@/server"; // Adjust the import path as needed
import axios from "axios";
import { useEffect, useState } from "react";
import Error from "./Error";
import Loading from "./Loading";

export default function ProfileSettingsForm() {
  const [userData, setUserData] = useState(null); // Store user data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [status, setStatus] = useState(true);
  const [theme, setTheme] = useState("dark");
  const [contactPrivacy, setContactPrivacy] = useState("followers");
  const [postPrivacy, setPostPrivacy] = useState("public");

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_URL}/users/profile/me`, {
          withCredentials: true,
        });
        const data = response.data.data;
        setUserData(data);
        setStatus(data.activeStatus);
        setTheme(data.defaultTheme || "dark");
        setContactPrivacy(data.contactPrivacy || "followers");
        setPostPrivacy(data.postPrivacy || "public");
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data. Please try again later.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle form submission to update user information
  const handleSave = async () => {
    try {
      setLoading(true);
      await axios.put(
        `${API_URL}/auth/update-user`,
        {
          activeStatus: status,
          defaultTheme: theme,
          contactPrivacy,
          postPrivacy,
        },
        { withCredentials: true }
      );
      setLoading(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating user data:", err);
      setError("Failed to update profile. Please try again later.");
      setLoading(false);
    }
  };

  // Handle avatar update
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setLoading(true);
      const response = await axios.put(
        `${API_URL}/auth/update-avatar`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setUserData((prev) => ({ ...prev, avatar: response.data.avatar }));
      setLoading(false);
      alert("Avatar updated successfully!");
    } catch (err) {
      console.error("Error updating avatar:", err);
      setError("Failed to update avatar. Please try again later.");
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
    <form className="flex-grow p-6 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900">
      <h2 className="text-xl font-bold mb-4">Basic Information</h2>

      <div className="mb-4">
        <label className="block text-gray-400">Full name</label>
        <input
          className="bg-gray-800 p-2 rounded w-full"
          defaultValue={userData?.fullName || ""}
        />
        <span className="text-sm text-blue-400 cursor-pointer">Edit</span>
      </div>

      <div className="mb-4">
        <label className="block text-gray-400">User name</label>
        <input
          disabled
          className="bg-gray-700 p-2 rounded w-full text-gray-500"
          defaultValue={userData?.userName || ""}
        />
        <p className="text-xs text-red-400">(Display name cannot be changed)</p>
      </div>

      <div className="mb-4">
        <label className="block text-gray-400">Email</label>
        <div className="flex gap-2 items-center">
          <span>{userData?.email || "No email provided"}</span>
          <button className="bg-gray-700 px-2 py-1 rounded text-sm">Add</button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-400">Avatar</label>
        <div className="flex items-center gap-4">
          <img
            src={userData?.avatar || "/default-avatar.png"}
            alt="Avatar"
            className="w-16 h-16 rounded-full object-cover"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="text-sm"
          />
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Accounts & Preference</h2>

      <div className="mb-4">
        <label>Active status:</label>
        <div className="flex gap-6 mt-1">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={status}
              onChange={() => setStatus(true)}
            />
            On
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={!status}
              onChange={() => setStatus(false)}
            />
            Off
          </label>
        </div>
      </div>

      <div className="mb-6">
        <label>Default Theme:</label>
        <div className="flex gap-6 mt-1">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={theme === "dark"}
              onChange={() => setTheme("dark")}
            />
            Dark Default
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={theme === "light"}
              onChange={() => setTheme("light")}
            />
            Light
          </label>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Privacy Settings</h2>

      <div className="mb-4">
        <label className="block mb-2">Who can see my contact info?</label>
        <div className="flex gap-6">
          {["followers", "me", "public"].map((opt) => (
            <label key={opt} className="flex items-center gap-2 capitalize">
              <input
                type="radio"
                checked={contactPrivacy === opt}
                onChange={() => setContactPrivacy(opt)}
              />
              {opt === "me"
                ? "Only me"
                : opt === "followers"
                ? "My followers"
                : "Public"}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block mb-2">Who can see my posts?</label>
        <div className="flex gap-6">
          {["public", "me", "followers"].map((opt) => (
            <label key={opt} className="flex items-center gap-2 capitalize">
              <input
                type="radio"
                checked={postPrivacy === opt}
                onChange={() => setPostPrivacy(opt)}
              />
              {opt === "me"
                ? "Only me"
                : opt === "followers"
                ? "My followers"
                : "Public"}
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        <button
          type="button"
          onClick={handleSave}
          className="bg-green-600 px-4 py-2 rounded"
        >
          Save
        </button>
        <button type="button" className="bg-gray-600 px-4 py-2 rounded">
          Cancel
        </button>
      </div>
    </form>
  );
}
