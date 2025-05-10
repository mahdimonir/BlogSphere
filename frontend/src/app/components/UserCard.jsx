import { capitalizeFirstLetter } from "@/app/configs/constants";
import Image from "next/image";
import Link from "next/link";
import { Demo_Image } from "../assets/demo";

export default function UserCard({ user, onClick }) {
  const {
    userName = "Unknown User",
    email = "No email",
    avatar = Demo_Image,
    role = "User",
    _id,
  } = user;

  // Ensure the avatar URL uses https if possible
  const secureAvatarUrl =
    avatar && typeof avatar === "string" && avatar.startsWith("http://")
      ? avatar.replace("http://", "https://")
      : avatar || Demo_Image;

  return (
    <Link href={`/profile/${userName}`} onClick={onClick}>
      <div className="rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white transition-shadow hover:shadow-lg">
        {/* Avatar Section */}
        <div className="relative">
          <Image
            src={secureAvatarUrl}
            alt={userName}
            width={400}
            height={300}
            className="w-full h-32 object-cover"
            unoptimized
          />
          <div className="absolute top-3 left-3">
            <span className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-1 px-3 rounded-full text-xs font-medium">
              {capitalizeFirstLetter(role)}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Username */}
          <h3 className="font-bold text-lg mb-2">
            {capitalizeFirstLetter(userName)}
          </h3>

          {/* Email */}
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
            {email}
          </p>
        </div>
      </div>
    </Link>
  );
}
