"use client";

import TabActions from "@/app/components/tabActions";
import { useAuth } from "@/context/AuthContext"; // Make sure this is correctly set
import { API_URL } from "@/server";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
export default function User() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const params = useParams();
  const { token } = useAuth(); // Get token from context

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/users/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (res.status == "404") throw new Error("Data not Found");
          else if (res.status == "400") throw new Error("Bad request");
          else if (res.status == "401") throw new Error("Unauthorized request");
          else if (res.status == "500")
            throw new Error("Internal server error");
          else {
            throw new Error("Failed to fecth data");
          }
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        setErr(err);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchData();
  }, [params.id, token]);

  if (loading)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <BeatLoader color="gray" size="10px" />
      </div>
    );

  if (err)
    return (
      <div className="text-xl font-bold text-gray-600 w-full h-screen flex justify-center items-center">
        {err.message}
      </div>
    );
  //prevent ui from rendering if user is null for ui improvemnt
  return (
    <div className="w-full min-h-screen flex flex-col gap-3 p-3">
      <h1 className="font-bold text-bold ">User Details</h1>
      <div className="flex gap-5  flex-shrink-0 flex-col md:flex-row  items-center">
        <div className="flex gap-4 items-center">
          <div className="w-[100px] h-[100px] bg-gray-400 flex items-center text-white justify-center rounded-full">
            {" "}
            Photo
          </div>
          <div>
            <p>
              <strong>Name:</strong> {user?.data.name}
            </p>
            <p>
              <strong>Email:</strong> {user?.data.email}
            </p>
            <p>
              <strong>Phone:</strong> {user?.data.phone}
            </p>
            <p>
              <strong>Website:</strong> {user?.data.website}
            </p>
          </div>
        </div>
        <div className="grid w-[20rem]   grid-row-2 grid-cols-2 gap-3">
          <div className=" flex flex-col justify-center items-center bg-white p-5 shadow-xl w-full max-w-[10rem] h-[6rem] rounded-md">
            <span className="font-bold">Total posts</span>
            <span className="font-bold text-2xl">100</span>
          </div>
          <div className=" flex flex-col justify-center items-center bg-white p-5 shadow-xl w-full max-w-[10rem] h-[6rem] rounded-md">
            <span className="font-bold text-sm">Pending posts</span>
            <span className="font-bold text-2xl">100</span>
          </div>
          <div className=" flex flex-col justify-center items-center bg-white p-5 shadow-xl w-full max-w-[10rem] h-[6rem] rounded-md">
            <span className="font-bold">Total comments</span>
            <span className="font-bold text-2xl">100</span>
          </div>
          <div className=" flex flex-col justify-center items-center bg-white p-5 shadow-xl w-full max-w-[10rem] h-[6rem] rounded-md">
            <span className="font-bold">Total likes</span>
            <span className="font-bold text-2xl">100</span>
          </div>
        </div>
      </div>
      {/* client component for data fetching */}
      <TabActions
        tabs={[
          {
            content: "All posts",
            api: process.env.NEXT_PUBLIC_API_URL + "/posts/getAllPostsById",
          },
          {
            content: "Pending Posts",
            api:
              process.env.NEXT_PUBLIC_API_URL + "/posts/getAllPendingPostsById",
          },
          {
            content: "Suspended",
            api:
              process.env.NEXT_PUBLIC_API_URL +
              "/suspend/getAllSuspendPostsByUserId",
          },
          { content: "Actions", api: "" },
        ]}
        userInfo={user?.data}
      />
    </div>
  );
}
