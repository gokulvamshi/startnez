import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { postService } from '../services/postService';
import PostCard from '../components/feed/PostCard';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import SEOHead from '../components/shared/SEOHead';
import { ROUTES } from '../config/routes';

export default function PostDetailPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const res = await postService.getPost(postId);
        setPost(res?.data || res);
      } catch (err) {
        console.error('Failed to load post detail:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) fetchPost();
  }, [postId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-16 space-y-3">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Post Not Found</h2>
        <Link to={ROUTES.FEED} className="text-primary-600 font-semibold hover:underline text-sm">
          Return to Feed
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 py-4">
      <SEOHead title={`${post.title || 'Engineering Showcase'} — HackConnect`} />
      
      <Link
        to={ROUTES.FEED}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Feed</span>
      </Link>

      <PostCard post={post} />
    </div>
  );
}
