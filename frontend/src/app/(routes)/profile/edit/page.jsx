"use client";

import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/server";
import axios from "axios";
import { Loader2, Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateProfile() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    avatar: "",
    userName: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    } else if (user) {
      fetchProfile();
    }
  }, [user, authLoading, router]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/profile`, {
        withCredentials: true,
      });
      const { name, bio, avatar, userName } = response.data.data;
      setFormData({ name, bio, avatar, userName });
      setPreview(avatar);
    } catch (err) {
      setError("Failed to load profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      // Update name and bio
      await axios.patch(
        `${API_URL}/auth/update`,
        { name: formData.name, bio: formData.bio },
        { withCredentials: true }
      );

      // Update avatar if changed
      if (avatarFile) {
        const avatarData = new FormData();
        avatarData.append("avatar", avatarFile);
        const avatarResponse = await axios.patch(
          `${API_URL}/auth/avatar`,
          avatarData,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        setFormData((prev) => ({
          ...prev,
          avatar: avatarResponse.data.data.avatar,
        }));
        setPreview(avatarResponse.data.data.avatar);
      }

      setSuccess("Profile updated successfully");
      setAvatarFile(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
      console.error(err);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-[600px] mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
      {error && (
        <p className="mb-4 p-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">
          {error}
        </p>
      )}
      {success && (
        <p className="mb-4 p-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded">
          {success}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar */}
        <div>
          <label className="block text-sm font-medium mb-2">Avatar</label>
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16">
              {preview ? (
                <Image
                  src={preview}
                  alt="Avatar preview"
                  fill
                  className="rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl font-bold">
                  {formData.userName[0]?.toUpperCase() || "?"}
                </div>
              )}
            </div>
            <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-blue-600">
              <Upload className="h-5 w-5" />
              Upload
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Username (Read-only) */}
        <div>
          <label htmlFor="userName" className="block text-sm font-medium mb-2">
            Username
          </label>
          <input
            type="text"
            id="userName"
            name="userName"
            value={formData.userName}
            disabled
            className="w-full p-2 rounded bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium mb-2">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows={4}
            className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => router.push("/profile")}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-full"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
