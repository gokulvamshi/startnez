import React from 'react';
import { FileText, FolderGit2, Rocket } from 'lucide-react';

const TABS = [
  { id: 'posts', label: 'Posts & Feed', icon: FileText },
  { id: 'projects', label: 'Projects & Hackathons', icon: FolderGit2 },
  { id: 'startups', label: 'Ventures & Startups', icon: Rocket }
];

export default function ProfileTabs({ activeTab = 'posts', onChange }) {
  return (
    <div className="flex border-b border-slate-200 dark:border-slate-800">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 py-3 px-5 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
              isActive
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
