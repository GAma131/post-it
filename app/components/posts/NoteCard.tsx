"use client";
import { Note } from "../../types/Note";
import { useRouter } from "next/navigation";

interface NoteCardProps {
  note: Note;
  index: number;
}

export default function NoteCard({ note, index }: NoteCardProps) {
  const router = useRouter();

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

  // Manejador para redireccionar a la pantalla de edición
  const handleEditNote = () => {
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

        {/* Fecha */}
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {/* @ts-ignore */}
          {formatDate(note.createdAt)}
        </div>
      </div>
    </div>
  );
}
