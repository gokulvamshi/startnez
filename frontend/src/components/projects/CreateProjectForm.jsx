import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { FolderGit2, Trophy, Calendar, PlusCircle } from 'lucide-react';
import { createProjectSchema } from '../../schemas/projectSchemas';
import { projectService } from '../../services/projectService';
import { PROJECT_TYPES } from '../../config/skills';
import Input from '../shared/Input';
import Textarea from '../shared/Textarea';
import Select from '../shared/Select';
import Button from '../shared/Button';
import Card from '../shared/Card';
import MemberSelector from './MemberSelector';
import { ROUTES } from '../../config/routes';

export default function CreateProjectForm() {
  const navigate = useNavigate();
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: '',
      description: '',
      hackathon_name: '',
      project_type: 'hackathon',
      deadline: ''
    }
  });

  const onSubmit = async (formData) => {
    try {
      setIsLoading(true);
      setServerError(null);

      const payload = {
        name: formData.name,
        description: formData.description,
        hackathon_name: formData.hackathon_name || null,
        project_type: formData.project_type,
        deadline: formData.deadline || null,
        member_ids: selectedMembers
      };

      const res = await projectService.createProject(payload);
      const created = res?.data || res;
      navigate(ROUTES.PROJECT_WORKSPACE(created.id));
    } catch (err) {
      setServerError(err?.message || 'Failed to initialize project workspace.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto p-6 sm:p-8 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md rounded-2xl">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-950/40 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <FolderGit2 className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Initialize Project Workspace
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
          Start a private collaboration hub with Kanban boards, file sharing, real-time chat, and collaborative notes.
        </p>
      </div>

      {serverError && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 text-sm text-red-600">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Project Workspace Name"
          placeholder="e.g. TreeHacks AI Diagnostics Platform"
          error={errors.name?.message}
          {...register('name')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Project Category"
            options={PROJECT_TYPES.map((t) => ({ value: t.value, label: t.label }))}
            error={errors.project_type?.message}
            {...register('project_type')}
          />

          <Input
            label="Hackathon Name (Optional)"
            placeholder="e.g. CalHacks 11.0"
            icon={<Trophy className="w-4 h-4 text-slate-400" />}
            error={errors.hackathon_name?.message}
            {...register('hackathon_name')}
          />
        </div>

        <Textarea
          label="Project Description & Goals"
          placeholder="Outline the core objective, hackathon track, and milestones for the team..."
          rows={3}
          error={errors.description?.message}
          {...register('description')}
        />

        <Input
          label="Submission Deadline (Optional)"
          type="datetime-local"
          icon={<Calendar className="w-4 h-4 text-slate-400" />}
          error={errors.deadline?.message}
          {...register('deadline')}
        />

        {/* Member Selector */}
        <MemberSelector
          selectedMemberIds={selectedMembers}
          onChange={setSelectedMembers}
        />

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(ROUTES.PROJECTS)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            <span>Launch Workspace</span>
          </Button>
        </div>
      </form>
    </Card>
  );
}
