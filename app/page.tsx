"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import "./styles/textarea.css";

// Componentes
import MarkdownEditor from "./components/MarkdownEditor";
import TagInput from "./components/TagInput";
import PublishButton from "./components/PublishButton";

// Hooks
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";

// Claves para localStorage
const STORAGE_KEYS = {
  CONTENT: "post-it-content",
  TAGS: "post-it-tags",
  PREVIEW: "post-it-preview-mode",
};

export default function Home() {
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Cargar datos guardados de localStorage al cargar la página
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Cargar contenido guardado
        const savedContent = localStorage.getItem(STORAGE_KEYS.CONTENT);
        if (savedContent) {
          setContenido(savedContent);
        }

        // Cargar etiquetas guardadas
        const savedTags = localStorage.getItem(STORAGE_KEYS.TAGS);
        if (savedTags) {
          setTags(JSON.parse(savedTags));
        }

        // Cargar estado de vista previa
        const savedPreviewMode = localStorage.getItem(STORAGE_KEYS.PREVIEW);
        if (savedPreviewMode) {
          setShowPreview(savedPreviewMode === "true");
        }

        setIsInitialLoad(false);
      } catch (error) {
        console.error("Error al cargar datos guardados:", error);
        setIsInitialLoad(false);
      }
    }
  }, []);

  // Guardar contenido en localStorage cuando cambie
  useEffect(() => {
    if (!isInitialLoad && typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.CONTENT, contenido);
    }
  }, [contenido, isInitialLoad]);

  // Guardar etiquetas en localStorage cuando cambien
  useEffect(() => {
    if (!isInitialLoad && typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
    }
  }, [tags, isInitialLoad]);

  // Guardar estado de vista previa
  useEffect(() => {
    if (!isInitialLoad && typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.PREVIEW, showPreview.toString());
    }
  }, [showPreview, isInitialLoad]);

  // Uso del hook personalizado para los atajos de teclado
  useKeyboardShortcuts([
    {
      key: "e",
      ctrlKey: true,
      metaKey: true,
      handler: () => setShowPreview(!showPreview),
    },
    {
      key: "Backspace",
      ctrlKey: true,
      metaKey: true,
      handler: () => {
        if (tags.length > 0) {
          removeLastTag();
        }
      },
    },
  ]);

  useEffect(() => {
    // Establecer el foco en el textarea al cargar la página
    if (textareaRef.current && !showPreview) {
      textareaRef.current.focus();
    }
  }, [showPreview]);

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

    // Limpiar localStorage después de publicar exitosamente
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.CONTENT);
      localStorage.removeItem(STORAGE_KEYS.TAGS);
    }

    alert("Post enviado con éxito");
    // Redireccionar y resetear el estado
    setContenido("");
    setTags([]);
    // router.push("/posts");
  };

  const handleTagInputBlur = () => {
    if (tagInput.trim() !== "") {
      addTag(tagInput.trim());
    }
  };

  return (
    <div className="h-[calc(100vh-56px)] flex flex-col items-center">
      <form
        className="flex flex-col pt-1 px-6 w-full max-w-7xl mx-auto"
        onSubmit={handleSubmit}
      >
        <div className="editor-container">
          <MarkdownEditor
            value={contenido}
            onChange={setContenido}
            showPreview={showPreview}
            textareaRef={textareaRef}
          />

          <div className="flex flex-col mt-4">
            <TagInput
              tags={tags}
              tagInput={tagInput}
              tagInputRef={tagInputRef}
              onTagInputChange={handleTagInputChange}
              onTagInputKeyDown={handleTagInputKeyDown}
              onTagRemove={removeTag}
              onTagInputBlur={handleTagInputBlur}
              showPreview={showPreview}
              togglePreview={() => setShowPreview(!showPreview)}
              removeLastTag={removeLastTag}
            />

            <PublishButton />
          </div>
        </div>
      </form>
    </div>
  );
}
