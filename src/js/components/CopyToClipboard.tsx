import React from "react";

import type { ClipboardProps } from "../types";
import { normalizeNamespace } from "../types";
import { toType } from "./../helpers/util";
import Theme from "./../themes/getStyle";
import { Clippy } from "./icons";
function copyToClipboardFallback(text: string): void {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand("copy");
  } finally {
    document.body.removeChild(textArea);
  }
}
export default function CopyToClipboard({
  clickCallback,
  src,
  namespace: namespaceProp,
  theme,
  rowHovered,
}: ClipboardProps) {
  const namespace = normalizeNamespace(namespaceProp);
  const [copied, setCopied] = React.useState(false);
  const copiedTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  React.useEffect(() => () => clearTimeout(copiedTimer.current), []);
  function handleCopy() {
    const type = toType(src);
    const value = type === "function" || type === "regexp" ? String(src) : src;
    const text =
      typeof value === "string"
        ? value
        : (JSON.stringify(value, null, "  ") ?? "undefined");
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .catch(() => copyToClipboardFallback(text));
    } else {
      copyToClipboardFallback(text);
    }
    clearTimeout(copiedTimer.current);
    copiedTimer.current = setTimeout(() => setCopied(false), 5500);
    setCopied(true);
    if (typeof clickCallback === "function") {
      clickCallback({
        src,
        namespace,
        name: namespace[namespace.length - 1] ?? null,
      });
    }
  }
  return (
    <span
      className="copy-to-clipboard-container"
      title="Copy to clipboard"
      style={{
        verticalAlign: "top",
        display: rowHovered ? "inline-block" : "none",
      }}
    >
      <button
        type="button"
        aria-label="Copy to clipboard"
        style={{
          border: 0,
          padding: 0,
          background: "none",
          font: "inherit",
          ...Theme(theme, "copy-to-clipboard").style,
        }}
        onClick={handleCopy}
      >
        <Clippy className="copy-icon" {...Theme(theme, "copy-icon")} />
        {copied && (
          <span {...Theme(theme, "copy-icon-copied")}>{"\u2714"}</span>
        )}
      </button>
    </span>
  );
}
