import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Reply, Heart } from 'lucide-react';
import Avatar from '../shared/Avatar';
import DateDisplay from '../shared/DateDisplay';
import { ROUTES } from '../../config/routes';

export default function CommentItem({ comment, onReply }) {
  if (!comment) return null;

  const { id, author, content, created_at, replies = [] } = comment;
  const [likes, setLikes] = useState(comment.like_count || 0);
  const [isLiked, setIsLiked] = useState(false);

  const toggleLike = () => {
    setIsLiked(!isLiked);
    setLikes((prev) => (!isLiked ? prev + 1 : Math.max(prev - 1, 0)));
  };

  return (
    <div className="space-y-3 pt-3">
      <div className="flex items-start gap-2.5">
        <Link to={ROUTES.PROFILE(author?.id || '')}>
          <Avatar
            src={author?.avatar_url}
            name={author?.full_name}
            size="sm"
            className="cursor-pointer hover:ring-2 ring-primary-500/50"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center justify-between gap-2 mb-1">
              <Link
                to={ROUTES.PROFILE(author?.id || '')}
                className="text-xs font-bold text-slate-900 dark:text-white hover:text-primary-600 transition-colors"
              >
                {author?.full_name || 'Builder'}
              </Link>
              <span className="text-[10px] text-slate-400">
                <DateDisplay date={created_at} />
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {content}
            </p>
          </div>

          {/* Comment actions */}
          <div className="flex items-center gap-3 mt-1 ml-2 text-[11px] text-slate-400 font-medium">
            <button
              type="button"
              onClick={toggleLike}
              className={`hover:text-red-500 flex items-center gap-1 transition-colors ${
                isLiked ? 'text-red-500' : ''
              }`}
            >
              <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likes > 0 ? likes : 'Like'}</span>
            </button>
            <button
              type="button"
              onClick={() => onReply?.(id, author?.full_name)}
              className="hover:text-primary-600 flex items-center gap-1 transition-colors"
            >
              <Reply className="w-3 h-3" />
              <span>Reply</span>
            </button>
          </div>

          {/* Nested Replies (1 level) */}
          {replies.length > 0 && (
            <div className="mt-3 pl-4 border-l-2 border-slate-200 dark:border-slate-800 space-y-3">
              {replies.map((reply) => (
                <div key={reply.id} className="flex items-start gap-2.5">
                  <Avatar
                    src={reply.author?.avatar_url}
                    name={reply.author?.full_name}
                    size="xs"
                  />
                  <div className="flex-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {reply.author?.full_name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        <DateDisplay date={reply.created_at} />
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                      {reply.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
