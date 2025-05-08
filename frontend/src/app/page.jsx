"use client";
import Head from "next/head";
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Demo_Image } from "./assets/demo";
import FilterBar from "./components/FilterBar";
import HeroSection from "./components/HeroSection";
import PostCard from "./components/PostCard";

// Mock data for featured post
const featuredPost = [
  {
    title: "Exploring my nature walk",
    content:
      "With each step, I uncover the soothing sounds of the forest, rustling of leaves, and the fresh scent of the outdoors, offering readers a serene escape and a chance to reconnect with nature's wonders.",
    image: "/images/nature-walk.png",
    author: {
      userName: "alex42 || Traveler",
      avatar: `${Demo_Image}`,
    },
    createdAt: "25 April, 2025",
    _id: "01",
  },
  {
    title: "Exploring my nature walk",
    content:
      "With each step, I uncover the soothing sounds of the forest, rustling of leaves, and the fresh scent of the outdoors, offering readers a serene escape and a chance to reconnect with nature's wonders.",
    image: "/images/nature-walk.png",
    author: {
      userName: "alex42 || Traveler",
      avatar: `${Demo_Image}`,
    },
    createdAt: "25 April, 2025",
    _id: "02",
  },
  {
    title: "Exploring my nature walk",
    content:
      "With each step, I uncover the soothing sounds of the forest, rustling of leaves, and the fresh scent of the outdoors, offering readers a serene escape and a chance to reconnect with nature's wonders.",
    image: "/images/nature-walk.png",
    author: {
      userName: "alex42 || Traveler",
      avatar: `${Demo_Image}`,
    },
    createdAt: "25 April, 2025",
    _id: "03",
  },
];

// Mock data for blogs
const posts = [
  {
    category: "Food",
    image: "/images/food1.png",
    title: "Delightful secret recipes",
    content: "Discover unique flavors and traditional cooking techniques.",
    author: {
      userName: "Chef Maria",
      avatar: "/images/author.png",
    },
    _id: "delightful",
    createdAt: "24 April, 2025",
  },
  {
    category: "Adventure",
    image: "/images/advanture1.png",
    title: "Campfire under forest",
    author: {
      userName: "John Doe",
      avatar: "/images/author.png",
    },
    content: "Experience the magic of a campfire surrounded by nature.",
    _id: "campfire-under-forest",
    createdAt: "22 April, 2025",
  },
  {
    category: "Food",
    image: "/images/food1.png",
    title: "Portuguese Street Food",
    author: {
      userName: "Chef Maria",
      avatar: "/images/author.png",
    },
    content: "Explore the vibrant flavors of Portuguese street food.",
    _id: "portuguese-street-food",
    createdAt: "21 April, 2025",
  },
  {
    category: "Technologies",
    image: "/images/starlink.png",
    title: "The future of Starlink",
    author: {
      userName: "Tech Analyst",
      avatar: "/images/author.png",
    },
    content: "Exploring the potential of Starlink in global connectivity.",
    _id: "future-of-starlink",
    createdAt: "19 April, 2025",
  },
  {
    category: "Adventure",
    image: "/images/advanture1.png",
    title: "Candlelight forest camping",
    author: {
      userName: "Nature Lover",
      avatar: "/images/author.png",
    },
    content: "Experience the tranquility of camping in a candlelit forest.",
    _id: "candlelight-forest-camping",
    createdAt: "18 April, 2025",
  },
  {
    category: "Food",
    image: "/images/food1.png",
    title: "Barbeques Street Food",
    author: {
      userName: "Chef Maria",
      avatar: "/images/author.png",
    },
    content: "Savor the smoky flavors of barbeque street food.",
    _id: "barbeques-street-food",
    createdAt: "16 April, 2025",
  },
  {
    category: "Technologies",
    image: "/images/starlink.png",
    title: "Future of Augmented Reality",
    author: {
      userName: "Tech Analyst",
      avatar: "/images/author.png",
    },
    content: "Exploring the potential of augmented reality in daily life.",
    _id: "future-of-ar",
    createdAt: "15 April, 2025",
  },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredBlogs =
    activeCategory === "All"
      ? posts
      : posts.filter((post) => post.category === activeCategory);

  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;

      if (scrollTop) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50 transition-colors dark:bg-gray-900">
      <Head>
        <title>BlogSphere - Your Personal Blog Space</title>
        <meta
          name="description"
          content="Discover interesting blog posts from various categories"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="mx-auto">
        <HeroSection posts={featuredPost} />

        <main className="container mx-auto px-4 mt-8 md:mt-0">
          <FilterBar activeCategory={activeCategory} sortBy="Newest" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredBlogs.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          <div
            className={`flex justify-end pb-4 ${
              isSticky ? "sticky bottom-2 right-4" : ""
            }`}
          >
            <button
              className="px-4 py-2 bg-gray-200 hover:bg-blue-500 hover:text-white rounded-full cursor-pointer"
              onClick={scrollToTop}
            >
              Go Top
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
