import { useState } from "react";

export default function SectionEditor({ onAdd }) {
    const [section, setSection] = useState("Introduction");
    const [text, setText] = useState("");
    const [image, setImage] = useState(null);

    const handleCreate = () => {
        onAdd({ section, text, image });
        setText("");
        setImage(null);
    };

    return (
        <div className="border p-4 mt-6 rounded-lg bg-gray-900 text-white">
            <label className="block mb-2">Select section</label>
            <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="bg-gray-800 text-white p-2 mb-4 rounded w-full"
            >
                <option>Introduction</option>
                <option>Sights & Sounds</option>
                <option>Traditions</option>
            </select>

            <textarea
                rows={5}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Describe section..."
                className="w-full p-3 bg-gray-800 text-white rounded mb-4"
            />

            <label className="block mb-2">Image upload (optional)</label>
            <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="mb-4"
            />

            <button
                onClick={handleCreate}
                className="bg-green-600 text-white px-4 py-2 rounded"
            >
                Create section
            </button>
        </div>
    );
}
