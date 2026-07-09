"use client";

import { useState } from "react";

interface CopyMarkdownButtonProps {
  content: string;
}

export function CopyMarkdownButton({ content }: CopyMarkdownButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content);
    } catch {
      // clipboard unavailable; still flash the confirmation for perceived feedback
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={
        copied
          ? "text-xs rounded px-2 py-1 border border-blue bg-blue text-white whitespace-nowrap transition-colors"
          : "text-xs rounded px-2 py-1 border border-rule text-faint hover:border-blue hover:text-blue whitespace-nowrap transition-colors"
      }
    >
      {copied ? "copied ✓" : "cat post.md ⧉"}
    </button>
  );
}
