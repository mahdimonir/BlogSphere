import lottieJSON from "@/app/assets/lottieFiles/lottie.json";
import {
  calculateReadTime,
  capitalizeFirstLetter,
  formatDate,
} from "@/app/configs/constants";
import { useAuth } from "@/context/AuthContext";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Demo_Image } from "../assets/demo";
import CategoryButton from "./CategoryButton";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function HeroSection({ posts }) {
  const { user } = useAuth();

  return (
    <>
      {user ? (
        <div className="relative w-full h-[550px] mb-12">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            className="w-full h-full"
          >
            {posts.map((post) => (
              <SwiperSlide key={post._id}>
                <div className="relative w-full h-full">
                  <Image
                    src={post.image || Demo_Image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute top-24 left-8 z-10">
                    <CategoryButton category="Trending" active={true} />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8 text-white">
                    <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                    {post.content && (
                      <p className="text-gray-300 mb-4 max-w-2xl">
                        {post.content.slice(0, 200) +
                          (post.content.length > 200 ? "..." : "")}
                      </p>
                    )}
                    <div className="flex items-center justify-between mb-4">
                      {post.createdAt && (
                        <div className="flex items-center gap-2 text-gray-400">
                          {formatDate(post.createdAt)} ·{" "}
                          {calculateReadTime(post.content)}
                        </div>
                      )}
                      <Link
                        href={`/posts/${post._id}`}
                        className="bg-white text-black hover:bg-blue-500 hover:text-white px-4 py-2 rounded-md text-sm"
                      >
                        Read now
                      </Link>
                    </div>
                    <div className="flex items-center gap-2">
                      <Image
                        src={post.author?.avatar || Demo_Image}
                        alt={post.author?.userName || "Unknown"}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <Link
                        href={`/users/${post.author?._id || ""}`}
                        className="hover:text-blue-500"
                      >
                        <span>
                          {capitalizeFirstLetter(
                            post.author?.userName || "Unknown"
                          )}
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <div className="relative w-full h-[80vh] mb-12">
          <div className="max-w-[1200px] mx-auto px-3 h-full w-full flex md:flex-row flex-col items-center">
            <div className="flex-1 flex flex-col h-full md:items-start md:justify-center items-center p-5 md:p-0 gap-5">
              <h1 className="text-center md:text-left xl:text-6xl md:text-5xl text-4xl font-bold md:max-w-[700px] max-w-[500px] dark:text-white">
                Discover blogs, share and explore the world with people
              </h1>
              <p className="font-semibold bg-gray-700 dark:bg-gray-100 hover:bg-blue-500 hover:text-white text-white dark:text-black px-3 py-2 rounded-md">
                <Link href="/signup">Join our community</Link>
              </p>
            </div>
            <div className=" dark:bg-[#999696] xl:w-[400px] md:w-[350px] w-[250px] rounded-md h-[300px] md:ml-auto">
              <Lottie
                animationData={lottieJSON}
                loop={true}
                autoplay={true}
                style={{ width: "100%", height: "100%", marginLeft: "auto" }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
