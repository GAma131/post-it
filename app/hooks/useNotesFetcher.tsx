import { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../config/api";
import { Note } from "../types/Note";

export function useNotesFetcher() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return { notes, isLoading };
}
