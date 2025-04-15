"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function CrearPost() {
  const [contenido, setContenido] = useState("");
  const [cargando, setCargando] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contenido.trim()) return;

    setCargando(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
        content: contenido,
      });
      setContenido("");
      router.push("/"); // Redirige a la página principal
      router.refresh(); // Actualiza los datos
    } catch (error) {
      console.error("Error al crear post:", error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Crear nuevo Post</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="contenido" className="block text-sm font-medium mb-2">
            Contenido
          </label>
          <textarea
            id="contenido"
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            className="w-full p-2 border rounded-md"
            rows={4}
            maxLength={500}
            placeholder="¿Qué estás pensando?"
          />
        </div>

        <button
          type="submit"
          disabled={cargando || !contenido.trim()}
          className="w-full bg-blue-500 text-white p-2 rounded-md
                    hover:bg-blue-600 disabled:bg-gray-300"
        >
          {cargando ? "Publicando..." : "Publicar"}
        </button>
      </form>
    </div>
  );
}
