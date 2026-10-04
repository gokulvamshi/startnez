import React from 'react';
import ProjectWorkspace from '../components/projects/ProjectWorkspace';
import SEOHead from '../components/shared/SEOHead';

export default function ProjectWorkspacePage() {
  return (
    <div className="py-4">
      <SEOHead title="Project Workspace — HackConnect" />
      <ProjectWorkspace />
    </div>
  );
}
