"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { apiUrl } from "../../config/api";
import "../../styles/textarea.css";

// Hooks
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { useTagManager } from "../../hooks/useTagManager";

// Componentes
import EditNoteForm from "../../components/edit/EditNoteForm";

export default function EditNote({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Obtener datos de la URL
  const title = searchParams.get("title") || "";
  const content = searchParams.get("content") || "";
  const tagsParam = searchParams.get("tags") || "[]";

  // Parsear las etiquetas desde la URL
  let initialTags: string[] = [];
  try {
    initialTags = JSON.parse(tagsParam);
  } catch (e) {
    console.error("Error parsing tags:", e);
  }

  // Estado para la edición
  const [contenido, setContenido] = useState(`${title}\n${content}`);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(initialTags);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

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

  // Función para actualizar la nota
  const updateNote = async () => {
    setIsLoading(true);

    try {
      // Separar la primera línea como título y el resto como contenido
      const lines = contenido.split("\n");
      const updatedTitle = lines[0] || "";
      const updatedContent = lines.slice(1).join("\n").trim();

      // Realizar la solicitud PUT con axios
      await axios.put(apiUrl(`api/notes/${params.id}`), {
        title: updatedTitle,
        content: updatedContent,
        tags,
      });

      // Redirigir a la pantalla de posts tras actualización exitosa
      router.push("/posts");
    } catch (error) {
      console.error("Error al actualizar la nota:", error);
      alert("No se pudo actualizar la nota");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Establecer el foco en el textarea al cargar la página
    if (textareaRef.current && !showPreview) {
      textareaRef.current.focus();
    }
  }, [showPreview]);

  return (
    <EditNoteForm
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
      updateNote={updateNote}
      isLoading={isLoading}
    />
  );
}
