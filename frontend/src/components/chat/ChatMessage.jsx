import React from 'react';
import Avatar from '../shared/Avatar';
import DateDisplay from '../shared/DateDisplay';

export default function ChatMessage({ message, isOwn = false }) {
  if (!message) return null;

  const { sender, content, created_at } = message;

  return (
    <div
      className={`flex items-end gap-2.5 max-w-[85%] ${
        isOwn ? 'ml-auto flex-row-reverse' : 'mr-auto'
      }`}
    >
      {!isOwn && (
        <Avatar
          src={sender?.avatar_url}
          name={sender?.full_name || 'Teammate'}
          size="xs"
          className="shrink-0 mb-1"
        />
      )}

      <div className="space-y-1">
        {!isOwn && (
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 pl-1">
            {sender?.full_name || 'Teammate'}
          </p>
        )}
        <div
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words ${
            isOwn
              ? 'bg-primary-600 text-white rounded-br-xs shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-xs border border-slate-200/60 dark:border-slate-700/60'
          }`}
        >
          {content}
        </div>
        <div
          className={`flex items-center text-[10px] text-slate-400 px-1 ${
            isOwn ? 'justify-end' : 'justify-start'
          }`}
        >
          <DateDisplay date={created_at} />
        </div>
      </div>
    </div>
  );
}
