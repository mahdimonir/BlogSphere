"use client"; // Required to use hooks like usePathname

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();

    const links = [
        { name: "My Account", path: "/profile" },
        { name: "Create a blog", path: "/create-blog" },
        { name: "Manage", path: "/manage" },
        { name: "Draft", path: "/draft" },
        { name: "Pinned", path: "/pinned" },
        { name: "Most popular", path: "/popular" },
    ];

    return (
        <aside className="w-64 min-h-screen bg-black text-white p-6 flex flex-col justify-between top-0 left-0">
            <div>
                <h2 className="text-2xl font-bold mb-8">BlogSphere</h2>
                <nav className="space-y-4">
                    {links.map((link, idx) => (
                        <Link
                            key={idx}
                            href={link.path}
                            className={`block transition px-2 py-1 rounded ${
                                pathname === link.path
                                    ? "bg-gray-800 text-purple-400"
                                    : "hover:text-purple-400"
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>
            </div>
        </aside>
    );
}
