import ClientWrapper from "@/app/components/clientWrapper";
import DashBoardSearch from "@/app/components/dashboard_user_details";
import { API_URL } from "@/server";
import { cookies } from "next/headers";
import Link from "next/link";

//Server component
export default async function Posts({ searchParams }) {
  const { search, deleted } = await searchParams;

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const res = await fetch(`${API_URL}/admin/suspend/posts`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    if (res.status == "404") throw new Error("Data not Found");
    else if (res.status == "400") throw new Error("Bad request");
    else if (res.status == "401") throw new Error("Unauthorized request");
    else if (res.status == "500")
      throw new Error("Internal server error , failed to fetch data.");
    else {
      throw new Error("Failed to fecth data");
    }
  }

  const data = await res.json();
  //Pagination logic
  const posts = Array.isArray(data.data.posts) ? data.data.posts : [];
  const currentPage = Number(search || 1);
  const pageSize = 10;
  const totalCount = posts.length;
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(start + pageSize - 1, totalCount);
  const paginatedPosts = posts.slice(start - 1, end);
  return (
    <>
      <div className="flex flex-col h-full ">
        {/* Table Section */}
        <div>
          {deleted && (
            <div className="p-2 text-green-400">
              Post had been deleted successfully
            </div>
          )}
        </div>
        <div className="px-5 min-w-[20rem] overflow-x-auto bg-white mx-5 rounded-2xl">
          <div className="flex gap-3 items-center mb-4">
            <h1 className="text-md font-bold">All Posts</h1>
            <DashBoardSearch
              api="/dashboard/posts"
              placeholder="Search by username"
            />
            <div className="text-gray-500 text-sm ml-auto">
              Showing items: {start} - {end}
            </div>
          </div>

          <table className="min-w-full table-auto text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="border-b p-3 text-left">Post Id</th>
                <th className="border-b p-3 text-left">Created at</th>
                <th className="border-b p-3 text-left">Author</th>
                <th className="border-b p-3 text-left">Title</th>
                <th className="border-b p-3 text-left">Comments</th>
                <th className="border-b p-3 text-left">Likes</th>
                <th className="border-b p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPosts.map((post) => (
                <tr key={post._id} className="hover:bg-gray-50">
                  <td className="border-b p-3">{post._id}</td>
                  <td className="border-b p-3">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="border-b p-3">
                    <Link
                      href={`/profile/${post.author.userName}`}
                      className="text-blue-500"
                    >
                      {post.author.userName}
                    </Link>
                  </td>
                  <td className="border-b p-3">{post.title}</td>
                  <td className="border-b p-3">{post.comments.length}</td>
                  <td className="border-b p-3">{post.likes.length}</td>
                  <td className="border-b p-3">
                    <Link
                      href={`/dashboard/posts/${post._id}`}
                      className="text-sm text-[#00B087] bg-[#16C098]/50 px-3 rounded border border-[#16C098]"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="mt-4">
            <ClientWrapper
              currentPage={currentPage}
              pageSize={pageSize}
              totalCount={totalCount}
              api="/dashboard/posts"
            />
          </div>
        </div>
      </div>
    </>
  );
}
