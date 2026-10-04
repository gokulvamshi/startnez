import React from 'react';
import ProjectsList from '../components/projects/ProjectsList';
import SEOHead from '../components/shared/SEOHead';

export default function ProjectsListPage() {
  return (
    <div className="space-y-6">
      <SEOHead
        title="Project Workspaces — HackConnect"
        description="Collaborative environments for your hackathons and software projects."
      />
      <ProjectsList />
    </div>
  );
}
