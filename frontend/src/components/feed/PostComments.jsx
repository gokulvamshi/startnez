import React, { useState, useEffect } from 'react';
import { postService } from '../../services/postService';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import LoadingSpinner from '../shared/LoadingSpinner';

export default function PostComments({ postId, initialCount = 0 }) {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    let mounted = true;
    const loadComments = async () => {
      try {
        setIsLoading(true);
        const res = await postService.getComments(postId);
        if (mounted) {
          const list = res?.data || res || [];
          setComments(Array.isArray(list) ? list : []);
        }
      } catch (err) {
        console.error('Failed to load comments:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadComments();
    return () => {
      mounted = false;
    };
  }, [postId]);

  const handleAddComment = async (content) => {
    try {
      setIsSubmitting(true);
      const res = await postService.createComment(postId, {
        content,
        parent_comment_id: replyingTo?.commentId || null
      });

      const newComment = res?.data || res;

      if (replyingTo) {
        // Add to nested replies of target parent
        setComments((prev) =>
          prev.map((c) =>
            c.id === replyingTo.commentId
              ? { ...c, replies: [...(c.replies || []), newComment] }
              : c
          )
        );
        setReplyingTo(null);
      } else {
        setComments((prev) => [...prev, newComment]);
      }
    } catch (err) {
      console.error('Failed to submit comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-4">
      <CommentForm
        onSubmit={handleAddComment}
        replyingTo={replyingTo}
        onCancelReply={() => setReplyingTo(null)}
        isLoading={isSubmitting}
      />

      {isLoading ? (
        <div className="flex justify-center py-4">
          <LoadingSpinner size="sm" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center py-2 text-xs text-slate-400 italic">
          No comments yet. Start the discussion!
        </p>
      ) : (
        <div className="space-y-1 divide-y divide-slate-100 dark:divide-slate-800/60">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={(id, authorName) => setReplyingTo({ commentId: id, authorName })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
