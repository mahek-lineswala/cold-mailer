"use client";

import { useState } from "react";
import { Paperclip, FileText, X } from "lucide-react";

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
      reader.onload = () => resolve((reader.result as string).split(",")[1]);
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
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Attachments</span>
        <label className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 cursor-pointer hover:text-indigo-700">
          <Paperclip className="w-4 h-4" />
          Attach files
          <input type="file" multiple onChange={handleFileChange} className="hidden" />
        </label>
      </div>
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-neutral-800 border border-indigo-100 dark:border-neutral-700 text-sm text-neutral-700 dark:text-neutral-200"
            >
              <FileText className="w-4 h-4 text-indigo-500" />
              {f.filename} ({Math.round((f.base64Data.length * 0.75) / 1024)}KB)
              <button type="button" onClick={() => removeFile(i)} className="text-neutral-400 hover:text-red-500">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}