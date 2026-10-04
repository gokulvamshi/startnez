import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { Lock, Sparkles, Trophy, Code, BookOpen, HelpCircle, Award, Share2 } from 'lucide-react';
import Card from '../shared/Card';
import PostAuthorInfo from './PostAuthorInfo';
import PostImages from './PostImages';
import PostActions from './PostActions';
import PostComments from './PostComments';
import { ROUTES } from '../../config/routes';

const TYPE_CONFIG = {
  hackathon_experience: { label: 'Hackathon', icon: Trophy, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200' },
  project_showcase: { label: 'Showcase', icon: Code, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200' },
  tutorial: { label: 'Tutorial', icon: BookOpen, color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/40 border-sky-200' },
  question: { label: 'Discussion', icon: HelpCircle, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40 border-purple-200' },
  achievement: { label: 'Win', icon: Award, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-200' },
  resource: { label: 'Resource', icon: Share2, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200' }
};

export default function PostCard({ post }) {
  if (!post) return null;

  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(post.comment_count || 0);

  const {
    id,
    author,
    post_type,
    title,
    content,
    images = [],
    tags = [],
    visibility,
    like_count = 0,
    is_liked = false,
    is_bookmarked = false,
    created_at
  } = post;

  const typeMeta = TYPE_CONFIG[post_type] || TYPE_CONFIG.project_showcase;
  const TypeIcon = typeMeta.icon;

  const formatContent = (text) => {
    let html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-slate-900 text-slate-100 p-3 rounded-xl my-2 text-xs font-mono overflow-x-auto">$1</pre>')
      .replace(/`([^`]+)`/g, '<code class="bg-slate-100 dark:bg-slate-800 text-primary-600 dark:text-primary-400 px-1 py-0.5 rounded text-xs font-mono">$1</code>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary-600 underline font-medium">$1</a>')
      .replace(/\n/g, '<br />');

    return DOMPurify.sanitize(html);
  };

  return (
    <Card className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-2xl space-y-4">
      {/* Header: Author + Post Type Badge */}
      <div className="flex items-start justify-between gap-3">
        <PostAuthorInfo author={author} createdAt={created_at} postType={post_type} />

        <div className="flex items-center gap-2">
          {visibility === 'connections_only' && (
            <span
              className="p-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs"
              title="Visible to connections only"
            >
              <Lock className="w-3.5 h-3.5" />
            </span>
          )}
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${typeMeta.color}`}
          >
            <TypeIcon className="w-3 h-3" />
            <span>{typeMeta.label}</span>
          </span>
        </div>
      </div>

      {/* Title */}
      {title && (
        <Link to={ROUTES.POST_DETAIL(id)}>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            {title}
          </h3>
        </Link>
      )}

      {/* Content */}
      <div
        className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-2 break-words"
        dangerouslySetInnerHTML={{ __html: formatContent(content) }}
      />

      {/* Images Gallery */}
      <PostImages images={images} />

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-primary-600 cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <PostActions
        postId={id}
        initialLiked={is_liked}
        likeCount={like_count}
        commentCount={commentCount}
        initialBookmarked={is_bookmarked}
        onCommentClick={() => setShowComments(!showComments)}
      />

      {/* Expandable Comments Section */}
      {showComments && (
        <PostComments
          postId={id}
          initialCount={commentCount}
        />
      )}
    </Card>
  );
}
