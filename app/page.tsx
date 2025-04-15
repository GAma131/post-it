import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Post-it App</h1>
        <Link
          href="/crear"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Crear Post
        </Link>
      </div>

      <div className="border border-gray-300 rounded-lg p-6">
        <p className="text-center text-gray-500">
          Aquí se mostrarán los posts de tu API externa.
        </p>
      </div>
    </div>
  );
}
