import DashBoardSearch from "@/app/components/dashboard_user_details";
import ClientWrapper from "@/app/components/clientWrapper";
import Link from "next/link";

export default async function UserManagement({ searchParams }) {
  const search = searchParams?.search || "";
  const currentPage = Number(searchParams?.page || 1);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users?search=${search}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("No user found!");
  }

  const data = await res.json();

  const users = Array.isArray(data.data) ? data.data : [data.data];
  const pageSize = 10;
  const totalCount = users.length;
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(start + pageSize - 1, totalCount);

  const paginatedItems = users.slice(start - 1, end);

  return (
    <div className="flex w-full min-h-full flex-col p-5">
      {/* Summary Cards */}
      <div className="w-full flex gap-4 py-5">
        <SummaryCard label="All members" value={users.length} />
        <SummaryCard label="New members" value="1k" />
        <SummaryCard label="Suspend users" value="900" />
      </div>

      {/* Table Section */}
      <div className="p-5 w-full min-w-[18rem] overflow-x-auto bg-white  rounded-2xl shadow-lg">
        <div className="flex gap-3 items-center mb-4">
          <h1 className="text-md font-bold">All members</h1>
          <DashBoardSearch api="/dashboard/users" placeholder="Search by username" />
          <div className="text-gray-500 text-sm ">
            Showing items: {start} - {end}
          </div>
        </div>

        <table className="w-full table-auto text-sm mt-4">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="border-b p-3 text-left">Customer Name</th>
              <th className="border-b p-3 text-left">Join Date</th>
              <th className="border-b p-3 text-left">Contact</th>
              <th className="border-b p-3 text-left">Email</th>
              <th className="border-b p-3 text-left">Country</th>
              <th className="border-b p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="border-b p-3">{user.name || "N/A"}</td>
                <td className="border-b p-3">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="border-b p-3">{user.phone || "N/A"}</td>
                <td className="border-b p-3">{user.email || "N/A"}</td>
                <td className="border-b p-3">{user.country || "N/A"}</td>
                <td className="border-b p-3">
                  <Link
                    href={`/dashboard/users/${user.userName}`}
                    className="text-sm cursor-pointer text-[#00B087] bg-[#16C098]/50 px-3 rounded text-center border border-[#16C098]"
                  >
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="w-full mt-4">
          <ClientWrapper
            currentPage={currentPage}
            pageSize={pageSize}
            totalCount={totalCount}
            api="/dashboard/users"
          />
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="min-w-[9rem] h-[6rem] bg-white flex flex-col items-center gap-3 p-5 shadow-2xl rounded-3xl">
      <span className="font-bold text-sm">{label}</span>
      <span className="font-bold text-xl">{value}</span>
    </div>
  );
}
