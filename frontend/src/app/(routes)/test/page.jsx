import { API_URL } from "@/server";
import { notFound } from "next/navigation";
import ClientPostPage from "./client-post";

// Fetch post data
async function fetchPost(postId) {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}`, {
      cache: "no-store", // Disable caching for fresh data
    });
    if (!response.ok) throw new Error("Post not found");
    const data = await response.json();
    return data.data; // { _id, title, content, ... }
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
}

// Fetch comments data
async function fetchComments(postId) {
  try {
    const response = await fetch(`${API_URL}/comments/${postId}`, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Comments not found");
    const data = await response.json();
    return data.data; // [{ _id, content, author, parentComment, ... }, ...]
  } catch (error) {
    console.error("Error fetching comments:", error);
    return []; // Return empty array if comments fetch fails
  }
}

// Server component
export default async function PostPage({ params }) {
  const { postId } = params;

  try {
    // Fetch post and comments concurrently
    const [post, initialComments] = await Promise.all([
      fetchPost(postId),
      fetchComments(postId),
    ]);

    return (
      <ClientPostPage
        post={post}
        initialComments={initialComments}
        postId={postId}
      />
    );
  } catch (error) {
    notFound(); // Redirect to 404 page if post not found
  }
}

// Optional: Generate metadata for SEO
export async function generateMetadata({ params }) {
  try {
    const post = await fetchPost(params.postId);
    return {
      title: post.title,
      description: post.content.slice(0, 160),
    };
  } catch (error) {
    return {
      title: "Post Not Found",
      description: "The requested post could not be found.",
    };
  }
}
