import { useRef } from "react";

interface UseTagManagerProps {
  tags: string[];
  tagInput: string;
  tagInputRef: React.RefObject<HTMLInputElement>;
  setTagInput: (value: string) => void;
  setTags: (tags: string[]) => void;
}

export function useTagManager({
  tags,
  tagInput,
  tagInputRef,
  setTagInput,
  setTags,
}: UseTagManagerProps) {
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Agregar etiqueta al presionar espacio o Enter
    if ((e.key === " " || e.key === "Enter") && tagInput.trim() !== "") {
      e.preventDefault();
      addTag(tagInput.trim());
      // Asegurar que el input mantenga el foco después de agregar la etiqueta
      setTimeout(() => {
        if (tagInputRef.current) {
          tagInputRef.current.focus();
        }
      }, 0);
    }
  };

  const addTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const removeLastTag = () => {
    setTags(tags.slice(0, -1));
    // Asegurar que el input mantenga el foco después de eliminar la última etiqueta
    setTimeout(() => {
      if (tagInputRef.current) {
        tagInputRef.current.focus();
      }
    }, 0);
  };

  const handleTagInputBlur = () => {
    if (tagInput.trim() !== "") {
      addTag(tagInput.trim());
    }
  };

  return {
    handleTagInputChange,
    handleTagInputKeyDown,
    addTag,
    removeTag,
    removeLastTag,
    handleTagInputBlur,
  };
}
