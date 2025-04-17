import { RefObject, useEffect } from "react";
import { useRouter } from "next/navigation";
import MarkdownEditor from "../principal/MarkdownEditor";
import TagInput from "../principal/TagInput";

interface EditNoteFormProps {
  contenido: string;
  setContenido: (content: string) => void;
  tags: string[];
  tagInput: string;
  textareaRef: RefObject<HTMLTextAreaElement>;
  tagInputRef: RefObject<HTMLInputElement>;
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
  handleTagInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTagInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  removeTag: (tag: string) => void;
  handleTagInputBlur: () => void;
  removeLastTag: () => void;
  updateNote: () => Promise<void>;
  isLoading: boolean;
  isModified: boolean;
}

export default function EditNoteForm({
  contenido,
  setContenido,
  tags,
  tagInput,
  textareaRef,
  tagInputRef,
  showPreview,
  setShowPreview,
  handleTagInputChange,
  handleTagInputKeyDown,
  removeTag,
  handleTagInputBlur,
  removeLastTag,
  updateNote,
  isLoading,
  isModified,
}: EditNoteFormProps) {
  const router = useRouter();

  // Determinar la tecla modificadora según el sistema
  const isMac =
    typeof navigator !== "undefined" ? /Mac/.test(navigator.platform) : false;
  const modifierKey = isMac ? "⌘" : "Ctrl+";

  // Agregar atajo de teclado para volver a la lista de notas
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Para macOS: Cmd+Delete, para otros: Ctrl+Delete
      if (
        event.key === "Delete" &&
        ((isMac && event.metaKey) || (!isMac && event.ctrlKey))
      ) {
        router.push("/posts");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMac, router]);

  return (
    <div className="h-[calc(100vh-56px)] flex flex-col items-center">
      <div className="flex flex-col pt-1 px-6 w-full max-w-7xl mx-auto">
        <div className="editor-container">
          <MarkdownEditor
            value={contenido}
            onChange={setContenido}
            showPreview={showPreview}
            textareaRef={textareaRef}
          />

          <div className="flex flex-col mt-4">
            <TagInput
              tags={tags}
              tagInput={tagInput}
              tagInputRef={tagInputRef}
              onTagInputChange={handleTagInputChange}
              onTagInputKeyDown={handleTagInputKeyDown}
              onTagRemove={removeTag}
              onTagInputBlur={handleTagInputBlur}
              showPreview={showPreview}
              togglePreview={() => setShowPreview(!showPreview)}
              removeLastTag={removeLastTag}
              onSaveOrReturn={updateNote}
              isSaving={isLoading}
              isModified={isModified}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
