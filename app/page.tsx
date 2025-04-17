"use client";

import { useState, useEffect, useRef } from "react";
import "./styles/textarea.css";

// Hooks
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useTagManager } from "./hooks/useTagManager";
import { useLocalStorage } from "./hooks/useLocalStorage";

// Componentes
import EditorForm from "./components/principal/EditorForm";

export default function Home() {
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  // Uso del hook para manejar localStorage
  const { clearStorage } = useLocalStorage({
    contenido,
    tags,
    showPreview,
    isInitialLoad,
    setContenido,
    setTags,
    setShowPreview,
    setIsInitialLoad,
  });

  // Obtener la lógica de manejo de tags
  const tagManager = useTagManager({
    tags,
    tagInput,
    tagInputRef,
    setTagInput,
    setTags,
  });

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
          tagManager.removeLastTag();
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

  return (
    <EditorForm
      contenido={contenido}
      setContenido={setContenido}
      tags={tags}
      tagInput={tagInput}
      textareaRef={textareaRef}
      tagInputRef={tagInputRef}
      showPreview={showPreview}
      setShowPreview={setShowPreview}
      handleTagInputChange={tagManager.handleTagInputChange}
      handleTagInputKeyDown={tagManager.handleTagInputKeyDown}
      removeTag={tagManager.removeTag}
      handleTagInputBlur={tagManager.handleTagInputBlur}
      removeLastTag={tagManager.removeLastTag}
      clearStorage={clearStorage}
    />
  );
}
