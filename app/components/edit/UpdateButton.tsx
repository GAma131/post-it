"use client";

interface UpdateButtonProps {
  updateNote: () => Promise<void>;
  isLoading: boolean;
  isModified: boolean;
}

export default function UpdateButton({
  updateNote,
  isLoading,
  isModified,
}: UpdateButtonProps) {
  const handleUpdate = async () => {
    if (!isLoading) {
      await updateNote();
    }
  };

  return (
    <div className="flex w-full justify-end">
      <button
        type="button"
        className={`
          w-full md:w-1/2 lg:w-1/4 py-2 text-sm rounded-md transition
          ${
            isModified
              ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-gray-200 dark:hover:text-gray-900"
              : "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
          }
        `}
        onClick={handleUpdate}
        disabled={isLoading}
      >
        {isLoading
          ? "Guardando..."
          : isModified
          ? "Guardar cambios"
          : "Volver a notas"}
      </button>
    </div>
  );
}
