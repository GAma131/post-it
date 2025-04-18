"use client";
import { Note } from "../../types/Note";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../../config/api";

interface NoteCardProps {
  note: Note;
  index: number;
}

export default function NoteCard({ note, index }: NoteCardProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Determinamos el ID de la nota
  const getNoteId = () => {
    // Si tenemos _id como objeto con $oid
    if (note._id && typeof note._id === "object" && "$oid" in note._id) {
      return note._id.$oid;
    }
    // Si es directamente un string
    if (note._id && typeof note._id === "string") {
      return note._id;
    }
    return "";
  };

  // Cierra el menú cuando se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Efecto para manejar el temporizador de cierre automático del menú
  useEffect(() => {
    // Si el menú está abierto, configurar un temporizador para cerrarlo después de 3 segundos
    if (menuOpen) {
      // Limpiar cualquier temporizador existente
      if (menuTimerRef.current) {
        clearTimeout(menuTimerRef.current);
      }

      // Crear nuevo temporizador
      menuTimerRef.current = setTimeout(() => {
        setMenuOpen(false);
      }, 3000); // 3 segundos
    }

    // Función de limpieza para limpiar el temporizador cuando el componente se desmonta
    return () => {
      if (menuTimerRef.current) {
        clearTimeout(menuTimerRef.current);
      }
    };
  }, [menuOpen]);

  // Manejador para redireccionar a la pantalla de edición
  const handleEditNote = (e?: React.MouseEvent) => {
    // Si el evento viene de un botón dentro del menú, no propagar
    if (e && (e.target as HTMLElement).closest(".menu-button")) {
      return;
    }

    const noteId = getNoteId();
    if (noteId) {
      // Construimos el contenido completo de la nota como en el editor
      const fullContent = `${note.title}\n${note.content}`;

      // Redirigir a la página de edición con el ID y los datos de la nota
      router.push(
        `/edit/${noteId}?title=${encodeURIComponent(
          note.title
        )}&content=${encodeURIComponent(
          note.content
        )}&tags=${encodeURIComponent(JSON.stringify(note.tags))}`
      );
    }
  };

  // Manejador para eliminar la nota
  const handleDeleteNote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);

    const noteId = getNoteId();
    if (!noteId) return;

    try {
      // Usar apiUrl para construir la URL completa a la API externa
      const response = await axios.post(apiUrl(`api/notes/delete/${noteId}`));

      if (response.status === 200) {
        // Forzar recarga de la página para asegurar la actualización completa
        window.location.href = "/posts";
      } else {
        console.error("Error al eliminar la nota: respuesta no exitosa");
      }
    } catch (error) {
      console.error("Error al eliminar la nota:", error);
    }
  };

  // Manejador para abrir/cerrar el menú
  const handleToggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  // Determinar el tamaño basado en el contenido
  const getCardSize = () => {
    // Calcular tamaño basado en longitud del contenido (solo texto) sin considerar saltos de línea
    const contentLength = note.content.replace(/\n/g, "").length;

    // Rangos ajustados según la especificación del usuario
    if (contentLength < 50) {
      return {
        height: "160px",
        bgClass: "bg-gray-300 dark:bg-gray-910", // XS - #D9D9D9 (claro) / #191F2A (oscuro)
      }; // XS - Menos de 50 caracteres
    } else if (contentLength >= 50 && contentLength <= 200) {
      return {
        height: "200px",
        bgClass: "bg-gray-200 dark:bg-gray-905", // S - #E6E6E6 (claro) / #1D2430 (oscuro)
      }; // S - 50-200 caracteres
    } else if (contentLength > 200 && contentLength <= 500) {
      return {
        height: "240px",
        bgClass: "bg-gray-100 dark:bg-gray-900", // M - #F2F2F2 (claro) / #212936 (oscuro)
      }; // M - 201-500 caracteres
    } else if (contentLength > 500 && contentLength <= 1000) {
      return {
        height: "280px",
        bgClass: "bg-gray-400 dark:bg-gray-850", // L - #B0B0B0 (claro) / #2B3442 (oscuro)
      }; // L - 501-1000 caracteres
    } else {
      return {
        height: "300px",
        bgClass: "bg-gray-400 dark:bg-gray-850", // XL - #B0B0B0 (claro) / #2B3442 (oscuro)
      }; // XL - Más de 1000 caracteres
    }
  };

  // Truncar contenido según tamaño de tarjeta
  const truncateContent = (content: string) => {
    const { height } = getCardSize();

    // Ajustar límites de caracteres según el tamaño de la tarjeta
    const limits: Record<string, number> = {
      "160px": 60, // XS - Mostrar casi todo (<50 chars)
      "260px": 190, // S - Mostrar mayoría (hasta 200 chars)
      "360px": 460, // M - Mostrar gran parte (hasta 500 chars)
      "460px": 1000, // L - Mostrar mayoría (hasta 1000 chars)
      "560px": 1500, // XL - Mostrar mayoría (hasta 1500 chars)
    };

    const maxLength = limits[height] || 200;

    // Asegurar que siempre se trunca, independientemente del tamaño
    if (content.length <= maxLength) {
      return content;
    }
    return content.slice(0, maxLength) + "...";
  };

  // Renderizar contenido
  const renderContent = () => {
    // Siempre truncar, incluso con saltos de línea
    const truncatedContent = truncateContent(note.content);
    const { height } = getCardSize();

    // Ajustar el número de líneas según la altura de la tarjeta
    const lineClampClasses: Record<string, string> = {
      "160px": "line-clamp-4", // XS - 4 líneas
      "260px": "line-clamp-8", // S - 8 líneas
      "360px": "line-clamp-12", // M - 12 líneas
      "460px": "line-clamp-16", // L - 16 líneas
      "560px": "line-clamp-20", // XL - 20 líneas
    };

    const lineClamp = lineClampClasses[height] || "line-clamp-6";

    return (
      <>
        <h3 className="text-lg font-medium mb-2">{note.title}</h3>
        <div className={`${lineClamp} overflow-hidden`}>
          {truncatedContent.includes("\n")
            ? truncatedContent.split("\n").map((line, idx) => (
                <div key={idx} className="mb-1">
                  {line}
                </div>
              ))
            : truncatedContent}
        </div>
      </>
    );
  };

  // Formatear fecha
  const formatDate = (date: string) => {
    try {
      return date.split("T")[0];
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Fecha no disponible";
    }
  };

  const { height, bgClass } = getCardSize();

  return (
    <div
      className={`rounded-lg p-4 shadow-md dark:shadow-xl transition-transform hover:scale-[1.02] focus:not(:focus-visible):scale-100 focus-visible:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white overflow-hidden flex flex-col relative ${bgClass} text-gray-800 dark:text-white cursor-pointer`}
      style={{
        height,
        animation: `fadeIn 0.5s ease-in-out ${index * 0.05}s`,
      }}
      onClick={handleEditNote}
      onKeyDown={(e) => {
        // Activar con Enter o Espacio
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleEditNote();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Editar nota: ${note.title}`}
    >
      {/* Contenido de la nota */}
      <div className="mb-2 overflow-hidden flex-grow">{renderContent()}</div>

      {/* Etiquetas y fecha en el footer (siempre abajo) */}
      <div className="mt-auto">
        {/* Etiquetas */}
        {note.tags.length > 0 && (
          <div className="pt-3 flex flex-wrap gap-1">
            {note.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs bg-gray-400 bg-opacity-30 dark:bg-gray-600 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer con fecha y botón de menú */}
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex justify-between items-center">
          {/* Fecha */}
          <div>
            {/* @ts-ignore */}
            {formatDate(note.createdAt)}
          </div>

          {/* Botón de tres puntos y menú desplegable */}
          <div className="relative" ref={menuRef}>
            <button
              className="menu-button p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              onClick={handleToggleMenu}
              aria-label="Opciones de nota"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute z-10 right-0 bottom-8 w-36 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1">
                <button
                  className="w-full px-3 py-1.5 text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                  onClick={handleDeleteNote}
                >
                  Eliminar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
