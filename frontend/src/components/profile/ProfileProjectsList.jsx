import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FolderGit2, Users, Calendar, ArrowRight } from 'lucide-react';
import { projectService } from '../../services/projectService';
import Card from '../shared/Card';
import LoadingSpinner from '../shared/LoadingSpinner';
import EmptyState from '../shared/EmptyState';
import DateDisplay from '../shared/DateDisplay';
import { ROUTES } from '../../config/routes';

export default function ProfileProjectsList({ userId }) {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const res = await projectService.getProjects();
        const list = res?.data || res || [];
        setProjects(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error('Failed to load projects:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <EmptyState
        title="No Project Workspaces"
        description="This builder is not currently part of any active hackathon project workspaces."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {projects.map((project) => (
        <Card
          key={project.id}
          className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FolderGit2 className="w-4 h-4 text-primary-500" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                {project.name}
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
              {project.description}
            </p>
            {project.hackathon_name && (
              <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-900/50 mb-3">
                🏆 {project.hackathon_name}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>{project.member_count || 1} members</span>
            </span>
            <Link
              to={ROUTES.PROJECT_WORKSPACE(project.id)}
              className="inline-flex items-center gap-1 text-primary-600 dark:text-primary-400 font-semibold hover:underline"
            >
              <span>Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
}
