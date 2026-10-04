import React, { useState, useEffect } from 'react';
import { postService } from '../../services/postService';
import PostCard from '../feed/PostCard';
import LoadingSpinner from '../shared/LoadingSpinner';
import EmptyState from '../shared/EmptyState';

export default function ProfilePostsList({ userId }) {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        setIsLoading(true);
        const res = await postService.getUserPosts(userId);
        const list = res?.data || res || [];
        setPosts(Array.isArray(list) ? list : (list.posts || []));
      } catch (err) {
        console.error('Failed to load user posts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) fetchUserPosts();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        title="No Posts Yet"
        description="This builder hasn't published any hackathon showcases or articles."
      />
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
