import Sidebar from "@/app/components/Sidebar";
export default function Draft() {
  const drafts = [
    { title: "New Travel Tips", date: "26 April 2025" },
    { title: "Mountain Trekking Guide", date: "23 April 2025" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-700 text-white">
      <Sidebar />
      <main className="flex-grow p-6">
        <h1 className="text-2xl font-bold mb-6">Draft Blogs</h1>
        <ul className="space-y-4">
          {drafts.map((item, i) => (
            <li
              key={i}
              className="bg-gray-800 p-4 rounded flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-400">
                  Last edited: {item.date}
                </p>
              </div>
              <div className="space-x-2">
                <button className="bg-blue-600 px-3 py-1 rounded">Edit</button>
                <button className="bg-gray-600 px-3 py-1 rounded">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
