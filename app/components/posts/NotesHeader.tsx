import Link from "next/link";
import FilterMenu from "./FilterMenu";

interface NotesHeaderProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  availableTags: string[];
}

export default function NotesHeader({
  showFilters,
  setShowFilters,
  availableTags,
}: NotesHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold dark:text-white">Mis Notas</h1>

      <div className="flex items-center gap-4">
        {/* Componente del menú de filtros */}
        <FilterMenu
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          availableTags={availableTags}
        />

        <Link
          href="/"
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Crear nota</span>
        </Link>
      </div>
    </div>
  );
}
