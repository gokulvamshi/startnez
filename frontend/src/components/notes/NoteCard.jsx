import React from 'react';
import { FileText, Edit2, Trash2 } from 'lucide-react';
import DateDisplay from '../shared/DateDisplay';

export default function NoteCard({ note, onEdit, onDelete }) {
  if (!note) return null;

  const { id, title, content, updated_at } = note;

  return (
    <div
      onClick={() => onEdit(note)}
      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary-500" />
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1">
              {title || 'Untitled Note'}
            </h4>
          </div>

          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
              className="p-1 text-slate-400 hover:text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors opacity-0 group-hover:opacity-100"
              title="Delete Note"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-4 leading-relaxed whitespace-pre-wrap">
          {content || 'Empty note... Click to add collaborative content.'}
        </p>
      </div>

      <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <DateDisplay date={updated_at} />
        <span className="flex items-center gap-1 text-primary-600 dark:text-primary-400 font-semibold group-hover:underline">
          <Edit2 className="w-3 h-3" />
          <span>Edit</span>
        </span>
      </div>
    </div>
  );
}
