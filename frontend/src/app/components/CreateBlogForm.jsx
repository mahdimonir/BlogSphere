import { useState } from "react";
import SectionEditor from "./SectionEditor";

export default function CreateBlogForm() {
    const [sections, setSections] = useState([]);
    const [toc, setToc] = useState(["Introduction", "Sights & Sounds"]);

    const addSection = (section) => setSections([...sections, section]);

    return (
        <form className="w-full p-6 text-white bg-gray-700">
            <h2 className="text-2xl font-semibold mb-6">Create a Blog</h2>

            <div className="mb-4">
                <label>Title</label>
                <input
                    type="text"
                    placeholder='eg "My first blog"'
                    className="w-full p-2 bg-gray-800 rounded mt-1"
                />
            </div>

            <div className="mb-4">
                <label>Category</label>
                <select className="w-full p-2 bg-gray-800 rounded mt-1">
                    <option>Travel</option>
                    <option>Food</option>
                    <option>Adventure</option>
                </select>
            </div>

            <div className="mb-4">
                <label>Image upload</label>
                <input type="file" className="block mt-1" />
                <small className="text-gray-400">
                    (Add two images max, 600x400 recommended)
                </small>
            </div>

            <div className="mb-4">
                <label>Tags</label>
                <input
                    type="text"
                    placeholder='eg "Traveling, Relax"'
                    className="w-full p-2 bg-gray-800 rounded mt-1"
                />
            </div>

            <div className="mb-4">
                <label>Author</label>
                <input
                    type="text"
                    value="Taposh Barman"
                    disabled
                    className="w-full p-2 bg-gray-700 rounded mt-1 text-gray-400"
                />
            </div>

            <div className="mb-4">
                <label>Add table of contents</label>
                <div className="flex items-center mt-1">
                    <input
                        type="text"
                        className="flex-grow p-2 bg-gray-800 rounded"
                        placeholder="Add TOC item"
                    />
                    <button
                        type="button"
                        className="ml-2 px-4 py-2 bg-gray-700 rounded"
                    >
                        Add
                    </button>
                </div>
                <ul className="list-decimal ml-6 mt-2 text-sm text-gray-300">
                    {toc.map((item, i) => (
                        <li key={i}>{item}</li>
                    ))}
                </ul>
            </div>

            <SectionEditor onAdd={addSection} />

            <div className="flex justify-end gap-4 mt-6">
                <button type="button" className="bg-blue-600 px-6 py-2 rounded">
                    Preview
                </button>
                <button type="submit" className="bg-gray-600 px-6 py-2 rounded">
                    Save as draft
                </button>
            </div>
        </form>
    );
}
