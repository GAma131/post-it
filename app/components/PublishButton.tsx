"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { apiUrl } from "../config/api";

export default function PublishButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handlePublish = async () => {
    setIsLoading(true);

    try {
      // Obtener el contenido de la nota del textarea
      const textareaElement = document.querySelector("textarea");
      const noteContent =
        textareaElement instanceof HTMLTextAreaElement
          ? textareaElement.value
          : "";

      // Separar la primera línea como título y el resto como contenido
      const lines = noteContent.split("\n");
      const title = lines[0] || "";
      const content = lines.slice(1).join("\n").trim();

      // Obtener las etiquetas del formulario
      const tagsElements = document.querySelectorAll(".tag");
      const tags: string[] = [];

      tagsElements.forEach((tagElement) => {
        const tagText = tagElement.textContent?.replace("×", "").trim();
        if (tagText) {
          tags.push(tagText);
        }
      });

      // Realizar la solicitud POST con axios
      const response = await axios.post(apiUrl("api/notes"), {
        title,
        content,
        tags,
      });

      // Redirigir a la pantalla de posts
      router.push("/posts");
    } catch (error) {
      console.error("Error:", error);
      alert("No se pudo publicar la nota");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full justify-end">
      <button
        type="button"
        className="w-full md:w-1/2 lg:w-1/4 bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white py-2 text-sm rounded-md hover:bg-gray-900 hover:text-white dark:hover:bg-gray-200 dark:hover:text-gray-900 transition"
        onClick={handlePublish}
        disabled={isLoading}
      >
        {isLoading ? "Guardando..." : "Guardar"}
      </button>
    </div>
  );
}
