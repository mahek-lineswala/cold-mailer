"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { useEffect, useRef, useState } from "react";
import { Bold, Italic, Link as LinkIcon, Image as ImageIcon, List } from "lucide-react";

interface EditorProps {
  subject: string;
  onSubjectChange: (subject: string) => void;
  content: string;
  onChange: (html: string) => void;
}

export default function Editor({ subject, onSubjectChange, content, onChange }: EditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    extensions: [StarterKit, Link.configure({ openOnClick: false }), Image],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none min-h-[320px] focus:outline-none text-neutral-800 dark:text-neutral-100",
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  const toolbarBtn =
    "p-2 rounded-md text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-800 dark:hover:text-neutral-200";

  function openLinkDialog() {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, " ");
    setLinkText(selectedText);
    setLinkUrl("");
    setShowLinkDialog(true);
  }

  function confirmLink() {
    if (!editor || !linkUrl) {
      setShowLinkDialog(false);
      return;
    }
    const { from, to } = editor.state.selection;
    const hasSelection = from !== to;

    if (hasSelection) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
    } else {
      const text = linkText || linkUrl;
      editor
        .chain()
        .focus()
        .insertContent(`<a href="${linkUrl}">${text}</a>`)
        .run();
    }
    setShowLinkDialog(false);
  }

  function handleImageFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      editor.chain().focus().setImage({ src: dataUrl }).run();
    };
    reader.readAsDataURL(file);

    // reset so selecting the same file again still triggers onChange
    e.target.value = "";
  }

  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 overflow-hidden relative">
      <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
        <input
          type="text"
          value={subject}
          onChange={(e) => onSubjectChange(e.target.value)}
          placeholder="Subject"
          className="w-full text-lg font-medium text-neutral-800 dark:text-neutral-100 bg-transparent focus:outline-none placeholder:text-neutral-400"
        />
      </div>

      <div className="flex items-center gap-1 px-4 py-2 border-b border-neutral-100 dark:border-neutral-800">
        <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()} className={toolbarBtn}>
          <Bold className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()} className={toolbarBtn}>
          <Italic className="w-4 h-4" />
        </button>
        <button type="button" onClick={openLinkDialog} className={toolbarBtn}>
          <LinkIcon className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => fileInputRef.current?.click()} className={toolbarBtn}>
          <ImageIcon className="w-4 h-4" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageFileChange}
          className="hidden"
        />
        <div className="w-px h-5 bg-neutral-200 dark:bg-neutral-700 mx-1" />
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={toolbarBtn}
        >
          <List className="w-4 h-4" />
        </button>
      </div>

      <div className="px-6 py-5">{editor && <EditorContent editor={editor} />}</div>

      {showLinkDialog && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-xl p-5 w-full max-w-sm mx-4">
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Insert link
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1 text-neutral-500 dark:text-neutral-400">
                  Text to display
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="e.g. my portfolio"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-neutral-500 dark:text-neutral-400">
                  URL
                </label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  autoFocus
                  className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setShowLinkDialog(false)}
                className="px-4 py-1.5 text-sm rounded-lg border border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmLink}
                className="px-4 py-1.5 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}