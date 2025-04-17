import { RefObject } from "react";
import { useRouter } from "next/navigation";
import MarkdownEditor from "./MarkdownEditor";
import TagInput from "./TagInput";
import PublishButton from "./PublishButton";
import { STORAGE_KEYS } from "../hooks/useLocalStorage";

interface EditorFormProps {
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
  clearStorage: () => void;
}

export default function EditorForm({
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
  clearStorage,
}: EditorFormProps) {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el post
    console.log("Publicando:", { contenido, tags });

    // Limpiar localStorage después de publicar exitosamente
    clearStorage();

    alert("Post enviado con éxito");
    // Redireccionar y resetear el estado
    setContenido("");
    // router.push("/posts");
  };

  return (
    <div className="h-[calc(100vh-56px)] flex flex-col items-center">
      <form
        className="flex flex-col pt-1 px-6 w-full max-w-7xl mx-auto"
        onSubmit={handleSubmit}
      >
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
            />

            <PublishButton />
          </div>
        </div>
      </form>
    </div>
  );
}
