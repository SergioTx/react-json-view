import React from 'react';

import type { ClipboardProps } from '../types';
import { normalizeNamespace } from '../types';
import { toType } from './../helpers/util';
import { Clippy } from './icons';
function copyToClipboardFallback(text: string): boolean {
  const activeElement = document.activeElement;
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.readOnly = true;
  textArea.className = 'rjv-clipboard-fallback';
  document.body.appendChild(textArea);
  textArea.select();
  try {
    return document.execCommand('copy');
  } finally {
    document.body.removeChild(textArea);
    if (activeElement instanceof HTMLElement) {
      activeElement.focus({ preventScroll: true });
    }
  }
}
export default function CopyToClipboard({
  clickCallback,
  src,
  namespace: namespaceProp,
}: ClipboardProps) {
  const namespace = normalizeNamespace(namespaceProp);
  const [status, setStatus] = React.useState('');
  const copiedTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  React.useEffect(() => () => clearTimeout(copiedTimer.current), []);
  async function handleCopy() {
    clearTimeout(copiedTimer.current);
    setStatus('');
    let text: string;
    try {
      const type = toType(src);
      const value =
        type === 'function' || type === 'regexp' ? String(src) : src;
      text =
        typeof value === 'string'
          ? value
          : (JSON.stringify(value, null, '  ') ?? 'undefined');
    } catch {
      setStatus('This value could not be serialized.');
      return;
    }
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else if (!copyToClipboardFallback(text)) {
        throw new Error('Clipboard unavailable');
      }
    } catch {
      setStatus('Could not copy to clipboard.');
      return;
    }
    setStatus('Copied to clipboard.');
    copiedTimer.current = setTimeout(() => setStatus(''), 5500);
    if (typeof clickCallback === 'function') {
      clickCallback({
        src,
        namespace,
        name: namespace[namespace.length - 1] ?? null,
      });
    }
  }
  return (
    <span className="copy-to-clipboard-container">
      <button
        type="button"
        aria-label="Copy to clipboard"
        className="rjv-copy-button"
        onClick={handleCopy}
      >
        <Clippy className="copy-icon" />
        {status === 'Copied to clipboard.' && (
          <span aria-hidden="true" className="rjv-copy-check">
            {'\u2714'}
          </span>
        )}
      </button>
      <output
        className={
          status === 'Copied to clipboard.' ? 'rjv-copy-success' : undefined
        }
      >
        {status}
      </output>
    </span>
  );
}
