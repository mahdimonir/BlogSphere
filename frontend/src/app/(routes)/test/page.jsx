// app/blog/[slug]/page.jsx
import Image from "next/image";

const getBlogData = (slug) => {
  const blogPosts = {
    "exploring-nature-walk": {
      title: "Exploring my nature walk",
      content: `<p>With each step, I uncover the soothing sounds of the forest, rustling of leaves, and the fresh scent of the outdoors, offering readers a serene escape and a chance to reconnect with nature's wonders.</p>`,
      image: "/images/nature-walk.png",
      author: "Alex || Traveler",
      authorImage: "/images/author.jpg",
      date: "25 April, 2025",
      readTime: "10 minutes read",
      category: "Adventure",
    },
  };
  return blogPosts[slug];
};

export default function BlogPost({ params }) {
  const { slug } = params;
  const post = getBlogData(slug);

  if (!post) {
    return <div className="text-center py-10">Post not found</div>;
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <span className="inline-block bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-xs mb-4">
              {post.category}
            </span>
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Image
                  src={post.authorImage}
                  alt={post.author}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="text-sm">{post.author}</span>
              </div>
              <div className="text-sm text-gray-500">
                {post.date} · {post.readTime}
              </div>
            </div>
          </div>

          <div className="relative h-[400px] mb-8">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>

          <article
            className="prose max-w-none"
            // dangerouslySetInnerHTML={{ __html: post.content }}
          >
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Unde nisi,
            doloremque esse vero dolores quas eveniet voluptas repudiandae
            pariatur voluptatibus quod quae et reiciendis fugit autem atque
            vitae aspernatur facilis.
          </article>
        </div>
      </main>
    </div>
  );
}
