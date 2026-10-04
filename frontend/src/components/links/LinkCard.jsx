import React from 'react';
import { ExternalLink, Trash2, Globe } from 'lucide-react';
import DateDisplay from '../shared/DateDisplay';

export default function LinkCard({ link, onDelete }) {
  if (!link) return null;

  const { id, title, url, description, created_at } = link;

  return (
    <div className="flex items-start justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary-600 flex items-center justify-center shrink-0">
          <Globe className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white hover:text-primary-600 transition-colors inline-flex items-center gap-1.5 line-clamp-1"
          >
            <span>{title}</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
              {description}
            </p>
          )}
          <span className="text-[10px] text-slate-400 mt-1 block font-mono">
            <DateDisplay date={created_at} />
          </span>
        </div>
      </div>

      {onDelete && (
        <button
          type="button"
          onClick={() => onDelete(id)}
          className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
          title="Delete link"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
