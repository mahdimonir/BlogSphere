"use client";

import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";

export default function CommentActions({ id, token }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [deleted, setDeleted] = useState(false);

  const deleteComment = async () => {
    try {
      setErr(null);
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/suspension/comment/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        if (res.status == "404") throw new Error("Data not Found");
        else if (res.status == "400") throw new Error("Bad request");
        else if (res.status == "401") throw new Error("Unauthorized request");
        else if (res.status == "500")
          throw new Error("Internal server error, failed to fetch data.");
        else throw new Error("Failed to fetch data");
      }

      setDeleted(true);
      router.refresh(); // Refresh the UI
    } catch (err) {
      setErr(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-4 text-sm">
      <button
        onClick={deleteComment}
        className="text-red-500 px-3 disabled:opacity-50"
        disabled={loading || deleted}
      >
        {loading ? (
          <ClipLoader size={15} />
        ) : deleted ? (
          "Deleted"
        ) : err ? (
          <span className="text-red-500">{err}</span>
        ) : (
          "Delete"
        )}
      </button>
    </div>
  );
}
