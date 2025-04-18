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
  const initialTitle = searchParams.get("title") || "";
  const initialContent = searchParams.get("content") || "";
  const tagsParam = searchParams.get("tags") || "[]";

  // Parsear las etiquetas desde la URL
  let initialTags: string[] = [];
  try {
    initialTags = JSON.parse(tagsParam);
  } catch (e) {
    console.error("Error parsing tags:", e);
  }

  // Estado para la edición
  const initialValue = `${initialTitle}\n${initialContent}`;
  const [contenido, setContenido] = useState(initialValue);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(initialTags);
  const [showPreview, setShowPreview] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isModified, setIsModified] = useState(false);

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

  // Detectar cambios en el contenido o etiquetas
  useEffect(() => {
    // Verificar si el contenido o las etiquetas han cambiado
    const contentChanged = contenido !== initialValue;

    // Para verificar cambios en las etiquetas necesitamos comparar arrays
    const tagsChanged =
      initialTags.length !== tags.length ||
      !initialTags.every((tag) => tags.includes(tag)) ||
      !tags.every((tag) => initialTags.includes(tag));

    setIsModified(contentChanged || tagsChanged);
  }, [contenido, tags, initialValue, initialTags]);

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

  // Función para manejar el botón de guardar o volver
  const handleSaveOrReturn = async () => {
    // Si no hay cambios, simplemente volver a la lista de posts
    if (!isModified) {
      router.push("/posts");
      return;
    }

    // Si hay cambios, actualizar la nota
    setIsLoading(true);

    try {
      // Separar la primera línea como título y el resto como contenido
      const lines = contenido.split("\n");
      const updatedTitle = lines[0] || "";
      const updatedContent = lines.slice(1).join("\n").trim();

      // Construir el payload exactamente con el formato requerido
      const noteData = {
        title: updatedTitle,
        content: updatedContent,
        tags: tags,
      };

      // URL de la API
      const apiEndpoint = apiUrl(`api/notes/update/${params.id}`);

      console.log("Actualizando nota:", {
        url: apiEndpoint,
        id: params.id,
        data: noteData,
      });

      // Realizar la solicitud PUT con axios
      const response = await axios.post(apiEndpoint, noteData);

      console.log("Respuesta de la API:", response.data);

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
    // Establecer el foco en el textarea solo cuando estamos en modo edición
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
      updateNote={handleSaveOrReturn}
      isLoading={isLoading}
      isModified={isModified}
    />
  );
}
