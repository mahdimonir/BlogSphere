"use client";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, [search]);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`/api/posts?search=${search}`);
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">BlogSphere</h1>
      <input
        type="text"
        placeholder="Search posts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      {/* {user && ( */}
      <Link
        href="/create"
        className="bg-blue-500 text-white p-2 rounded mb-4 inline-block"
      >
        Create Post
      </Link>
      {/* )} */}
      {/* <div className="grid gap-4">
        {posts.map((post) => (
          <div key={post._id} className="border p-4 rounded">
            <Link href={`/posts/${post._id}`}>
              <h2 className="text-xl font-bold">{post.title}</h2>
            </Link>
            <p>{post.content.substring(0, 100)}...</p>
            <p className="text-sm">By {post.author.name}</p>
            <p className="text-sm">
              Likes: {post.likes.length} | Dislikes: {post.dislikes.length}
            </p>
          </div>
        ))}
      </div> */}

      <div className="grid gap-4">
        <div className="border p-4 rounded">
          <Link href={`/posts/1`}>
            <h2 className="text-xl font-bold">Post Title</h2>
          </Link>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Dignissimos sit commodi doloremque consectetur qui nam pariatur
            quisquam, nobis nemo aliquid.
          </p>
          <p className="text-sm">By mahdi</p>
          <p className="text-sm">Likes: 25 | Dislikes: 4</p>
        </div>
      </div>
    </div>
  );
}
