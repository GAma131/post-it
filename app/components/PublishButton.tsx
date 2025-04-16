"use client";

export default function PublishButton() {
  return (
    <div className="flex w-full justify-end">
      <button
        type="submit"
        className="w-full md:w-1/2 lg:w-1/4 bg-gray-800 text-white py-2 text-sm rounded-md hover:bg-gray-900 transition"
      >
        Publicar
      </button>
    </div>
  );
}
