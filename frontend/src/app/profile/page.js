"use client";
import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Navbar from "../components/Navbar";

export default function Profile() {
    const [user, setUser] = useState({
        name: "Alex || Traveler",
        bio: "Adventure seeker and food enthusiast. I love sharing my journeys and discoveries with the world.",
        email: "alex@example.com",
        avatar: "/images/alex.jpg",
        coverImage: "/images/cover.jpg",
    });

    return (
        <div className="min-h-screen bg-white">
            <Head>
                <title>Profile - BlogSphere</title>
                <meta
                    name="description"
                    content="Manage your profile settings"
                />
            </Head>

            <Navbar />

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="relative h-48 rounded-t-lg overflow-hidden mb-16">
                        <Image
                            src={user.coverImage}
                            alt="Cover"
                            fill
                            className="object-cover"
                        />

                        <div className="absolute -bottom-12 left-4 border-4 border-white rounded-full overflow-hidden">
                            <Image
                                src={user.avatar}
                                alt={user.name}
                                width={96}
                                height={96}
                                className="object-cover"
                            />
                        </div>
                    </div>

                    <div className="mt-8">
                        <h1 className="text-2xl font-bold mb-2">{user.name}</h1>
                        <p className="text-gray-600 mb-6">{user.bio}</p>

                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-4">
                                Profile Settings
                            </h2>

                            <form>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={user.name}
                                        onChange={(e) =>
                                            setUser({
                                                ...user,
                                                name: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={user.email}
                                        onChange={(e) =>
                                            setUser({
                                                ...user,
                                                email: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">
                                        Bio
                                    </label>
                                    <textarea
                                        value={user.bio}
                                        onChange={(e) =>
                                            setUser({
                                                ...user,
                                                bio: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border rounded-md"
                                        rows={4}
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <button
                                        type="button"
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                    >
                                        Update Profile
                                    </button>
                                    <button
                                        type="button"
                                        className="text-gray-600 border px-4 py-2 rounded-md"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
