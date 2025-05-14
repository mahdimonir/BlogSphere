import Error from "@/app/components/Error";
import HeroSection from "@/app/components/HeroSection";
import PostFeed from "@/app/components/PostFeed";
import axiosInstance from "@/app/utils/axiosConfig";
import LottiSection from "./components/LottiSection";

export const metadata = {
  title: "BlogSphere - Your Personal Blog Space",
  description: "Discover interesting blog posts from various categories",
};

async function fetchPosts() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts`
    );
    return response.data?.data?.posts || [];
  } catch (error) {
    console.error("Error fetching posts:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
    });
    return { error: "Failed to load posts. Please try again later." };
  }
}

export default async function Home() {
  const postsData = await fetchPosts();

  if (postsData.error) {
    return <Error errMessage={postsData.error} />;
  }

  const posts = postsData;
  const trendingPosts = posts.filter((post) =>
    post.catagory.includes("Trending")
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {Array.isArray(trendingPosts) && trendingPosts.length > 0 ? (
          <HeroSection posts={trendingPosts} />
        ) : (
          <LottiSection />
        )}
        <main className="mt-8 md:mt-0">
          <PostFeed initialPosts={posts} defaultCategory="All" />
        </main>
      </div>
    </div>
  );
}
