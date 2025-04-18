"use client";

import { RefObject, useEffect, useState } from "react";

interface TagInputProps {
  tags: string[];
  tagInput: string;
  tagInputRef: RefObject<HTMLInputElement>;
  onTagInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTagInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onTagRemove: (tag: string) => void;
  onTagInputBlur: () => void;
  showPreview: boolean;
  togglePreview: () => void;
  removeLastTag: () => void;
  onSaveOrReturn?: () => Promise<void>;
  isSaving?: boolean;
  isModified?: boolean;
  onPublish?: () => Promise<void>;
  isPublishing?: boolean;
  isCreateMode?: boolean;
}

// Interfaz para userAgentData con el método getHighEntropyValues
interface NavigatorWithUserAgentData extends Navigator {
  userAgentData?: {
    platform: string;
    getHighEntropyValues(hints: string[]): Promise<{ platform: string }>;
  };
}

export default function TagInput({
  tags,
  tagInput,
  tagInputRef,
  onTagInputChange,
  onTagInputKeyDown,
  onTagRemove,
  onTagInputBlur,
  showPreview,
  togglePreview,
  removeLastTag,
  onSaveOrReturn,
  isSaving = false,
  isModified = false,
  onPublish,
  isPublishing = false,
  isCreateMode = false,
}: TagInputProps) {
  const [modifierKey, setModifierKey] = useState<string>("⌘"); // Por defecto, mostrar el símbolo de Mac

  useEffect(() => {
    // Función para detectar el sistema operativo
    const detectOS = async () => {
      try {
        // Intentar usar la API moderna (compatible con Chrome y Edge)
        const nav = navigator as NavigatorWithUserAgentData;

        if (nav.userAgentData) {
          // Usar la nueva API si está disponible
          const platform = nav.userAgentData.platform.toLowerCase();

          if (platform.includes("win")) {
            setModifierKey("Ctrl");
          } else if (platform.includes("linux")) {
            setModifierKey("Super");
          } else if (platform.includes("mac")) {
            setModifierKey("⌘");
          } else {
            // Fallback a userAgent para otras plataformas
            fallbackToUserAgent();
          }
        } else {
          // Usar el método tradicional si la API moderna no está disponible
          fallbackToUserAgent();
        }
      } catch (error) {
        // Si algo falla, usar el método tradicional
        fallbackToUserAgent();
      }
    };

    // Método tradicional usando userAgent
    const fallbackToUserAgent = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();

      if (userAgent.indexOf("win") !== -1) {
        setModifierKey("Ctrl");
      } else if (userAgent.indexOf("linux") !== -1) {
        setModifierKey("Super"); // Usar "Super" para Linux
      } else if (userAgent.indexOf("android") !== -1) {
        setModifierKey("Ctrl"); // En Android seguimos usando Ctrl
      } else if (
        userAgent.indexOf("mac") !== -1 ||
        userAgent.indexOf("iphone") !== -1 ||
        userAgent.indexOf("ipad") !== -1
      ) {
        setModifierKey("⌘");
      }
    };

    // Ejecutar la detección
    detectOS();
  }, []);

  // Atajo de teclado Cmd+Enter o Ctrl+Enter para guardar/volver
  useEffect(() => {
    if (!onSaveOrReturn && !onPublish) return; // Solo si tenemos función de guardar/volver o publicar

    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = modifierKey === "⌘";

      // Para macOS: Cmd+Enter, para otros: Ctrl+Enter
      if (
        event.key === "Enter" &&
        ((isMac && event.metaKey) || (!isMac && event.ctrlKey))
      ) {
        event.preventDefault();

        if (isCreateMode && onPublish && !isPublishing) {
          onPublish();
        } else if (onSaveOrReturn && !isSaving) {
          onSaveOrReturn();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    modifierKey,
    onSaveOrReturn,
    isSaving,
    onPublish,
    isPublishing,
    isCreateMode,
  ]);

  return (
    <div className="flex flex-wrap gap-2 mb-2">
      {tags.map((tag) => (
        <div
          key={tag}
          className="tag bg-gray-100 dark:bg-gray-700 dark:text-gray-200"
        >
          {tag}
          <button
            type="button"
            onClick={() => onTagRemove(tag)}
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
        onChange={onTagInputChange}
        onKeyDown={onTagInputKeyDown}
        onBlur={onTagInputBlur}
        placeholder="✎ Etiquetas |"
        className="w-auto py-2 px-3 rounded-md text-md outline-none text-right ml-auto transition-colors dark:bg-gray-800 dark:text-white"
      />
      <div className="w-full flex justify-end gap-5">
        <button
          type="button"
          onClick={removeLastTag}
          disabled={tags.length === 0}
          className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <kbd className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            Eliminar etiqueta {modifierKey}⌫
          </kbd>
        </button>
        <button
          type="button"
          onClick={togglePreview}
          className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white rounded"
        >
          <kbd className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            {showPreview ? "Editar texto" : "Vista previa"} {modifierKey}E
          </kbd>
        </button>
        {onSaveOrReturn && (
          <button
            type="button"
            onClick={onSaveOrReturn}
            disabled={isSaving}
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white rounded"
          >
            <kbd
              className={`
              px-1.5 py-0.5 rounded transition-colors
              ${
                isModified
                  ? "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                  : "bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
              }
            `}
            >
              {isSaving
                ? "Guardando..."
                : isModified
                ? `Guardar cambios ${modifierKey}↵`
                : `Volver a notas ${modifierKey}↵`}
            </kbd>
          </button>
        )}
        {isCreateMode && onPublish && (
          <button
            type="button"
            onClick={onPublish}
            disabled={isPublishing}
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white rounded"
          >
            <kbd className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              {isPublishing ? "Guardando..." : `Guardar ${modifierKey}↵`}
            </kbd>
          </button>
        )}
      </div>
    </div>
  );
}
