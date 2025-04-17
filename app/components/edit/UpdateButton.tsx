"use client";

interface UpdateButtonProps {
  updateNote: () => Promise<void>;
  isLoading: boolean;
}

export default function UpdateButton({
  updateNote,
  isLoading,
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
        className="w-full md:w-1/2 lg:w-1/4 bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white py-2 text-sm rounded-md hover:bg-gray-900 hover:text-white dark:hover:bg-gray-200 dark:hover:text-gray-900 transition"
        onClick={handleUpdate}
        disabled={isLoading}
      >
        {isLoading ? "Actualizando..." : "Actualizar"}
      </button>
    </div>
  );
}
