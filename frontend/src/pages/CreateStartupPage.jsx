import React from 'react';
import CreateStartupForm from '../components/startups/CreateStartupForm';
import SEOHead from '../components/shared/SEOHead';

export default function CreateStartupPage() {
  return (
    <div className="py-6">
      <SEOHead title="Propose Venture — HackConnect" />
      <CreateStartupForm />
    </div>
  );
}
