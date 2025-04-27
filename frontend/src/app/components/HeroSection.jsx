import Image from "next/image";
import Link from "next/link";
import CategoryButton from "./CategoryButton";

export default function HeroSection({ post }) {
    const { title, excerpt, image, author, authorImage, date, readTime, slug } =
        post;

    return (
        <div className="relative h-[550px] mb-12">
            <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
                priority
            />

            <div className="absolute top-24 left-8 z-10">
                <CategoryButton category="Trending Blogs" active={true} />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8 text-white">
                <h1 className="text-4xl font-bold mb-4">{title}</h1>
                <p className="mb-4 max-w-2xl">{excerpt}</p>

                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span>{date}</span>
                        <span>·</span>
                        <span>{readTime}</span>
                    </div>

                    <Link
                        href={`/blog/${slug}`}
                        className="bg-white text-black px-4 py-2 rounded-md text-sm"
                    >
                        Read now
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    <Image
                        src={authorImage}
                        alt={author}
                        width={40}
                        height={40}
                        className="rounded-full"
                    />
                    <span>{author}</span>
                </div>
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {[...Array(5)].map((_, i) => (
                    <button
                        key={i}
                        className={`h-2 w-2 rounded-full ${
                            i === 0 ? "bg-white" : "bg-white/50"
                        }`}
                    ></button>
                ))}
            </div>
        </div>
    );
}
