import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Sparkles, Image, Code, MessageSquare } from 'lucide-react';
import { postService } from '../../services/postService';
import { useAuthStore } from '../../stores/authStore';
import PostCard from './PostCard';
import PostSortTabs from './PostSortTabs';
import CreatePostForm from './CreatePostForm';
import SkeletonCard from '../shared/SkeletonCard';
import EmptyState from '../shared/EmptyState';
import Button from '../shared/Button';
import Avatar from '../shared/Avatar';
import Card from '../shared/Card';
import { ROUTES } from '../../config/routes';

export default function PostFeed() {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [activeSort, setActiveSort] = useState('latest');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  const fetchPosts = async (sort = activeSort, pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) setIsLoading(true);
      else setIsFetchingMore(true);

      const res = await postService.getPosts({
        page: pageNum,
        limit: 10,
        sort: sort
      });

      const data = res?.data || res;
      const list = data?.posts || [];

      if (append) {
        setPosts((prev) => [...prev, ...list]);
      } else {
        setPosts(list);
      }

      setHasMore(data?.pagination?.has_more || false);
      setPage(pageNum);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts(activeSort, 1, false);
  }, [activeSort]);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
    setIsCreatingPost(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Quick Post Prompt Card */}
      {!isCreatingPost ? (
        <Card className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <Avatar
              src={user?.avatar_url}
              name={user?.full_name || 'Builder'}
              size="md"
            />
            <button
              type="button"
              onClick={() => setIsCreatingPost(true)}
              className="flex-1 text-left px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Share a project showcase, hackathon retrospective, or question...
            </button>
          </div>
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 font-medium">
            <button
              type="button"
              onClick={() => setIsCreatingPost(true)}
              className="flex items-center gap-1.5 hover:text-primary-600 transition-colors"
            >
              <Image className="w-4 h-4 text-emerald-500" />
              <span>Attach Media</span>
            </button>
            <button
              type="button"
              onClick={() => setIsCreatingPost(true)}
              className="flex items-center gap-1.5 hover:text-primary-600 transition-colors"
            >
              <Code className="w-4 h-4 text-sky-500" />
              <span>Code Snippet</span>
            </button>
            <button
              type="button"
              onClick={() => setIsCreatingPost(true)}
              className="flex items-center gap-1.5 text-primary-600 font-semibold"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Write Post</span>
            </button>
          </div>
        </Card>
      ) : (
        <CreatePostForm
          onPostCreated={handlePostCreated}
          onCancel={() => setIsCreatingPost(false)}
        />
      )}

      {/* Sort Filter Bar */}
      <div className="flex items-center justify-between">
        <PostSortTabs
          activeTab={activeSort}
          onChange={(sort) => {
            setActiveSort(sort);
            setPage(1);
          }}
        />
      </div>

      {/* Feed List */}
      {isLoading ? (
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : posts.length === 0 ? (
        <EmptyState
          title="No Posts in the Feed Yet"
          description="Be the first to share a hackathon story, open-source project, or engineering learning."
          actionText="Create First Post"
          onAction={() => setIsCreatingPost(true)}
        />
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}

          {hasMore && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                size="md"
                isLoading={isFetchingMore}
                onClick={() => fetchPosts(activeSort, page + 1, true)}
                className="px-6"
              >
                <span>Load More Posts</span>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
