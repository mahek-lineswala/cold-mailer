"use client";

import { useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import TemplatePicker from "@/components/TemplatePicker";
import VariableForm from "@/components/VariableForm";
import Editor from "@/components/Editor";
import AttachmentUploader, { AttachmentData } from "@/components/AttachmentUploader";
import ConfirmDialog from "@/components/ConfirmDialog";
import { templates, TemplateKey, fillTemplate, extractVariables } from "@/lib/templates";
import { AtSign, Send, Info } from "lucide-react";

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
      alert(data.success ? "Email sent!" : "Failed to send: " + (data.error ?? "Unknown error"));
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <DashboardHeader />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 max-w-6xl mx-auto">
        <div>
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
            <h2 className="text-lg font-bold text-indigo-600 mb-5">Campaign Configuration</h2>

            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Choose Template</p>
            <TemplatePicker selected={selectedTemplate} onSelect={handleTemplateSelect} />

            <VariableForm variables={currentVars} values={variables} onChange={handleVariableChange} />

            <div className="mt-5 pt-5 border-t border-neutral-100 dark:border-neutral-800">
              <label className="block text-sm font-medium mb-1.5 text-neutral-700 dark:text-neutral-300">
                To (recipient email)
              </label>
              <div className="relative">
                <AtSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="email"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="jane.doe@company.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-indigo-50 dark:bg-neutral-900 border border-indigo-100 dark:border-neutral-800 p-5 flex gap-3">
            <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 mb-1">Personalization Tip</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Mentioning something specific about the company increases reply rates. Fill in the fields above to personalize your message automatically.
              </p>
            </div>
          </div>
        </div>

        <div>
          <Editor subject={subject} onSubjectChange={setSubject} content={html} onChange={handleEditorChange} />

          <AttachmentUploader onChange={setAttachments} />

          <button
            onClick={handleSend}
            disabled={sending}
            className="mt-6 w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {sending ? "Sending..." : "Send Email"}
            <Send className="w-4 h-4" />
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