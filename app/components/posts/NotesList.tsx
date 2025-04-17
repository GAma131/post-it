import Link from "next/link";
import Masonry from "react-masonry-css";
import NoteCard from "./NoteCard";
import { Note } from "../../types/Note";

interface NotesListProps {
  notes: Note[];
  isLoading: boolean;
}

export default function NotesList({ notes, isLoading }: NotesListProps) {
  // Puntos de quiebre para el diseño responsivo
  const breakpointColumnsObj = {
    default: 4, // Por defecto 4 columnas en pantallas grandes
    1536: 4, // 4 columnas a partir de 1536px
    1280: 3, // 3 columnas a partir de 1280px
    1024: 3, // 3 columnas a partir de 1024px
    768: 2, // 2 columnas a partir de 768px
    640: 1, // 1 columna en móviles
  };

  if (isLoading) {
    return (
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
    );
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-20 border border-gray-200 dark:border-gray-700 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          No tienes notas guardadas
        </p>
        <Link
          href="/"
          className="inline-block bg-gray-800 dark:bg-white text-white dark:text-gray-800 px-4 py-2 hover:bg-gray-900 dark:hover:bg-gray-100 transition"
        >
          Crear tu primera nota
        </Link>
      </div>
    );
  }

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex w-auto -ml-3" // Necesario para el layout
      columnClassName="pl-3 bg-clip-padding" // Gap entre columnas
    >
      {notes.map((note, index) => (
        <div key={index} className="mb-3">
          {/* Espaciado vertical entre tarjetas */}
          <NoteCard note={note} index={index} />
        </div>
      ))}
    </Masonry>
  );
}
