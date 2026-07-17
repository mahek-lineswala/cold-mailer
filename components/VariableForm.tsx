"use client";

interface VariableFormProps {
  variables: string[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
}

const LABELS: Record<string, string> = {
  company: "Company Name",
  position: "Position",
  yourName: "Your Name",
  recruiterName: "Recruiter Name",
  applicationDate: "Application Date",
};

const PLACEHOLDERS: Record<string, string> = {
  company: "e.g. Linear",
  position: "e.g. Senior Product Designer",
  yourName: "John Smith",
  recruiterName: "Jane Doe",
  applicationDate: "e.g. July 1",
};

export default function VariableForm({ variables, values, onChange }: VariableFormProps) {
  const fullWidthKeys = variables.filter((v) => v !== "yourName" && v !== "recruiterName");
  const pairedKeys = variables.filter((v) => v === "yourName" || v === "recruiterName");

  function renderField(v: string) {
    return (
      <div key={v}>
        <label className="block text-sm font-medium mb-1.5 text-neutral-700 dark:text-neutral-300">
          {LABELS[v] ?? v}
        </label>
        <input
          type="text"
          value={values[v] ?? ""}
          onChange={(e) => onChange(v, e.target.value)}
          placeholder={PLACEHOLDERS[v] ?? ""}
          className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-2">
      {fullWidthKeys.map(renderField)}
      {pairedKeys.length > 0 && (
        <div className="grid grid-cols-2 gap-4">{pairedKeys.map(renderField)}</div>
      )}
    </div>
  );
}