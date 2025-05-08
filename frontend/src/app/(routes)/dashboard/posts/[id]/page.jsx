
import { format } from 'date-fns';
import Image from 'next/image';
import { cookies } from 'next/headers';
import PostAction from '@/app/components/postActions';
import Link from "next/link";
import { MessageCircle, ThumbsUp } from 'lucide-react';
import CommentActions from '@/app/components/commentActions';
const BlogPostPage = async ({ params }) => {
  const cookieStore =await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const {id} =await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`,
    { cache: "no-store",
      headers: { Authorization: `Bearer ${token}` }
     }
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
          <div className="flex gap-4 mt-2 text-sm  items-center">
            <button className="text-gray-500 hover:text-gray-700">Like ({comment.likeCount})</button>
            <button className="text-gray-500 hover:text-gray-700">Reply</button>
            <CommentActions id={comment._id} token={token} />
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
    <div className="max-w-[1200px] mx-auto  flex flex-col px-4">
      <PostAction id={post._id}/>
      <article className="mb-12">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
          <Link  className='text-blue-400 w-full flex gap-3' href={`/dashboard/users/${post.author.userName}`}>
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
             {post.author.userName.charAt(0).toUpperCase()} 
            </div>
            <div>
              <p className="font-medium">{post.author.userName}</p>
              <p className="text-sm text-gray-500">
                {format(new Date(post.createdAt), 'MMM d, yyyy')}
              </p>
            </div>
            </Link>

          </div>
          <div className="flex gap-2 items-center">
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              {post.catagory[0]}
            </span>
            <span className="text-gray-500  flex items-center gap-1">
              {post.likeCount} <ThumbsUp size={'15px'} className='mt-[-3px]'  />
            </span>
            <span className="text-gray-500 flex items-center gap-1">
              {post.commentCount} <MessageCircle size={'15px'} className='mt-[-3px]' />
            </span>
          </div>
        </div>

        {post.image && (
          <div className="relative w-full h-96 mb-6 rounded-lg overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              className="object-cover"
              width={400}
              height={600}
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
      <section className='flex-1 '>
     Lorem ipsum dolor sit amet consectetur, adipisicing elit. Similique, tempore blanditiis laboriosam architecto ratione dolores nulla fugit explicabo at soluta quisquam distinctio modi veritatis ex laudantium eaque voluptas accusamus amet.
     Iusto, aperiam. Maxime minus odio doloremque eligendi eum quam. Libero fugit quas, saepe unde voluptate quod adipisci ipsa neque distinctio repellat? Itaque iste voluptas minima expedita. Minima officia reprehenderit error.



      </section>
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