export default function ProfileSidebarInfo() {
    return (
        <div className="w-80 flex-shrink-0 p-6 text-white">
            <div className="flex flex-col items-center text-center">
                <img
                    src="/avatar.png" // Replace with user image path or upload logic
                    alt="User avatar"
                    className="w-32 h-32 rounded-full mb-4 bg-gray-400"
                />
                <h2 className="text-xl font-bold">Taposh Barman</h2>
                <p className="text-sm text-gray-400">
                    100k followers | 140 Posts
                </p>
                <p className="text-sm mt-2 text-gray-400">
                    Interested in Traveling
                </p>
                <p className="text-sm text-gray-400">📍 Dhaka, Bangladesh</p>
                <p className="text-xs text-gray-500 mt-2">
                    Joined date: 1 Jan, 2025
                </p>
            </div>
        </div>
    );
}
