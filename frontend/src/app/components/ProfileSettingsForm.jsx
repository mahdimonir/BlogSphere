"use client";

import { useState } from "react";

export default function ProfileSettingsForm() {
    const [status, setStatus] = useState(true);
    const [theme, setTheme] = useState("dark");
    const [contactPrivacy, setContactPrivacy] = useState("followers");
    const [postPrivacy, setPostPrivacy] = useState("public");

    return (
        <form className="flex-grow p-6 text-white">
            <h2 className="text-xl font-bold mb-4">Basic informations</h2>

            <div className="mb-4">
                <label className="block text-gray-400">Full name</label>
                <input
                    className="bg-gray-800 p-2 rounded w-full"
                    defaultValue="Taposh Barman"
                />
                <span className="text-sm text-blue-400 cursor-pointer">
                    Edit
                </span>
            </div>

            <div className="mb-4">
                <label className="block text-gray-400">User name</label>
                <input
                    disabled
                    className="bg-gray-700 p-2 rounded w-full text-gray-500"
                    defaultValue="Taposh Barman"
                />
                <p className="text-xs text-red-400">
                    (Display name cannot be changed)
                </p>
            </div>

            <div className="mb-4">
                <label className="block text-gray-400">Email</label>
                <div className="flex gap-2 items-center">
                    <span>taposhbarman420@gmail.com</span>
                    <button className="bg-gray-700 px-2 py-1 rounded text-sm">
                        Add
                    </button>
                </div>
                <p className="text-sm text-gray-400">demo0120@gmail.com</p>
            </div>

            <div className="mb-4">
                <label className="block text-gray-400">Contact</label>
                <div className="flex gap-2 items-center">
                    <span>01310558336</span>
                    <button className="text-blue-400 text-sm">Verify</button>
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-gray-400">Social links</label>
                <p className="text-sm text-gray-400">facebook.com/taposh</p>
                <p className="text-sm text-gray-400">instagram.com/berol</p>
            </div>

            <h2 className="text-xl font-bold mb-4">Accounts & Preference</h2>

            <div className="mb-4">
                <label>Password</label>
                <div className="flex items-center gap-4">
                    <input
                        type="password"
                        className="bg-gray-800 p-2 rounded w-1/2"
                        defaultValue="*******"
                    />
                    <button className="text-blue-400 text-sm">Change</button>
                </div>
            </div>

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
                <label className="block mb-2">
                    Who can see my contact info?
                </label>
                <div className="flex gap-6">
                    {["followers", "me", "public"].map((opt) => (
                        <label
                            key={opt}
                            className="flex items-center gap-2 capitalize"
                        >
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
                        <label
                            key={opt}
                            className="flex items-center gap-2 capitalize"
                        >
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
                <button className="bg-green-600 px-4 py-2 rounded">Save</button>
                <button className="bg-gray-600 px-4 py-2 rounded">
                    Cancel
                </button>
            </div>
        </form>
    );
}
