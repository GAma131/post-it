"use client";

import { useState } from "react";

// Hooks
import { useNotesFetcher } from "../hooks/useNotesFetcher";

// Componentes
import NotesHeader from "../components/posts/NotesHeader";
import NotesList from "../components/posts/NotesList";

export default function Posts() {
  const { notes, isLoading } = useNotesFetcher();
  const [showFilters, setShowFilters] = useState(false);

  // Lista de etiquetas estáticas para el filtro
  const availableTags = [
    "trabajo",
    "personal",
    "importante",
    "ideas",
    "proyectos",
  ];

  return (
    <div className="max-w-7xl mx-auto py-10 px-6">
      <NotesHeader
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        availableTags={availableTags}
      />

      <NotesList notes={notes} isLoading={isLoading} />
    </div>
  );
}
