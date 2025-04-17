"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";

// Interfaz para documentos de MongoDB
interface Note {
  _id?: {
    $oid: string;
  };
  title: string;
  content: string;
  tags: string[];
  createdAt: {
    $date: string;
  };
  updatedAt: {
    $date: string;
  };
  __v?: number;
}

export default function Posts() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Función para obtener las notas desde la API
    async function fetchNotes() {
      try {
        const response = await axios.get("http://localhost:3000/api/notes");
        setNotes(response.data);
        console.log(notes);
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchNotes();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-10 px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold dark:text-white">Mis Notas</h1>
        <Link
          href="/"
          className="bg-gray-800 dark:bg-white text-white dark:text-gray-800 px-4 py-2 rounded-md hover:bg-gray-900 dark:hover:bg-gray-100 transition"
        >
          Nueva Nota
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 auto-rows-auto">
          {[...Array(9)].map((_, index) => (
            <div
              key={index}
              className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-6 animate-pulse ${
                index % 5 === 0
                  ? "h-28"
                  : index % 5 === 1
                  ? "h-40"
                  : index % 5 === 2
                  ? "h-52"
                  : index % 5 === 3
                  ? "h-64"
                  : "h-80"
              }`}
              style={{
                gridRow: `span ${
                  index % 5 === 0
                    ? 1
                    : index % 5 === 1
                    ? 1
                    : index % 5 === 2
                    ? 2
                    : index % 5 === 3
                    ? 2
                    : 3
                }`,
              }}
            ></div>
          ))}
        </div>
      ) : notes.length > 0 ? (
        <div className="masonry-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 auto-rows-auto">
          {notes.map((note, index) => (
            <NoteCard key={index} note={note} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-gray-200 dark:border-gray-700 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No tienes notas guardadas
          </p>
          <Link
            href="/"
            className="inline-block bg-gray-800 dark:bg-white text-white dark:text-gray-800 px-4 py-2 rounded-md hover:bg-gray-900 dark:hover:bg-gray-100 transition"
          >
            Crear tu primera nota
          </Link>
        </div>
      )}
    </div>
  );
}

function NoteCard({ note, index }: { note: Note; index: number }) {
  // Determinar el tamaño y la posición en base al contenido
  const getGridSpan = () => {
    // Calcular tamaño basado en longitud del contenido (solo texto) sin considerar saltos de línea
    const contentLength = note.content.replace(/\n/g, "").length;
    // Usar el índice en lugar del ID para el orden aleatorio pero consistente
    const randomOrder = index % 10;

    // Debugging
    console.log(
      `Nota ${index}: "${note.title}" - Longitud: ${contentLength} caracteres`
    );

    // Tamaños basados en rangos precisos de longitud
    if (contentLength <= 30) {
      console.log(`Nota ${index} asignada como XS`);
      return { rowSpan: 1, colSpan: 1, minHeight: "110px", order: randomOrder }; // XS
    } else if (contentLength > 30 && contentLength <= 100) {
      console.log(`Nota ${index} asignada como S`);
      return { rowSpan: 1, colSpan: 1, minHeight: "150px", order: randomOrder }; // S
    } else if (contentLength > 100 && contentLength <= 200) {
      console.log(`Nota ${index} asignada como M`);
      return { rowSpan: 2, colSpan: 1, minHeight: "200px", order: randomOrder }; // M
    } else if (contentLength > 200 && contentLength <= 350) {
      console.log(`Nota ${index} asignada como L`);
      return { rowSpan: 2, colSpan: 1, minHeight: "220px", order: randomOrder }; // L
    } else {
      console.log(`Nota ${index} asignada como XL`);
      return { rowSpan: 3, colSpan: 2, minHeight: "270px", order: randomOrder }; // XL
    }
  };

  // Clases para la tarjeta (simplificado)
  const getCardClasses = () => {
    const { rowSpan, colSpan } = getGridSpan();
    const baseClasses =
      "rounded-lg p-4 shadow-md dark:shadow-xl transition-transform hover:scale-[1.02] overflow-hidden flex flex-col relative bg-white dark:bg-gray-800 text-gray-800 dark:text-white";

    // Estilos para grid
    return `${baseClasses} ${rowSpan > 1 ? `row-span-${rowSpan}` : ""} ${
      colSpan > 1 ? `col-span-${colSpan}` : ""
    }`;
  };

  // Formatear fecha
  const formatDate = (date: string) => {
    try {
      // Extraer solo la parte de la fecha (antes de la T)
      return date.split("T")[0];
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Fecha no disponible";
    }
  };

  // Truncar contenido según dimensión
  const truncateContent = (content: string) => {
    const { rowSpan, colSpan } = getGridSpan();
    const baseLength = 80;
    const maxLength = Math.floor(
      baseLength *
        (rowSpan === 1 ? 1 : rowSpan === 2 ? 3 : 5) *
        (colSpan === 1 ? 1 : 1.8)
    );

    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + "...";
  };

  // Renderizar contenido según formato
  const renderContent = () => {
    // Contenido con formato de lista (con saltos de línea)
    if (note.content.includes("\n")) {
      return (
        <>
          <h3 className="text-lg font-medium mb-1">{note.title}</h3>
          <div>
            {note.content.split("\n").map((line, idx) => (
              <div key={idx} className="mb-1">
                {line}
              </div>
            ))}
          </div>
        </>
      );
    }

    // Contenido normal
    return (
      <>
        <h3 className="text-lg font-medium mb-1">{note.title}</h3>
        <div>{truncateContent(note.content)}</div>
      </>
    );
  };

  const { minHeight, order } = getGridSpan();

  return (
    <div
      className={getCardClasses()}
      style={{
        minHeight,
        order,
        animation: `fadeIn 0.5s ease-in-out ${index * 0.05}s`,
      }}
    >
      {/* Contenido de la nota */}
      <div className="mb-2">{renderContent()}</div>

      {/* Etiquetas */}
      {note.tags.length > 0 && (
        <div className="mt-auto pt-3 flex flex-wrap gap-1">
          {note.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-xs bg-gray-150 dark:bg-gray-700 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Fecha */}
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {formatDate(note.createdAt)}
      </div>
    </div>
  );
}
