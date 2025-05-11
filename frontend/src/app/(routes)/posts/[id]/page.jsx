import PostClient from "./PostClient";

export default function PostPage({ params }) {
  const id = params.id; // Resolved server-side
  return <PostClient id={id} />;
}
