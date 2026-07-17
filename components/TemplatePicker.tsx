"use client";

import { templates, TemplateKey } from "@/lib/templates";

interface TemplatePickerProps {
  selected: TemplateKey;
  onSelect: (key: TemplateKey) => void;
}

export default function TemplatePicker({ selected, onSelect }: TemplatePickerProps) {
  return (
    <div className="flex gap-2 mb-6 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl w-fit">
      {(Object.keys(templates) as TemplateKey[]).map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => onSelect(key)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selected === key
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-neutral-600 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-700"
          }`}
        >
          {templates[key].label}
        </button>
      ))}
    </div>
  );
}