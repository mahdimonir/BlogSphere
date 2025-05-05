
import React from 'react';
import { format } from 'date-fns';
import Image from 'next/image';
import { cookies } from 'next/headers';
const BlogPostPage = async ({ params }) => {
  const cookieStore = cookies();
  const token =cookieStore.get("accessToken")?.value;
  const id = params?.id || "";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`,
    { cache: "no-store" }
  );
  
  if (!res.ok){
    if(res.status=="404") throw new Error("Data not Found")
      else if( res.status=="400") throw new Error("Bad request")
       else if(res.status=="401") throw new Error("Unauthorized request")
        else if(res.status=="500") throw new Error("Internal server error")
         else{
        throw new Error("Failed to fecth data")
      }
}

  const data = await res.json();



  const post = data.data;

  // Helper function to render comments recursively
  const renderComments = (comments, level = 0) => {
    return comments.map((comment) => (
      <div 
        key={comment._id} 
        className={`mt-4 ${level > 0 ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''}`}
      >
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              {comment.author.userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium">{comment.author.userName}</p>
              <p className="text-xs text-gray-500">
                {format(new Date(comment.createdAt), 'MMM d, yyyy h:mm a')}
              </p>
            </div>
          </div>
          <p className="mt-2">{comment.content}</p>
          <div className="flex gap-4 mt-2 text-sm">
            <button className="text-gray-500 hover:text-gray-700">Like ({comment.likeCount})</button>
            <button className="text-gray-500 hover:text-gray-700">Reply</button>
          </div>
        </div>
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">
            {renderComments(comment.replies, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <article className="mb-12">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              {post.author.userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium">{post.author.userName}</p>
              <p className="text-sm text-gray-500">
                {format(new Date(post.createdAt), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              {post.catagory[0]}
            </span>
            <span className="text-gray-500 text-sm">
              {post.likeCount} {post.likeCount === 1 ? 'like' : 'likes'}
            </span>
            <span className="text-gray-500 text-sm">
              {post.commentCount} {post.commentCount === 1 ? 'comment' : 'comments'}
            </span>
          </div>
        </div>

        {post.image && (
          <div className="relative w-full h-96 mb-6 rounded-lg overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="prose max-w-none">
          <p>{post.content.replace(/^"|"$/g, '')}</p>
        </div>

        <div className="mt-6 flex gap-2">
          {post.tags.map((tag, index) => (
            <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
              {tag.replace(/^"|"$/g, '')}
            </span>
          ))}
        </div>
      </article>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Comments ({post.commentCount})</h2>
   

        <div className="space-y-4">
          {renderComments(post.comments)}
        </div>
      </section>
    </div>
  );
};

export default BlogPostPage;