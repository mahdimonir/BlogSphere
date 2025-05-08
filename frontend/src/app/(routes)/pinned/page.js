import Sidebar from "@/app/components/Sidebar";

export default function Pinned() {
  const pinned = [
    { title: "Forest Adventures", pinnedOn: "20 April 2025" },
    { title: "Dhaka Street Food" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-700 text-white">
      <Sidebar />
      <main className="flex-grow p-6">
        <h1 className="text-2xl font-bold mb-6">Pinned Blogs</h1>
        <ul className="space-y-4">
          {pinned.map((item, i) => (
            <li
              key={i}
              className="bg-gray-800 p-4 rounded flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-400">
                  Pinned on: {item.pinnedOn || "Unknown"}
                </p>
              </div>
              <button className="bg-red-600 px-3 py-1 rounded">Unpin</button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
