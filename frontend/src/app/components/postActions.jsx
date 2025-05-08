"use client";

import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";

export default function PostActions({ id, token }) {
  const router = useRouter();
  const [suspendLoading, setSuspendLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [suspend, setSuspend] = useState(false);

 

  const suspendPost = async () => {
    try {
      setErr(null);
      setSuspendLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/suspension/post/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status == "404") throw new Error("Data not Found");
        else if (res.status == "400") throw new Error("Bad request");
        else if (res.status == "401") throw new Error("Unauthorized request");
        else if (res.status == "500") throw new Error("Internal server error");
        else throw new Error("Failed to fetch data");
      }
     setSuspend(true)
      router.push("/dashboard/posts?message=User account has been suspended");
    } catch (err) {
      setErr(err.message);
    } finally {
      setSuspendLoading(false);
    }
  };

  return (
    <div className="z-50 sticky top-0 mb-5 bg-white px-5 py-3 rounded flex">
      <div className="flex gap-3 text-sm items-center">
        <div className="px-3 mr-auto font-bold">Actions:</div>

        

        <div
          onClick={suspendPost}
          className="px-3 py-2 cursor-pointer rounded-md text-white bg-red-400 flex items-center"
        >
           {suspendLoading ? (
            <ClipLoader size={15} color="white" />
          ) : !suspend && err ? (
            err
          ) : (
            "Suspend"
          )}
        </div>
      </div>
    </div>
  );
}
