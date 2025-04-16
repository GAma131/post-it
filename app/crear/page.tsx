"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import "../styles/textarea.css";

export default function CrearPost() {
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Establecer el foco en el textarea al cargar la página
    if (textareaRef.current) {
      textareaRef.current.focus();
    }

    // Event listener para atajos de teclado globales
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Backspace para eliminar la última etiqueta
      if ((e.metaKey || e.ctrlKey) && e.key === "Backspace") {
        e.preventDefault();
        if (tags.length > 0) {
          removeLastTag();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Limpiar event listener
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [tags]); // Dependencia de tags para que siempre tenga la lista actualizada

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Agregar etiqueta al presionar espacio o Enter
    if ((e.key === " " || e.key === "Enter") && tagInput.trim() !== "") {
      e.preventDefault();
      addTag(tagInput.trim());
      // Asegurar que el input mantenga el foco después de agregar la etiqueta
      setTimeout(() => {
        if (tagInputRef.current) {
          tagInputRef.current.focus();
        }
      }, 0);
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

  const removeLastTag = () => {
    setTags(tags.slice(0, -1));
    // Asegurar que el input mantenga el foco después de eliminar la última etiqueta
    setTimeout(() => {
      if (tagInputRef.current) {
        tagInputRef.current.focus();
      }
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el post
    console.log("Publicando:", { contenido, tags });
    alert("Post enviado con éxito");
    // router.push("/");
  };

  return (
    <div className="h-[calc(100vh-56px)] flex flex-col items-center">
      <form
        className="flex flex-col pt-1 px-6 w-full max-w-7xl mx-auto"
        onSubmit={handleSubmit}
      >
        <div className="editor-container">
          <textarea
            ref={textareaRef}
            placeholder="Write anything you want"
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            className="full-textarea text-lg shadow-lg scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent hover:scrollbar-thumb-gray-300"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#E5E7EB transparent",
            }}
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
                ref={tagInputRef}
                type="text"
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyDown={handleTagInputKeyDown}
                onBlur={() => tagInput.trim() !== "" && addTag(tagInput.trim())}
                placeholder="Etiquetas"
                className="w-full md:w-1/2 lg:w-1/2 py-1 px-3 rounded-md text-sm shadow-lg border-none outline-none text-right ml-auto"
              />
            </div>

            <div className="flex w-full justify-end">
              <button
                type="submit"
                className="w-full md:w-1/2 lg:w-1/4 bg-gray-800 text-white py-2 text-sm rounded-md hover:bg-gray-900 transition"
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
