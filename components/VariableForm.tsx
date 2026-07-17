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

export default function VariableForm({ variables, values, onChange }: VariableFormProps) {
  return (
    <div className="grid gap-3 mb-4">
      {variables.map((v) => (
        <div key={v}>
          <label className="block text-sm mb-1 text-neutral-600 dark:text-neutral-300">
            {LABELS[v] ?? v}
          </label>
          <input
            type="text"
            value={values[v] ?? ""}
            onChange={(e) => onChange(v, e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
          />
        </div>
      ))}
    </div>
  );
}