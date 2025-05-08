import Sidebar from "@/app/components/Sidebar";

export default function MostPopular() {
  const popular = [
    { title: "Street Food Diaries", views: 10000 },
    { title: "Forest Nights", views: 8500 },
    { title: "Tech in the Wild", views: 6000 },
  ];

  return (
    <div className="flex min-h-screen bg-gray-700 text-white">
      <Sidebar />
      <main className="flex-grow p-6">
        <h1 className="text-2xl font-bold mb-6">Most Popular Blogs</h1>
        <table className="w-full table-auto bg-gray-900 rounded-lg overflow-hidden">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Views</th>
            </tr>
          </thead>
          <tbody>
            {popular.map((blog, i) => (
              <tr key={i} className="border-t border-gray-700">
                <td className="p-3">{blog.title}</td>
                <td className="p-3 text-yellow-400">{blog.views}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
