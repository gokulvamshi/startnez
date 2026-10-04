import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FolderGit2,
  LayoutDashboard,
  Kanban,
  Files,
  MessageSquare,
  Link as LinkIcon,
  FileText,
  Trash2,
  Users
} from 'lucide-react';
import { projectService } from '../../services/projectService';
import { useAuthStore } from '../../stores/authStore';
import ProjectOverview from './ProjectOverview';
import KanbanBoard from '../kanban/KanbanBoard';
import FilesList from '../files/FilesList';
import ChatContainer from '../chat/ChatContainer';
import LinksList from '../links/LinksList';
import NotesList from '../notes/NotesList';
import LoadingSpinner from '../shared/LoadingSpinner';
import Card from '../shared/Card';
import { ROUTES } from '../../config/routes';

const WORKSPACE_TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'kanban', label: 'Ideas Board', icon: Kanban },
  { id: 'files', label: 'Files', icon: Files },
  { id: 'chat', label: 'Real-Time Chat', icon: MessageSquare },
  { id: 'links', label: 'Shared Links', icon: LinkIcon },
  { id: 'notes', label: 'Notes', icon: FileText }
];

export default function ProjectWorkspace() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchProjectDetails = async () => {
    try {
      setIsLoading(true);
      const res = await projectService.getProject(projectId);
      const data = res?.data || res;
      setProject(data);
    } catch (err) {
      console.error('Failed to load project workspace:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) fetchProjectDetails();
  }, [projectId]);

  const handleDeleteProject = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this project workspace?')) return;
    try {
      await projectService.deleteProject(projectId);
      navigate(ROUTES.PROJECTS);
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
          Project Workspace Not Found
        </h2>
        <button
          onClick={() => navigate(ROUTES.PROJECTS)}
          className="text-primary-600 font-semibold hover:underline text-sm"
        >
          Return to Projects
        </button>
      </div>
    );
  }

  const isCreator = project.creator_id === user?.id || project.creator?.id === user?.id || project.is_creator;

  return (
    <div className="space-y-6">
      {/* Workspace Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {project.name}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {project.hackathon_name ? `🏆 ${project.hackathon_name} • ` : ''}
              {project.members?.length || 1} team members collaborating
            </p>
          </div>
        </div>

        {isCreator && (
          <button
            type="button"
            onClick={handleDeleteProject}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 border border-red-200 dark:border-red-900/40 transition-colors w-fit"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Workspace</span>
          </button>
        )}
      </div>

      {/* Tab Navigation Pill Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 dark:border-slate-800">
        {WORKSPACE_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      <div>
        {activeTab === 'overview' && (
          <ProjectOverview
            project={project}
            isCreator={isCreator}
            onMembersUpdated={fetchProjectDetails}
          />
        )}

        {activeTab === 'kanban' && (
          <KanbanBoard
            projectId={project.id}
            members={project.members || []}
          />
        )}

        {activeTab === 'files' && (
          <FilesList projectId={project.id} />
        )}

        {activeTab === 'chat' && (
          <ChatContainer projectId={project.id} />
        )}

        {activeTab === 'links' && (
          <LinksList projectId={project.id} />
        )}

        {activeTab === 'notes' && (
          <NotesList projectId={project.id} />
        )}
      </div>
    </div>
  );
}
