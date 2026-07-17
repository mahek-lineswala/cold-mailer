"use client";

import { templates, TemplateKey } from "@/lib/templates";

interface TemplatePickerProps {
  selected: TemplateKey;
  onSelect: (key: TemplateKey) => void;
}

export default function TemplatePicker({ selected, onSelect }: TemplatePickerProps) {
  return (
    <div className="flex gap-2 mb-5 flex-wrap">
      {(Object.keys(templates) as TemplateKey[]).map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => onSelect(key)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selected === key
              ? "bg-indigo-600 text-white"
              : "bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700"
          }`}
        >
          {templates[key].label}
        </button>
      ))}
    </div>
  );
}