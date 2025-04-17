import { useRef, useEffect } from "react";

interface FilterMenuProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  availableTags: string[];
}

export default function FilterMenu({
  showFilters,
  setShowFilters,
  availableTags,
}: FilterMenuProps) {
  const filterRef = useRef<HTMLDivElement>(null);

  // Cerrar el menú de filtros si se hace clic fuera de él
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowFilters(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowFilters]);

  return (
    <div className="relative" ref={filterRef}>
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        aria-label="Filtrar notas"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
        </svg>
        <span>Filtros</span>
      </button>

      {/* Menú desplegable de filtros */}
      {showFilters && (
        <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10 min-w-[200px]">
          <div className="p-3">
            <h3 className="font-medium text-sm text-gray-900 dark:text-white mb-2">
              Filtrar por etiquetas
            </h3>
            <div className="space-y-2">
              {availableTags.map((tag) => (
                <div key={tag} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`tag-${tag}`}
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`tag-${tag}`}
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >
                    {tag}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
