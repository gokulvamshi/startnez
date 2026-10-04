import React, { useState } from 'react';
import { Heart, MessageSquare, Bookmark, Share2, Check } from 'lucide-react';
import { postService } from '../../services/postService';

export default function PostActions({
  postId,
  initialLiked = false,
  likeCount = 0,
  commentCount = 0,
  initialBookmarked = false,
  onCommentClick
}) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(likeCount);
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [copied, setCopied] = useState(false);

  const handleLike = async () => {
    const nextState = !isLiked;
    setIsLiked(nextState);
    setLikes((prev) => (nextState ? prev + 1 : Math.max(prev - 1, 0)));

    try {
      await postService.toggleLike(postId);
    } catch (err) {
      // Revert on error
      setIsLiked(!nextState);
      setLikes((prev) => (!nextState ? prev + 1 : Math.max(prev - 1, 0)));
    }
  };

  const handleBookmark = async () => {
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);

    try {
      await postService.toggleBookmark(postId);
    } catch (err) {
      setIsBookmarked(!nextState);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/feed/${postId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 text-slate-500 dark:text-slate-400">
      <div className="flex items-center gap-1 sm:gap-4">
        {/* Like */}
        <button
          type="button"
          onClick={handleLike}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
            isLiked
              ? 'text-red-500 bg-red-50 dark:bg-red-950/40'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-red-500'
          }`}
        >
          <Heart className={`w-4 h-4 transition-transform ${isLiked ? 'fill-current scale-110' : ''}`} />
          <span>{likes}</span>
        </button>

        {/* Comment */}
        <button
          type="button"
          onClick={onCommentClick}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary-600 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{commentCount}</span>
        </button>

        {/* Bookmark */}
        <button
          type="button"
          onClick={handleBookmark}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
            isBookmarked
              ? 'text-primary-600 bg-primary-50 dark:bg-primary-950/40'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary-600'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          <span className="hidden sm:inline">Save</span>
        </button>
      </div>

      {/* Share */}
      <button
        type="button"
        onClick={handleShare}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
        title="Copy Link to Post"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-emerald-500" />
            <span className="text-emerald-500">Copied!</span>
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </>
        )}
      </button>
    </div>
  );
}
