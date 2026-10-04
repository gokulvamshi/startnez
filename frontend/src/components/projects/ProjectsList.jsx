import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FolderGit2, PlusCircle, Search } from 'lucide-react';
import { projectService } from '../../services/projectService';
import ProjectCard from './ProjectCard';
import SkeletonCard from '../shared/SkeletonCard';
import EmptyState from '../shared/EmptyState';
import Button from '../shared/Button';
import { ROUTES } from '../../config/routes';

export default function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const res = await projectService.getProjects();
      const list = res?.data || res || [];
      setProjects(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to load projects list:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.hackathon_name && p.hackathon_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 text-xs font-semibold mb-1">
            <FolderGit2 className="w-3.5 h-3.5 text-primary-500" />
            <span>Collaborative Workspaces</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Team Projects & Hackathons
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real-time environments with Kanban boards, files, shared links, notes, and team chat.
          </p>
        </div>

        <Link to={ROUTES.CREATE_PROJECT}>
          <Button variant="primary" size="md">
            <PlusCircle className="w-4 h-4 mr-2" />
            <span>Start a Project</span>
          </Button>
        </Link>
      </div>

      {/* Search Input */}
      {projects.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects or hackathons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 shadow-sm"
          />
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No Project Workspaces Yet"
          description="Create your first hackathon workspace to organize tasks, chat in real-time, and store resources with teammates."
          actionText="Start a Project"
          onAction={() => {}}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
