export default function FilterBar({
  activeCategory,
  setActiveCategory,
  sortBy,
  setSortBy, // Add setSortBy to update the sorting option
}) {
  const categories = [
    "All",
    "Adventure",
    "Food",
    "Technologies",
    "Travel",
    "Art",
  ];

  const sortOptions = ["Newest", "Oldest", "Most Liked", "Most Commented"]; // Sorting options

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      {/* Category Filters */}
      <div className="w-full md:w-auto">
        {/* Dropdown for small screens */}
        <select
          value={activeCategory}
          onChange={(e) => setActiveCategory(e.target.value)}
          className="block md:hidden w-full px-3 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {/* Buttons for larger screens */}
        <div className="hidden md:flex gap-4">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full ${
                activeCategory === category
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-2 w-full md:w-auto">
        <span className="text-sm text-gray-600 dark:text-gray-300">
          Sort By:
        </span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)} // Update the sorting option
          className="w-full md:w-auto px-3 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
        >
          {sortOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
