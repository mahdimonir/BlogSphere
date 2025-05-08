import Sidebar from "@/app/components/Sidebar";

export default function Manage() {
  const blogs = [
    {
      title: "Nature Walk",
      date: "25 April 2025",
      views: 500,
      status: "Published",
    },
    {
      title: "Bangladeshi Food",
      date: "24 April 2025",
      views: 800,
      status: "Published",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-700 text-white">
      <Sidebar />
      <main className="flex-grow p-6">
        <h1 className="text-2xl font-bold mb-6">Manage Blogs</h1>
        <table className="w-full table-auto bg-gray-900 rounded-lg overflow-hidden">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Views</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog, i) => (
              <tr key={i} className="border-t border-gray-700">
                <td className="p-3">{blog.title}</td>
                <td className="p-3">{blog.date}</td>
                <td className="p-3">{blog.views}</td>
                <td className="p-3 text-green-400">{blog.status}</td>
                <td className="p-3 space-x-2">
                  <button className="bg-blue-600 px-3 py-1 rounded">
                    Edit
                  </button>
                  <button className="bg-red-600 px-3 py-1 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
