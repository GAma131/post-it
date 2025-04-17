"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../config/api";
import Masonry from "react-masonry-css";

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

  // Puntos de quiebre para el diseño responsivo
  const breakpointColumnsObj = {
    default: 4, // Por defecto 4 columnas en pantallas grandes
    1536: 4, // 4 columnas a partir de 1536px
    1280: 3, // 3 columnas a partir de 1280px
    1024: 3, // 3 columnas a partir de 1024px
    768: 2, // 2 columnas a partir de 768px
    640: 1, // 1 columna en móviles
  };

  useEffect(() => {
    // Función para obtener las notas desde la API
    async function fetchNotes() {
      try {
        const response = await axios.get(apiUrl("api/notes"));

        // Ordenar notas por longitud para mejor distribución
        const sortedNotes = [...response.data].sort((a, b) => {
          const lengthA = a.content.replace(/\n/g, "").length;
          const lengthB = b.content.replace(/\n/g, "").length;
          // Intentamos alternar entre notas grandes y pequeñas
          if (lengthA > 500 && lengthB < 200) return -1;
          if (lengthB > 500 && lengthA < 200) return 1;
          return lengthB - lengthA; // Colocar notas más grandes primero
        });

        setNotes(sortedNotes);
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-6 animate-pulse ${
                i % 5 === 0
                  ? "h-28"
                  : i % 5 === 1
                  ? "h-40"
                  : i % 5 === 2
                  ? "h-52"
                  : i % 5 === 3
                  ? "h-64"
                  : "h-80"
              }`}
            ></div>
          ))}
        </div>
      ) : notes.length > 0 ? (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex w-auto -ml-3" // Necesario para el layout
          columnClassName="pl-3 bg-clip-padding" // Gap entre columnas
        >
          {notes.map((note, index) => (
            <div key={index} className="mb-3">
              {" "}
              {/* Espaciado vertical entre tarjetas */}
              <NoteCard note={note} index={index} />
            </div>
          ))}
        </Masonry>
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
        height: "260px",
        bgClass: "bg-gray-200 dark:bg-gray-905", // S - #E6E6E6 (claro) / #1D2430 (oscuro)
      }; // S - 50-200 caracteres
    } else if (contentLength > 200 && contentLength <= 500) {
      return {
        height: "360px",
        bgClass: "bg-gray-100 dark:bg-gray-900", // M - #F2F2F2 (claro) / #212936 (oscuro)
      }; // M - 201-500 caracteres
    } else if (contentLength > 500 && contentLength <= 1000) {
      return {
        height: "460px",
        bgClass: "bg-gray-50 dark:bg-gray-870", // L - #FFFFFF (claro) / #262E3C (oscuro)
      }; // L - 501-1000 caracteres
    } else {
      return {
        height: "560px",
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
      "560px": 1600, // XL - Mostrar bastante (>1000 chars)
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
      className={`rounded-lg p-4 shadow-md dark:shadow-xl transition-transform hover:scale-[1.02] overflow-hidden flex flex-col relative ${bgClass} text-gray-800 dark:text-white`}
      style={{
        height,
        animation: `fadeIn 0.5s ease-in-out ${index * 0.05}s`,
      }}
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
