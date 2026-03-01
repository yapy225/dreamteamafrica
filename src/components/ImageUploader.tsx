"use client";

import { useCallback, useRef, useState, type DragEvent, type ChangeEvent } from "react";

interface ImageUploaderProps {
  folder?: string;
  multiple?: boolean;
  accept?: string;
  onUploadComplete?: (files: { url: string; path: string }[]) => void;
  onError?: (error: string) => void;
}

export default function ImageUploader({
  folder = "",
  multiple = false,
  accept = "image/*",
  onUploadComplete,
  onError,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(
    async (files: FileList | File[]) => {
      setIsUploading(true);
      try {
        const formData = new FormData();
        if (folder) formData.set("folder", folder);

        if (multiple && files.length > 1) {
          for (const file of files) formData.append("files", file);
          const res = await fetch("/api/upload/multiple", { method: "POST", body: formData });
          if (!res.ok) throw new Error((await res.json()).error ?? "Upload échoué");
          const data = await res.json();
          onUploadComplete?.(data.files);
        } else {
          formData.set("file", files[0]);
          const res = await fetch("/api/upload", { method: "POST", body: formData });
          if (!res.ok) throw new Error((await res.json()).error ?? "Upload échoué");
          const data = await res.json();
          onUploadComplete?.([{ url: data.url, path: data.path }]);
        }
      } catch (err) {
        onError?.(err instanceof Error ? err.message : "Upload échoué");
      } finally {
        setIsUploading(false);
      }
    },
    [folder, multiple, onUploadComplete, onError],
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length) upload(e.dataTransfer.files);
    },
    [upload],
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) upload(e.target.files);
    },
    [upload],
  );

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
        isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
      } ${isUploading ? "pointer-events-none opacity-50" : ""}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
      />
      {isUploading ? (
        <p className="text-gray-500">Upload en cours...</p>
      ) : (
        <p className="text-gray-500">
          Glissez vos fichiers ici ou cliquez pour sélectionner
        </p>
      )}
    </div>
  );
}
