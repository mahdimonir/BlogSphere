"use client";

import { Demo_Image } from "@/app/assets/demo";
import Error from "@/app/components/Error";
import Loading from "@/app/components/Loading";
import TabActions from "@/app/components/tabActions";
import axiosInstance from "@/app/utils/axiosConfig"; // Use axiosInstance
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function User() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/users/${params.userName}`);
        setUser(res.data?.data); // Set user data from API response
      } catch (err) {
        setErr(err.response?.data?.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (params.userName) fetchData();
  }, [params.userName]);

  if (loading) {
    return <Loading />;
  }

  if (err) {
    return <Error errMessage={err} />;
  }
  const secureAvatarUrl =
    user.avatar &&
    typeof user.avatar === "string" &&
    user.avatar.startsWith("http://")
      ? user.avatar.replace("http://", "https://")
      : user.avatar || Demo_Image;

  return (
    <div className="w-full min-h-screen flex flex-col gap-3 p-3">
      <h1 className="font-bold text-bold">User Details</h1>
      <div className="flex gap-5 flex-shrink-0 flex-col md:flex-row items-center">
        <div className="flex gap-4 items-center">
          <div className="w-[100px] h-[100px] bg-gray-400 flex items-center text-white justify-center rounded-full">
            <Image
              src={secureAvatarUrl}
              alt={user.userName}
              width={400}
              height={300}
              className="w-full h-32 object-cover"
              unoptimized
            />
          </div>
          <div>
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone}
            </p>
            <p>
              <strong>Website:</strong> {user.website}
            </p>
          </div>
        </div>
        <div className="grid w-[20rem] grid-row-2 grid-cols-2 gap-3">
          <div className="flex flex-col justify-center items-center bg-white p-5 shadow-xl w-full max-w-[10rem] h-[6rem] rounded-md">
            <span className="font-bold">Total posts</span>
            <span className="font-bold text-2xl">100</span>
          </div>
          <div className="flex flex-col justify-center items-center bg-white p-5 shadow-xl w-full max-w-[10rem] h-[6rem] rounded-md">
            <span className="font-bold text-sm">Pending posts</span>
            <span className="font-bold text-2xl">100</span>
          </div>
          <div className="flex flex-col justify-center items-center bg-white p-5 shadow-xl w-full max-w-[10rem] h-[6rem] rounded-md">
            <span className="font-bold">Total comments</span>
            <span className="font-bold text-2xl">100</span>
          </div>
          <div className="flex flex-col justify-center items-center bg-white p-5 shadow-xl w-full max-w-[10rem] h-[6rem] rounded-md">
            <span className="font-bold">Total likes</span>
            <span className="font-bold text-2xl">100</span>
          </div>
        </div>
      </div>
      <TabActions
        tabs={[
          {
            content: "All posts",
            api: `posts/my`,
          },
          { content: "Actions", api: "" },
        ]}
        userInfo={user}
      />
    </div>
  );
}
