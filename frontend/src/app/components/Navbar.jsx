"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, Bell, Moon } from "lucide-react";

export default function Navbar() {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <nav className="flex items-center justify-between p-4 bg-white/80">
            <Link href="/" className="text-lg font-bold text-blue-500">
                BlogSphere
            </Link>

            <div className="relative mx-4 flex-grow max-w-xs">
                <input
                    type="text"
                    placeholder="search blog"
                    className="w-full rounded-full py-1 px-4 bg-gray-100 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>

            <div className="flex items-center gap-4">
                <button className="p-1">
                    <Moon className="h-5 w-5" />
                </button>
                <div className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        7
                    </span>
                </div>
                <Link href="/my-blogs" className="text-sm">
                    My blogs
                </Link>
                <Link href="/profile" className="text-sm">
                    Profile
                </Link>
                <Link href="/sign-out" className="text-sm">
                    Sign out
                </Link>
            </div>
        </nav>
    );
}
