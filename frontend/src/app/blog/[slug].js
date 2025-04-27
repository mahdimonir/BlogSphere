import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import Navbar from "../../components/Navbar";

// This would typically come from an API or CMS
const getBlogData = (slug) => {
    // Mock data for the example
    const blogPosts = {
        "exploring-nature-walk": {
            title: "Exploring my nature walk",
            content: `
        <p>With each step, I uncover the soothing sounds of the forest, rustling of leaves, and the fresh scent of the outdoors, offering readers a serene escape and a chance to reconnect with nature's wonders.</p>
        <p>The morning sun filtered through the canopy above, casting dappled shadows on the forest floor. I had set out early, hoping to catch the forest awakening from its slumber. The air was crisp and filled with the earthy scent that follows a night of gentle rain.</p>
        <p>As I ventured deeper into the woods, the sounds of civilization gradually faded, replaced by the symphony of nature. Birds called to one another from the treetops, while smaller creatures rustled through the underbrush, going about their daily routines.</p>
        <p>I paused by a small stream, its clear waters bubbling over smooth stones. Taking a moment to sit on a fallen log, I closed my eyes and just listened. It's amazing how much you can hear when you truly pay attention - the different notes in the birdsong, the varying rhythms of the water's flow, even the subtle sound of leaves dancing in the breeze.</p>
      `,
            image: "/images/nature-walk.jpg",
            author: "Alex || Traveler",
            authorImage: "/images/author.jpg",
            date: "25 April, 2025",
            readTime: "10 minutes read",
            category: "Adventure",
        },
    };

    return blogPosts[slug];
};

export default function BlogPost() {
    const router = useRouter();
    const { slug } = router.query;

    if (router.isFallback || !slug) {
        return <div>Loading...</div>;
    }

    const post = getBlogData(slug);

    if (!post) {
        return <div>Post not found</div>;
    }

    return (
        <div className="min-h-screen bg-white">
            <Head>
                <title>{post.title} - BlogSphere</title>
                <meta name="description" content={post.content.slice(0, 160)} />
            </Head>

            <Navbar />

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-6">
                        <div className="inline-block bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-xs mb-4">
                            {post.category}
                        </div>
                        <h1 className="text-3xl font-bold mb-4">
                            {post.title}
                        </h1>

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
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    ></article>
                </div>
            </main>
        </div>
    );
}
