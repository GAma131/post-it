"use client";

import { useRef, RefObject } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  showPreview: boolean;
  textareaRef: RefObject<HTMLTextAreaElement>;
}

export default function MarkdownEditor({
  value,
  onChange,
  showPreview,
  textareaRef,
}: MarkdownEditorProps) {
  return (
    <div className="relative">
      {!showPreview ? (
        <textarea
          ref={textareaRef}
          placeholder="Escribe en Markdown..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="full-textarea text-lg shadow-md scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent hover:scrollbar-thumb-gray-300"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#E5E7EB transparent",
          }}
        />
      ) : (
        <div className="full-textarea overflow-auto shadow-md p-6 bg-white prose prose-lg max-w-none">
          {value ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
          ) : (
            <p className="text-gray-400 italic">
              La vista previa aparecerá aquí...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
