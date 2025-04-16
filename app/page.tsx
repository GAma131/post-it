"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./styles/textarea.css";

export default function Home() {
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
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

      // Cmd/Ctrl + E para alternar la vista previa
      if ((e.metaKey || e.ctrlKey) && e.key === "e") {
        e.preventDefault();
        setShowPreview(!showPreview);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Limpiar event listener
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [tags, showPreview]); // Dependencias actualizadas

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
    // router.push("/posts");
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <div className="h-[calc(100vh-56px)] flex flex-col items-center">
      <form
        className="flex flex-col pt-1 px-6 w-full max-w-7xl mx-auto"
        onSubmit={handleSubmit}
      >
        <div className="editor-container">
          <div className="relative">
            {!showPreview ? (
              <textarea
                ref={textareaRef}
                placeholder="Escribe en Markdown..."
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                className="full-textarea text-lg shadow-lg scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent hover:scrollbar-thumb-gray-300"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#E5E7EB transparent",
                }}
              />
            ) : (
              <div className="full-textarea overflow-auto shadow-lg p-6 bg-white prose prose-lg max-w-none">
                {contenido ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {contenido}
                  </ReactMarkdown>
                ) : (
                  <p className="text-gray-400 italic">
                    La vista previa aparecerá aquí...
                  </p>
                )}
              </div>
            )}
          </div>

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
              <div className="w-full flex justify-end mt-1 gap-3">
                <span className="text-xs text-gray-500">
                  <kbd className="bg-gray-100 px-1.5 py-0.5 rounded">
                    Alternar markdown ⌘E
                  </kbd>
                </span>
                <span className="text-xs text-gray-500">
                  <kbd className="bg-gray-100 px-1.5 py-0.5 rounded">
                    Eliminar etiqueta ⌘⌫
                  </kbd>
                </span>
              </div>
            </div>

            <div className="flex w-full justify-end">
              <button
                type="submit"
                className="w-full md:w-1/2 lg:w-1/4 bg-gray-800 text-white py-2 text-sm rounded-md hover:bg-gray-900 transition"
              >
                Publicar
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
