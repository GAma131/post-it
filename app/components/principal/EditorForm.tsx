import { RefObject, useState } from "react";
import { useRouter } from "next/navigation";
import MarkdownEditor from "./MarkdownEditor";
import TagInput from "./TagInput";
import { STORAGE_KEYS } from "../../hooks/useLocalStorage";
import axios from "axios";
import { apiUrl } from "../../config/api";

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
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    setIsPublishing(true);

    try {
      // Separar la primera línea como título y el resto como contenido
      const lines = contenido.split("\n");
      const title = lines[0] || "";
      const content = lines.slice(1).join("\n").trim();

      // Realizar la solicitud POST con axios
      const response = await axios.post(apiUrl("api/notes"), {
        title,
        content,
        tags,
      });

      // Limpiar localStorage después de publicar exitosamente
      clearStorage();

      // Redirigir a la pantalla de posts
      router.push("/posts");
    } catch (error) {
      console.error("Error:", error);
      alert("No se pudo publicar la nota");
    } finally {
      setIsPublishing(false);
    }
  };

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

          <div className="flex flex-col mt-2">
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
              onPublish={handlePublish}
              isPublishing={isPublishing}
              isCreateMode={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
