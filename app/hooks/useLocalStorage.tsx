import { useEffect } from "react";

// Claves para localStorage
export const STORAGE_KEYS = {
  CONTENT: "post-it-content",
  TAGS: "post-it-tags",
  PREVIEW: "post-it-preview-mode",
};

interface UseLocalStorageProps {
  contenido: string;
  tags: string[];
  showPreview: boolean;
  isInitialLoad: boolean;
  setContenido: (content: string) => void;
  setTags: (tags: string[]) => void;
  setShowPreview: (show: boolean) => void;
  setIsInitialLoad: (isLoading: boolean) => void;
}

export function useLocalStorage({
  contenido,
  tags,
  showPreview,
  isInitialLoad,
  setContenido,
  setTags,
  setShowPreview,
  setIsInitialLoad,
}: UseLocalStorageProps) {
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

  // Función para limpiar localStorage
  const clearStorage = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.CONTENT);
      localStorage.removeItem(STORAGE_KEYS.TAGS);
      // Opcionalmente también podemos limpiar el estado de vista previa
      // localStorage.removeItem(STORAGE_KEYS.PREVIEW);
    }
  };

  return { clearStorage };
}
