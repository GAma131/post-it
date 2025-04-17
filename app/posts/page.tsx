import Link from "next/link";

export default function Posts() {
  return (
    <div className="max-w-7xl mx-auto py-10 px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold dark:text-white">Todos los Posts</h1>
        <Link
          href="/"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Crear nuevo
        </Link>
      </div>

      <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-6 dark:bg-gray-800">
        <p className="text-center text-gray-500 dark:text-gray-400">
          Aquí se mostrarán los posts de tu API externa.
        </p>
      </div>
    </div>
  );
}
