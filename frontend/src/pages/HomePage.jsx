import React from 'react';
import DiscoveryFeed from '../components/discovery/DiscoveryFeed';
import SEOHead from '../components/shared/SEOHead';

export default function HomePage() {
  return (
    <div className="space-y-6">
      <SEOHead
        title="Discover Teammates — HackConnect"
        description="Discover complementary student builders for hackathons, side projects, and startup co-founder roles."
      />
      <DiscoveryFeed />
    </div>
  );
}
