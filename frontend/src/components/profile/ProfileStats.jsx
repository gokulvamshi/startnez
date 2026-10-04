import React from 'react';
import { Users, FileText, FolderGit2 } from 'lucide-react';

export default function ProfileStats({
  connectionCount = 0,
  postCount = 0,
  projectCount = 0
}) {
  return (
    <div className="flex items-center gap-6 py-3 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-primary-500" />
        <span className="text-sm font-bold text-slate-900 dark:text-white">{connectionCount}</span>
        <span className="text-xs text-slate-500">Connections</span>
      </div>

      <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />

      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4 text-emerald-500" />
        <span className="text-sm font-bold text-slate-900 dark:text-white">{postCount}</span>
        <span className="text-xs text-slate-500">Posts</span>
      </div>

      <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />

      <div className="flex items-center gap-2">
        <FolderGit2 className="w-4 h-4 text-indigo-500" />
        <span className="text-sm font-bold text-slate-900 dark:text-white">{projectCount}</span>
        <span className="text-xs text-slate-500">Projects</span>
      </div>
    </div>
  );
}
