"use client";
import { useState } from "react";
import Head from "next/head";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FilterBar from "./components/FilterBar";
import BlogCard from "./components/BlogCard";

// Mock data for featured post
const featuredPost = {
    title: "Exploring my nature walk",
    excerpt:
        "With each step, I uncover the soothing sounds of the forest, rustling of leaves, and the fresh scent of the outdoors, offering readers a serene escape and a chance to reconnect with nature's wonders.",
    image: "/images/nature-walk.png",
    author: "Alex || Traveler",
    authorImage: "/images/author.png",
    date: "25 April, 2025",
    readTime: "10 minutes read",
    slug: "exploring-nature-walk",
};

// Mock data for blogs
const blogs = [
    {
        category: "Food",
        image: "/images/food1.png",
        title: "Delightful secret recipes",
        excerpt: "Discover unique flavors and traditional cooking techniques.",
        author: "Chef Maria",
        authorImage: "/images/author.png",
        date: "23 April, 2025",
        readTime: "8 minutes read",
        slug: "delightful-secret-recipes",
    },
    {
        category: "Adventure",
        image: "/images/advanture1.png",
        title: "Campfire under forest",
        author: "Wilderness Explorer",
        authorImage: "/images/author.png",
        date: "22 April, 2025",
        readTime: "12 minutes read",
        slug: "campfire-under-forest",
    },
    {
        category: "Food",
        image: "/images/food1.png",
        title: "Portuguese Street Food",
        author: "Food Critic",
        authorImage: "/images/author.png",
        date: "20 April, 2025",
        readTime: "5 minutes read",
        slug: "portuguese-street-food",
    },
    {
        category: "Technologies",
        image: "/images/starlink.png",
        title: "The future of Starlink",
        author: "Tech Analyst",
        authorImage: "/images/author.png",
        date: "19 April, 2025",
        readTime: "15 minutes read",
        slug: "future-of-starlink",
    },
    {
        category: "Adventure",
        image: "/images/advanture1.png",
        title: "Candlelight forest camping",
        author: "Night Explorer",
        authorImage: "/images/author.png",
        date: "17 April, 2025",
        readTime: "7 minutes read",
        slug: "candlelight-forest-camping",
    },
    {
        category: "Food",
        image: "/images/food1.png",
        title: "Barbeques Street Food",
        author: "Culinary Traveler",
        authorImage: "/images/author.png",
        date: "15 April, 2025",
        readTime: "6 minutes read",
        slug: "barbeques-street-food",
    },
    {
        category: "Technologies",
        image: "/images/starlink.png",
        title: "Future of Augmented Reality",
        author: "Tech Futurist",
        authorImage: "/images/author.png",
        date: "12 April, 2025",
        readTime: "10 minutes read",
        slug: "future-augmented-reality",
    },
];

export default function Home() {
    const [activeCategory, setActiveCategory] = useState("All");

    const filteredBlogs =
        activeCategory === "All"
            ? blogs
            : blogs.filter((blog) => blog.category === activeCategory);

    return (
        <div className="min-h-screen bg-white transition-colors dark:bg-black">
            <Head>
                <title>BlogSphere - Your Personal Blog Space</title>
                <meta
                    name="description"
                    content="Discover interesting blog posts from various categories"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Position navbar absolutely so it overlays the hero section */}
            <header className="absolute  top-0 left-0 right-0 z-50">
                <Navbar />
            </header>

            {/* Hero section will now start from the top */}
            <HeroSection post={featuredPost} />

            <main className="container mx-auto px-4">
                <FilterBar activeCategory={activeCategory} sortBy="Newest" />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {filteredBlogs.map((blog, index) => (
                        <BlogCard key={index} {...blog} />
                    ))}
                </div>

                <div className="flex justify-end mb-12">
                    <button className="px-4 py-2 bg-gray-200 rounded-full">
                        Top
                    </button>
                </div>
            </main>
        </div>
    );
}
