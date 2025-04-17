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
          className="full-textarea text-lg shadow-md dark:text-white dark:bg-gray-900"
        />
      ) : (
        <div className="full-textarea markdown-preview prose prose-lg shadow-md dark:prose-invert max-w-none">
          {value ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
          ) : (
            <p className="text-gray-400 dark:text-gray-500 italic">
              La vista previa aparecerá aquí...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
