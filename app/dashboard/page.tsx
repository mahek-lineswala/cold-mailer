"use client";

import { useState } from "react";
import TemplatePicker from "@/components/TemplatePicker";
import VariableForm from "@/components/VariableForm";
import Editor from "@/components/Editor";
import AttachmentUploader, { AttachmentData } from "@/components/AttachmentUploader";
import ConfirmDialog from "@/components/ConfirmDialog";
import ThemeToggle from "@/components/ThemeToggle";
import { templates, TemplateKey, fillTemplate, extractVariables } from "@/lib/templates";

export default function Dashboard() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey>("application");
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [subject, setSubject] = useState(templates.application.subject);
  const [html, setHtml] = useState(templates.application.body);
  const [to, setTo] = useState("");
  const [attachments, setAttachments] = useState<AttachmentData[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [sending, setSending] = useState(false);
  const [pendingTemplate, setPendingTemplate] = useState<TemplateKey | null>(null);

  const currentVars = extractVariables(templates[selectedTemplate]);

  function applyTemplate(key: TemplateKey, vars: Record<string, string>) {
    setSelectedTemplate(key);
    setHtml(fillTemplate(templates[key].body, vars));
    setSubject(fillTemplate(templates[key].subject, vars));
    setIsDirty(false);
  }

  function handleTemplateSelect(key: TemplateKey) {
    if (key === selectedTemplate) return;

    if (isDirty) {
      setPendingTemplate(key);
      return;
    }

    setVariables({});
    applyTemplate(key, {});
  }

  function confirmSwitch() {
    if (pendingTemplate) {
      setVariables({});
      applyTemplate(pendingTemplate, {});
    }
    setPendingTemplate(null);
  }

  function handleVariableChange(key: string, value: string) {
    const updatedVars = { ...variables, [key]: value };
    setVariables(updatedVars);
    setHtml(fillTemplate(templates[selectedTemplate].body, updatedVars));
    setSubject(fillTemplate(templates[selectedTemplate].subject, updatedVars));
    setIsDirty(false);
  }

  function handleEditorChange(newHtml: string) {
    setHtml(newHtml);
    setIsDirty(true);
  }

  async function handleSend() {
    if (!to) {
      alert("Please enter a recipient email.");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, html, attachments }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Email sent!");
      } else {
        alert("Failed to send: " + (data.error ?? "Unknown error"));
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors">
      <header className="flex items-center justify-between px-8 py-4 border-b border-neutral-200 dark:border-neutral-700">
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Cold Mailer
        </h1>
        <ThemeToggle />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 max-w-6xl mx-auto">
        {/* Left column: template + variables */}
        <div>
          <TemplatePicker selected={selectedTemplate} onSelect={handleTemplateSelect} />

          <VariableForm
            variables={currentVars}
            values={variables}
            onChange={handleVariableChange}
          />

          <div className="mb-4">
            <label className="block text-sm mb-1 text-neutral-600 dark:text-neutral-300">
              To (recipient email)
            </label>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recruiter@company.com"
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
            />
          </div>
        </div>

        {/* Right column: subject + editor + attachments + send */}
        <div>
          <div className="mb-3">
            <label className="block text-sm mb-1 text-neutral-600 dark:text-neutral-300">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
            />
          </div>

          <Editor content={html} onChange={handleEditorChange} />

          <AttachmentUploader onChange={setAttachments} />

          <button
            onClick={handleSend}
            disabled={sending}
            className="mt-5 w-full px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50"
          >
            {sending ? "Sending..." : "Send Email"}
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={pendingTemplate !== null}
        title="Unsaved changes"
        message="You have unsaved changes in the editor. Switching templates will discard them. Continue?"
        onConfirm={confirmSwitch}
        onCancel={() => setPendingTemplate(null)}
      />
    </div>
  );
}