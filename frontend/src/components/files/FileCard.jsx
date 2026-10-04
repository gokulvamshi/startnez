import React from 'react';
import { File, FileText, Image, FileCode, Download, Trash2, Eye } from 'lucide-react';
import Avatar from '../shared/Avatar';
import DateDisplay from '../shared/DateDisplay';

export default function FileCard({
  file,
  onDownload,
  onPreview,
  onDelete
}) {
  if (!file) return null;

  const { id, file_name, file_url, file_size, file_type, uploaded_by, created_at } = file;

  const getFileIcon = (mime = '') => {
    if (mime.startsWith('image/')) return { icon: Image, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' };
    if (mime.includes('pdf')) return { icon: FileText, color: 'text-red-500 bg-red-50 dark:bg-red-950/40' };
    if (mime.includes('javascript') || mime.includes('typescript') || mime.includes('json') || mime.includes('html')) {
      return { icon: FileCode, color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/40' };
    }
    return { icon: File, color: 'text-slate-500 bg-slate-100 dark:bg-slate-800' };
  };

  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const { icon: Icon, color } = getFileIcon(file_type);

  return (
    <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
            {file_name}
          </p>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
            <span>{formatSize(file_size)}</span>
            <span>•</span>
            <DateDisplay date={created_at} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {file_type?.startsWith('image/') && (
          <button
            type="button"
            onClick={() => onPreview(file)}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Preview file"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}

        <a
          href={file_url}
          download={file_name}
          target="_blank"
          rel="noreferrer"
          className="p-1.5 text-slate-400 hover:text-primary-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Download file"
        >
          <Download className="w-4 h-4" />
        </a>

        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(id)}
            className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors opacity-0 group-hover:opacity-100"
            title="Delete file"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
