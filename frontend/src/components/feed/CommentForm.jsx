import React, { useState } from 'react';
import { Send, X } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import Avatar from '../shared/Avatar';

export default function CommentForm({
  onSubmit,
  replyingTo = null,
  onCancelReply,
  isLoading = false
}) {
  const { user } = useAuthStore();
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim() || isLoading) return;
    onSubmit(content);
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {replyingTo && (
        <div className="flex items-center justify-between text-xs text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40 px-3 py-1.5 rounded-lg border border-primary-100 dark:border-primary-900/50">
          <span>Replying to @{replyingTo.authorName}</span>
          <button
            type="button"
            onClick={onCancelReply}
            className="hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Avatar
          src={user?.avatar_url}
          name={user?.full_name || 'Me'}
          size="sm"
        />
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder={replyingTo ? `Write a reply...` : `Share your thoughts or feedback...`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isLoading}
            className="w-full pl-3.5 pr-10 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
          <button
            type="submit"
            disabled={!content.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-primary-600 disabled:opacity-40 hover:bg-primary-50 dark:hover:bg-primary-950/40 rounded-lg transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </form>
  );
}
