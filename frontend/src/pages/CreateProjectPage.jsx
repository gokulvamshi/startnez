import React from 'react';
import CreateProjectForm from '../components/projects/CreateProjectForm';
import SEOHead from '../components/shared/SEOHead';

export default function CreateProjectPage() {
  return (
    <div className="py-6">
      <SEOHead title="Start Project Workspace — HackConnect" />
      <CreateProjectForm />
    </div>
  );
}
