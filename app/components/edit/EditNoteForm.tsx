import { RefObject, useEffect } from "react";
import { useRouter } from "next/navigation";
import MarkdownEditor from "../principal/MarkdownEditor";
import TagInput from "../principal/TagInput";
import UpdateButton from "./UpdateButton";

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
}: EditNoteFormProps) {
  const router = useRouter();

  // Función para cancelar la edición
  const handleCancel = () => {
    router.push("/posts");
  };

  // Determinar la tecla modificadora según el sistema
  const isMac =
    typeof navigator !== "undefined" ? /Mac/.test(navigator.platform) : false;
  const modifierKey = isMac ? "⌘" : "Ctrl+";

  // Agregar atajo de teclado para cancelar
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Para macOS: Cmd+Delete, para otros: Ctrl+Delete
      if (
        event.key === "Delete" &&
        ((isMac && event.metaKey) || (!isMac && event.ctrlKey))
      ) {
        handleCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMac]);

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
              onCancel={handleCancel}
              isEditMode={true}
            />

            <UpdateButton updateNote={updateNote} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
