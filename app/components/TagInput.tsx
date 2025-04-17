"use client";

import { RefObject } from "react";

interface TagInputProps {
  tags: string[];
  tagInput: string;
  tagInputRef: RefObject<HTMLInputElement>;
  onTagInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTagInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onTagRemove: (tag: string) => void;
  onTagInputBlur: () => void;
}

export default function TagInput({
  tags,
  tagInput,
  tagInputRef,
  onTagInputChange,
  onTagInputKeyDown,
  onTagRemove,
  onTagInputBlur,
}: TagInputProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-2">
      <div className="w-full flex justify-center gap-3">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          <kbd className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
            Alternar markdown ⌘E
          </kbd>
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          <kbd className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
            Eliminar etiqueta ⌘⌫
          </kbd>
        </span>
      </div>
      {tags.map((tag) => (
        <div
          key={tag}
          className="tag bg-gray-100 dark:bg-gray-700 dark:text-gray-200"
        >
          {tag}
          <button
            type="button"
            onClick={() => onTagRemove(tag)}
            className="tag-remove"
          >
            ×
          </button>
        </div>
      ))}
      <input
        ref={tagInputRef}
        type="text"
        value={tagInput}
        onChange={onTagInputChange}
        onKeyDown={onTagInputKeyDown}
        onBlur={onTagInputBlur}
        placeholder="✎ Etiquetas |"
        className="w-full md:w-1/2 lg:w-1/2 py-2 px-3 rounded-md text-md border-none outline-none text-right ml-auto border-b-2 border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-colors dark:bg-gray-800 dark:text-white"
      />
    </div>
  );
}
