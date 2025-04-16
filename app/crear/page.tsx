"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "../styles/textarea.css";

export default function CrearPost() {
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const router = useRouter();

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " && tagInput.trim() !== "") {
      e.preventDefault();
      addTag(tagInput.trim());
    }
  };

  const addTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <form className="flex-1 flex flex-col p-6 w-full h-full">
        <div className="editor-container">
          <textarea
            placeholder="Write anything you want"
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            className="full-textarea text-lg shadow-lg scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent hover:scrollbar-thumb-gray-300"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#E5E7EB transparent' }}
          />

          <div className="flex flex-col mt-4">
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <div key={tag} className="tag">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="tag-remove"
                  >
                    ×
                  </button>
                </div>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyDown={handleTagInputKeyDown}
                onBlur={() => tagInput.trim() !== "" && addTag(tagInput.trim())}
                placeholder="Agregar etiquetas (separadas por espacio)"
                className="py-1 px-3 rounded-md text-sm flex-grow shadow-lg border-none outline-none"
              />
            </div>

            <div className="flex w-full">
              <button
                type="submit"
                className="w-full bg-gray-800 text-white py-2 text-sm rounded-md hover:bg-gray-900 transition"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
