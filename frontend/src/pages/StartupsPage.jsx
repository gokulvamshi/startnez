import React from 'react';
import StartupGrid from '../components/startups/StartupGrid';
import SEOHead from '../components/shared/SEOHead';

export default function StartupsPage() {
  return (
    <div className="space-y-6">
      <SEOHead
        title="Student Startup Proposals — HackConnect"
        description="Discover student-led startups and venture ideas recruiting technical & design co-founders."
      />
      <StartupGrid />
    </div>
  );
}
