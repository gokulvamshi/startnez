import React, { useState, useRef } from 'react';
import { Bold, Italic, Code, Link as LinkIcon, List, Eye, Edit3, Quote } from 'lucide-react';
import DOMPurify from 'dompurify';

export default function RichTextEditor({
  value = '',
  onChange,
  placeholder = 'Write your thoughts, hackathon retrospective, code snippets, or team recruitments...',
  error,
  rows = 6
}) {
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef(null);

  const insertFormatting = (prefix, suffix = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end) || 'text';

    const replacement = `${prefix}${selectedText}${suffix}`;
    const nextVal = text.substring(0, start) + replacement + text.substring(end);
    onChange(nextVal);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 0);
  };

  // Convert markdown to clean sanitized HTML for live preview
  const renderPreview = () => {
    let html = value
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-slate-900 text-slate-100 p-3 rounded-xl my-2 text-xs font-mono overflow-x-auto">$1</pre>')
      .replace(/`([^`]+)`/g, '<code class="bg-slate-100 dark:bg-slate-800 text-primary-600 dark:text-primary-400 px-1 py-0.5 rounded text-xs font-mono">$1</code>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary-600 underline font-medium">$1</a>')
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-primary-500 pl-3 italic text-slate-500 my-2">$1</blockquote>')
      .replace(/\n/g, '<br />');

    return DOMPurify.sanitize(html);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Post Content
        </label>
        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className="inline-flex items-center gap-1.5 text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium"
        >
          {isPreview ? (
            <>
              <Edit3 className="w-3.5 h-3.5" />
              <span>Back to Edit</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>Live Preview</span>
            </>
          )}
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500">
        {/* Formatting Toolbar */}
        {!isPreview && (
          <div className="flex items-center gap-1 p-2 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => insertFormatting('**', '**')}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('*', '*')}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('`', '`')}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Inline Code"
            >
              <Code className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('\n```\n', '\n```\n')}
              className="px-2 py-1 rounded-lg text-xs font-mono text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Code Block"
            >
              {'{}'}
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('[Link Title](', ')')}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Link"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('> ')}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Quote"
            >
              <Quote className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Text Input vs Rendered Preview */}
        {isPreview ? (
          <div
            className="p-4 min-h-[160px] text-sm text-slate-800 dark:text-slate-200 prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: renderPreview() || '<p class="text-slate-400 italic">No content to preview</p>' }}
          />
        ) : (
          <textarea
            ref={textareaRef}
            rows={rows}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-4 text-sm text-slate-900 dark:text-white bg-transparent focus:outline-none resize-none font-sans"
          />
        )}
      </div>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
