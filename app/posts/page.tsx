"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

// Nota mock para desarrollo
interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  type?: "regular" | "quote" | "task" | "creditCard" | "rules";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export default function Posts() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulación de carga de datos
    setTimeout(() => {
      // Aleatorizar el orden de las notas para una distribución más mezclada
      const shuffledNotes = [...mockNotes].sort(() => Math.random() - 0.5);
      setNotes(shuffledNotes);
      setIsLoading(false);
    }, 500);

    // En un caso real, harías una petición a tu API
    // async function fetchNotes() {
    //   try {
    //     const response = await fetch('/api/notes');
    //     const data = await response.json();
    //     setNotes(data);
    //   } catch (error) {
    //     console.error("Error fetching notes:", error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // }
    // fetchNotes();
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
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
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

function NoteCard({ note }: { note: Note }) {
  // Determinar el tamaño y la posición en base al contenido y tamaño especificado
  const getGridSpan = () => {
    // Si hay un tamaño predefinido, usarlo
    if (note.size) {
      switch (note.size) {
        case "xs":
          return {
            rowSpan: 1,
            colSpan: 1,
            minHeight: "110px",
            order: Math.floor(Math.random() * 10),
          };
        case "sm":
          return {
            rowSpan: 1,
            colSpan: 1,
            minHeight: "150px",
            order: Math.floor(Math.random() * 10),
          };
        case "md":
          return {
            rowSpan: 2,
            colSpan: 1,
            minHeight: "200px",
            order: Math.floor(Math.random() * 10),
          };
        case "lg":
          return {
            rowSpan: 2,
            colSpan: 2,
            minHeight: "220px",
            order: Math.floor(Math.random() * 10),
          };
        case "xl":
          return {
            rowSpan: 3,
            colSpan: 2,
            minHeight: "300px",
            order: Math.floor(Math.random() * 10),
          };
      }
    }

    // Calcular el tamaño basado en la longitud del contenido
    const contentLength = note.content.length;
    const isXSmall = contentLength < 30;
    const isSmall = contentLength >= 30 && contentLength < 100;
    const isMedium = contentLength >= 100 && contentLength < 200;
    const isLarge = contentLength >= 200 && contentLength < 350;
    const isXLarge = contentLength >= 350;

    // Añadir aleatoriedad para que las notas no tengan todas el mismo tamaño
    const randomFactor = note.id.charCodeAt(0) % 5;
    const randomOrder = Math.floor(Math.random() * 10);

    // Considerar tipo de nota
    if (isXSmall || (randomFactor === 0 && isSmall)) {
      return { rowSpan: 1, colSpan: 1, minHeight: "110px", order: randomOrder }; // XS
    } else if (isSmall || note.type === "quote" || note.type === "creditCard") {
      return { rowSpan: 1, colSpan: 1, minHeight: "150px", order: randomOrder }; // S
    } else if (isMedium || note.type === "task") {
      return { rowSpan: 2, colSpan: 1, minHeight: "200px", order: randomOrder }; // M
    } else if (isLarge || note.type === "rules") {
      return {
        rowSpan: 2,
        colSpan: randomFactor === 4 ? 2 : 1,
        minHeight: "220px",
        order: randomOrder,
      }; // L
    } else if (isXLarge) {
      return { rowSpan: 3, colSpan: 2, minHeight: "300px", order: randomOrder }; // XL
    }

    return { rowSpan: 1, colSpan: 1, minHeight: "150px", order: randomOrder }; // Default (S)
  };

  // Determinar el color de fondo según el tipo de nota
  const getCardClasses = () => {
    const { rowSpan, colSpan, minHeight } = getGridSpan();
    const baseClasses =
      "rounded-lg p-4 shadow-md dark:shadow-xl transition-transform hover:scale-[1.02] overflow-hidden flex flex-col relative";

    // Estilos para grid y altura variable según contenido
    const gridClasses = `${rowSpan > 1 ? `row-span-${rowSpan}` : ""} ${
      colSpan > 1 ? `col-span-${colSpan}` : ""
    }`;

    // Colores ajustados para mejor contraste
    switch (note.type) {
      case "quote":
        return `${baseClasses} ${gridClasses} bg-gray-150 dark:bg-gray-650 text-gray-800 dark:text-white`;
      case "task":
        return `${baseClasses} ${gridClasses} bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white`;
      case "creditCard":
        return `${baseClasses} ${gridClasses} bg-gray-250 dark:bg-gray-750 text-gray-800 dark:text-white`;
      case "rules":
        return `${baseClasses} ${gridClasses} bg-gray-175 dark:bg-gray-700 text-gray-800 dark:text-white`;
      default:
        return `${baseClasses} ${gridClasses} bg-white dark:bg-gray-800 text-gray-800 dark:text-white`;
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-ES", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  // Truncar contenido según tipo de nota y dimensión
  const truncateContent = (content: string) => {
    const { rowSpan, colSpan } = getGridSpan();
    // Ajustar longitud máxima según dimensiones
    const baseLength = 80;
    const rowFactor = rowSpan === 1 ? 1 : rowSpan === 2 ? 3 : 5;
    const colFactor = colSpan === 1 ? 1 : 1.8;
    const maxLength = Math.floor(baseLength * rowFactor * colFactor);

    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + "...";
  };

  const { minHeight, order } = getGridSpan();

  return (
    <div
      className={getCardClasses()}
      style={{
        minHeight,
        order, // Usar el valor aleatorio de orden para distribuir las tarjetas
        animation: `fadeIn 0.5s ease-in-out ${parseInt(note.id) * 0.05}s`,
      }}
    >
      {/* Encabezado de la nota */}
      {note.type === "creditCard" ? (
        <div className="mb-2">
          <h3 className="text-lg font-medium mb-1">Tarjeta de crédito</h3>
          <div className="font-mono">**** **** **** {note.title.slice(-4)}</div>
        </div>
      ) : note.type === "task" ? (
        <div className="mb-2">
          <h3 className="text-lg font-medium mb-1">Pendientes</h3>
          <div>
            {note.content.split("\n").map((task, index) => (
              <div key={index} className="flex items-start mb-1">
                <input type="checkbox" className="mt-1 mr-2" disabled />
                <span>{task}</span>
              </div>
            ))}
          </div>
        </div>
      ) : note.type === "quote" ? (
        <div className="mb-2">
          <h3 className="text-lg font-medium mb-1">Cita del día</h3>
          <div className="italic">"{truncateContent(note.content)}"</div>
        </div>
      ) : note.type === "rules" ? (
        <div className="mb-2">
          <h3 className="text-lg font-medium mb-1">{note.title}</h3>
          <div>
            {note.content.split("\n").map((rule, index) => (
              <div key={index} className="mb-1">
                {index + 1}. {rule}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <h3 className="text-lg font-medium mb-1">{note.title}</h3>
          <p className="text-gray-700 dark:text-gray-300">
            {truncateContent(note.content)}
          </p>
        </>
      )}

      {/* Etiquetas */}
      {note.tags.length > 0 && (
        <div className="mt-auto pt-3 flex flex-wrap gap-1">
          {note.tags.map((tag, index) => (
            <span
              key={index}
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

// Datos de ejemplo con distintos tamaños y contenido
const mockNotes: Note[] = [
  {
    id: "1",
    title: "Reglas para la vida",
    content:
      "Haz las paces con tu pasado para que no arruine tu presente.\nDesecha lo que no puedes cambiar.\nVive el presente intensamente.",
    tags: ["motivación", "vida"],
    createdAt: "2023-09-23T12:00:00Z",
    type: "rules",
    size: "md",
  },
  {
    id: "2",
    title: "5412",
    content: "Tarjeta BBVA Mastercard",
    tags: ["finanzas", "personal"],
    createdAt: "2023-10-05T08:30:00Z",
    type: "creditCard",
    size: "xs",
  },
  {
    id: "3",
    title: "Supérate a ti mismo",
    content:
      "Todos pueden elevarse por encima de sus circunstancias y alcanzar el éxito si están dedicados y son apasionados por lo que hacen.",
    tags: ["motivación"],
    createdAt: "2023-08-12T15:30:00Z",
    type: "regular",
  },
  {
    id: "4",
    title: "Tareas pendientes",
    content:
      "Correr 30 minutos\nEstudiar para el examen\nEscribir ensayo de inglés\nComprar comestibles",
    tags: ["tareas", "personal"],
    createdAt: "2023-10-10T09:15:00Z",
    type: "task",
  },
  {
    id: "5",
    title: "Una buena actitud",
    content:
      "El éxito es una actitud. No se trata de cuánto sabes, sino de cómo enfrentas los desafíos que se presentan en tu camino. La actitud determina la altitud que puedes alcanzar en la vida. Mantén siempre una actitud positiva, incluso cuando las cosas se pongan difíciles. Recuerda que los obstáculos son oportunidades para crecer y demostrar tu resiliencia. El verdadero éxito viene de enfrentar cada día con optimismo y determinación.",
    tags: ["motivación", "actitud"],
    createdAt: "2023-07-18T16:45:00Z",
    type: "regular",
    size: "xl",
  },
  {
    id: "6",
    title: "Frase inspiradora",
    content:
      "Persigue la visión, no el dinero; el dinero terminará siguiéndote.",
    tags: ["inspiración", "finanzas"],
    createdAt: "2023-09-30T10:20:00Z",
    type: "quote",
    size: "sm",
  },
  {
    id: "7",
    title: "Reunión de proyecto",
    content:
      "Puntos a tratar en la reunión de mañana:\n1. Revisar avances del sprint\n2. Asignar nuevas tareas\n3. Discutir problemas encontrados\n4. Planificar próximo sprint\n5. Actualizar documentación\n6. Validar estimaciones con el cliente\n7. Revisar recursos disponibles para el próximo mes\n8. Agendar revisión de código",
    tags: ["trabajo", "proyecto"],
    createdAt: "2023-10-08T11:00:00Z",
    type: "regular",
    size: "lg",
  },
  {
    id: "8",
    title: "Ideas para el blog",
    content:
      "1. Cómo mejorar la productividad trabajando desde casa\n2. 10 herramientas imprescindibles para desarrolladores\n3. La importancia del descanso para la creatividad\n4. Cómo organizar tu espacio de trabajo para mayor eficiencia\n5. Técnicas de gestión del tiempo para profesionales\n6. Equilibrio entre vida personal y profesional\n7. El poder de los hábitos en el desarrollo profesional\n8. Cómo mantenerse actualizado en un campo que cambia rápidamente\n9. La importancia de la comunidad en el desarrollo profesional",
    tags: ["blog", "ideas", "trabajo"],
    createdAt: "2023-09-05T14:30:00Z",
    type: "regular",
  },
  {
    id: "9",
    title: "Nota rápida",
    content: "Llamar a Juan mañana.",
    tags: ["recordatorio"],
    createdAt: "2023-10-12T16:20:00Z",
    type: "regular",
    size: "xs",
  },
  {
    id: "10",
    title: "Recordar",
    content: "Comprar leche.",
    tags: ["compras"],
    createdAt: "2023-10-13T17:30:00Z",
    type: "regular",
    size: "xs",
  },
  {
    id: "11",
    title: "Canción favorita",
    content: "Imagine - John Lennon",
    tags: ["música"],
    createdAt: "2023-10-07T19:40:00Z",
    type: "regular",
    size: "xs",
  },
  {
    id: "12",
    title: "Película pendiente",
    content: "Oppenheimer (2023)",
    tags: ["cine"],
    createdAt: "2023-10-09T20:15:00Z",
    type: "regular",
    size: "xs",
  },
];
