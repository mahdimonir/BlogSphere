"use client";

import axiosInstance from "@/app/utils/axiosConfig";
import { Ban, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import Error from "./Error";
import Loading from "./Loading";

export default function SuspendedList({ type, isAdmin, userId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [suspendLoading, setSuspendLoading] = useState({});

  useEffect(() => {
    const fetchItems = async () => {
      try {
        let endpoint;
        if (isAdmin) {
          endpoint = `/admin/suspended/${type}`;
        } else {
          endpoint = `/users/suspend/${type}`;
        }
        const response = await axiosInstance.get(endpoint);
        setItems(response.data.data[type] || []);
      } catch (err) {
        setError(
          err.response?.data?.message || `Failed to fetch suspended ${type}`
        );
      } finally {
        setLoading(false);
      }
    };
    if (userId || isAdmin) {
      fetchItems();
    }
  }, [type, isAdmin, userId]);

  const handleToggleSuspend = async (id, userName) => {
    if (!isAdmin) return;
    setSuspendLoading((prev) => ({ ...prev, [id || userName]: true }));
    try {
      const endpoint =
        type === "users"
          ? `/admin/suspend/user/${userName}`
          : type === "posts"
          ? `/admin/suspend/post/${id}`
          : `/admin/suspend/comment/${id}`;
      const response = await axiosInstance.patch(endpoint);
      setItems((prev) =>
        prev.map((item) =>
          item._id === id || item.userName === userName
            ? { ...item, isSuspended: response.data.data.isSuspended }
            : item
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message || `Failed to toggle ${type} suspension`
      );
    } finally {
      setSuspendLoading((prev) => ({ ...prev, [id || userName]: false }));
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

  return (
    <div className="grid gap-4">
      {items.length > 0 ? (
        items.map((item) => (
          <div
            key={item._id || item.userName}
            className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg flex justify-between items-center"
          >
            <div>
              {type === "users" && (
                <>
                  <h3 className="font-medium">
                    {item.name} (@{item.userName})
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {item.email}
                  </p>
                </>
              )}
              {type === "posts" && (
                <>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {item.excerpt}
                  </p>
                </>
              )}
              {type === "comments" && (
                <>
                  <p className="text-gray-600 dark:text-gray-400">
                    {item.content}
                  </p>
                  <p className="text-sm text-gray-500">
                    By: @{item.author.userName}
                  </p>
                </>
              )}
              <p className="text-sm text-gray-500">
                Status: {item.isSuspended ? "Suspended" : "Active"}
              </p>
            </div>
            {isAdmin && (
              <button
                onClick={() => handleToggleSuspend(item._id, item.userName)}
                disabled={suspendLoading[item._id || item.userName]}
                className={`flex items-center px-3 py-1 rounded text-white ${
                  item.isSuspended
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                } ${
                  suspendLoading[item._id || item.userName]
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {suspendLoading[item._id || item.userName] ? (
                  "Loading..."
                ) : item.isSuspended ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" /> Unsuspend
                  </>
                ) : (
                  <>
                    <Ban className="h-4 w-4 mr-1" /> Suspend
                  </>
                )}
              </button>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500">No suspended {type}</p>
      )}
    </div>
  );
}
