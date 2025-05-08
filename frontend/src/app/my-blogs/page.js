import Head from "next/head";
import BlogCard from "../components/BlogCard";

// Mock data for user's blogs
const userBlogs = [
  {
    category: "Adventure",
    image: "/images/adventure1.jpg",
    title: "Exploring my nature walk",
    excerpt: "With each step, I uncover the soothing sounds of the forest...",
    author: "Alex || Traveler",
    authorImage: "/images/alex.jpg",
    date: "25 April, 2025",
    readTime: "10 minutes read",
    slug: "exploring-nature-walk",
  },
  {
    category: "Food",
    image: "/images/food1.jpg",
    title: "My favorite recipes",
    excerpt:
      "A collection of family recipes passed down through generations...",
    author: "Alex || Traveler",
    authorImage: "/images/alex.jpg",
    date: "20 April, 2025",
    readTime: "8 minutes read",
    slug: "favorite-recipes",
  },
  {
    category: "Technologies",
    image: "/images/tech1.jpg",
    title: "My thoughts on AI",
    excerpt:
      "An exploration of how artificial intelligence is changing our lives...",
    author: "Alex || Traveler",
    authorImage: "/images/alex.jpg",
    date: "15 April, 2025",
    readTime: "12 minutes read",
    slug: "thoughts-on-ai",
  },
];

export default function MyBlogs() {
  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>My Blogs - BlogSphere</title>
        <meta name="description" content="Manage and view your blog posts" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">My Blogs</h1>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            Create New Blog
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userBlogs.map((blog, index) => (
            <BlogCard key={index} {...blog} />
          ))}
        </div>
      </main>
    </div>
  );
}
