import ClientCreatePostButton from "@/app/components/ClientCreatePostButton";
import Error from "@/app/components/Error";
import PostFeed from "@/app/components/PostFeed";
import axiosInstance from "@/app/utils/axiosConfig";

export const metadata = {
  title: "All Posts - BlogSphere",
  description: "Browse all blog posts on BlogSphere",
};

async function fetchPosts() {
  try {
    const response = await axiosInstance.get("/posts");
    return response.data.data.posts || [];
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { error: "Failed to load posts. Please try again later." };
  }
}

export default async function PostsPage() {
  const postsData = await fetchPosts();

  if (postsData.error) {
    return <Error errMessage={postsData.error} />;
  }

  const posts = postsData;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            All Posts
          </h2>
          <ClientCreatePostButton />
        </div>
        <PostFeed initialPosts={posts} defaultCategory="All" />
      </main>
    </div>
  );
}
