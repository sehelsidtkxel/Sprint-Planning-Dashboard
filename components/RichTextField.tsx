"use client";

import { useRef } from "react";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  rows?: number;
};

export default function RichTextField({
  label,
  value,
  onChange,
  maxLength = 1000,
  rows = 5,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  function wrapSelection(prefix: string, suffix = "") {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.slice(start, end);

    const replacement = selectedText
      ? `${prefix}${selectedText}${suffix}`
      : `${prefix}text${suffix}`;

    const newValue =
      value.slice(0, start) + replacement + value.slice(end);

    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + replacement.length - suffix.length
      );
    }, 0);
  }

  function addBullet() {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.slice(start, end);

    const replacement = selectedText
      ? selectedText
          .split("\n")
          .map((line) => `• ${line}`)
          .join("\n")
      : "• ";

    const newValue =
      value.slice(0, start) + replacement + value.slice(end);

    onChange(newValue);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-sm text-slate-700">
          {label}
        </span>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => wrapSelection("**", "**")}
            className="px-3 py-1 rounded bg-slate-100 font-bold"
          >
            B
          </button>

          <button
            type="button"
            onClick={addBullet}
            className="px-3 py-1 rounded bg-slate-100"
          >
            • List
          </button>
        </div>
      </div>

      <textarea
        ref={textareaRef}
        required
        rows={rows}
        maxLength={maxLength}
        className="border rounded-lg p-3 w-full whitespace-pre-wrap"
        placeholder={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      <p className="text-xs text-gray-400 text-right">
        {value.length}/{maxLength}
      </p>
    </div>
  );
}