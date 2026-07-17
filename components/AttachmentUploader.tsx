"use client";

import { useState } from "react";

export interface AttachmentData {
  filename: string;
  mimeType: string;
  base64Data: string;
}

interface AttachmentUploaderProps {
  onChange: (attachments: AttachmentData[]) => void;
}

export default function AttachmentUploader({ onChange }: AttachmentUploaderProps) {
  const [files, setFiles] = useState<AttachmentData[]>([]);

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // strip the "data:mime/type;base64," prefix — Gmail API just wants raw base64
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files;
    if (!selected) return;

    const newAttachments: AttachmentData[] = [];
    for (const file of Array.from(selected)) {
      const base64Data = await fileToBase64(file);
      newAttachments.push({
        filename: file.name,
        mimeType: file.type || "application/octet-stream",
        base64Data,
      });
    }

    const updated = [...files, ...newAttachments];
    setFiles(updated);
    onChange(updated);
  }

  function removeFile(index: number) {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onChange(updated);
  }

 return (
    <div className="mt-4">
      <label className="inline-block px-4 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer">
        Attach files
        <input type="file" multiple onChange={handleFileChange} className="hidden" />
      </label>
      <ul className="mt-2 space-y-1">
        {files.map((f, i) => (
          <li
            key={i}
            className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300"
          >
            {f.filename} ({Math.round((f.base64Data.length * 0.75) / 1024)} KB)
            <button
              type="button"
              onClick={() => removeFile(i)}
              className="text-red-500 hover:text-red-600 text-xs"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}