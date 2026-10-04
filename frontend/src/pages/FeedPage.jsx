import React from 'react';
import PostFeed from '../components/feed/PostFeed';
import SEOHead from '../components/shared/SEOHead';

export default function FeedPage() {
  return (
    <div className="space-y-6">
      <SEOHead
        title="Engineering Showcase Feed — HackConnect"
        description="Read hackathon retrospectives, open-source project demos, and student learnings."
      />
      <PostFeed />
    </div>
  );
}
