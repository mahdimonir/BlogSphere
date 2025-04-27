import { useState } from "react";
import CategoryButton from "./CategoryButton";

export default function FilterBar({
    activeCategory = "All",
    sortBy = "Newest",
}) {
    const categories = [
        "All",
        "Adventure",
        "Food",
        "Technologies",
        "Travel",
        "Art",
    ];
    const sortOptions = ["Newest", "Popular", "Trending"];

    const [selectedSort, setSelectedSort] = useState(sortBy);

    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Popular blogs</h2>

            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {categories.map((category) => (
                        <CategoryButton
                            key={category}
                            category={category}
                            active={category === activeCategory}
                        />
                    ))}
                </div>

                <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">Sort by:</span>
                    <select
                        value={selectedSort}
                        onChange={(e) => setSelectedSort(e.target.value)}
                        className="bg-transparent font-medium cursor-pointer"
                    >
                        {sortOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}
