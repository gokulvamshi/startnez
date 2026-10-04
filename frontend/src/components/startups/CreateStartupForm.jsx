import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Rocket, Globe, Sparkles, Plus, X } from 'lucide-react';
import { createStartupSchema } from '../../schemas/startupSchemas';
import { startupService } from '../../services/startupService';
import { STARTUP_STAGES, SKILL_CATEGORIES, PREDEFINED_SKILLS } from '../../config/skills';
import Input from '../shared/Input';
import Textarea from '../shared/Textarea';
import Select from '../shared/Select';
import Button from '../shared/Button';
import Card from '../shared/Card';
import { ROUTES } from '../../config/routes';

export default function CreateStartupForm() {
  const navigate = useNavigate();
  const [techStack, setTechStack] = useState(['React', 'TypeScript', 'Node.js']);
  const [customTech, setCustomTech] = useState('');
  const [rolesNeeded, setRolesNeeded] = useState(['Backend', 'UI/UX Design']);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const flatSkills = Object.values(PREDEFINED_SKILLS).flat();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(createStartupSchema),
    defaultValues: {
      name: '',
      one_liner: '',
      problem_statement: '',
      solution: '',
      description: '',
      stage: 'idea',
      website_url: ''
    }
  });

  const addTech = (e) => {
    e?.preventDefault();
    const clean = customTech.trim();
    if (clean && !techStack.includes(clean)) {
      setTechStack([...techStack, clean]);
      setCustomTech('');
    }
  };

  const removeTech = (item) => {
    setTechStack(techStack.filter((t) => t !== item));
  };

  const toggleRole = (role) => {
    if (rolesNeeded.includes(role)) {
      if (rolesNeeded.length === 1) return;
      setRolesNeeded(rolesNeeded.filter((r) => r !== role));
    } else {
      setRolesNeeded([...rolesNeeded, role]);
    }
  };

  const onSubmit = async (formData) => {
    try {
      setIsLoading(true);
      setServerError(null);

      const payload = {
        name: formData.name,
        one_liner: formData.one_liner,
        problem_statement: formData.problem_statement,
        solution: formData.solution,
        description: formData.description || null,
        stage: formData.stage,
        tech_stack: techStack,
        roles_needed: rolesNeeded,
        website_url: formData.website_url || null
      };

      const res = await startupService.createStartup(payload);
      const created = res?.data || res;
      navigate(ROUTES.STARTUP_DETAIL(created.id));
    } catch (err) {
      setServerError(err?.message || 'Failed to publish startup proposal.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto p-6 sm:p-8 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md rounded-2xl">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-950/40 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Rocket className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Propose a Student Venture
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
          Share your long-term startup vision, recruit skilled co-founders, and build real traction.
        </p>
      </div>

      {serverError && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 text-sm text-red-600">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Startup Name"
            placeholder="e.g. Apex Health AI"
            error={errors.name?.message}
            {...register('name')}
          />

          <Select
            label="Current Venture Stage"
            options={STARTUP_STAGES.map((s) => ({ value: s.value, label: s.label }))}
            error={errors.stage?.message}
            {...register('stage')}
          />
        </div>

        <Input
          label="One-liner Pitch (10-150 chars)"
          placeholder="e.g. Automated clinical trial matching engine powered by multimodal LLMs"
          error={errors.one_liner?.message}
          {...register('one_liner')}
        />

        <Textarea
          label="Problem Statement"
          placeholder="Describe the critical bottleneck or pain point your target users experience..."
          rows={3}
          error={errors.problem_statement?.message}
          {...register('problem_statement')}
        />

        <Textarea
          label="Proposed Solution & Architecture"
          placeholder="How does your tech stack or proprietary workflow solve this better than existing alternatives?"
          rows={4}
          error={errors.solution?.message}
          {...register('solution')}
        />

        {/* Roles Needed Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Open Co-Founder & Teammate Roles (Select at least 1)
          </label>
          <div className="flex flex-wrap gap-2">
            {SKILL_CATEGORIES.map((role) => {
              const active = rolesNeeded.includes(role);
              return (
                <button
                  type="button"
                  key={role}
                  onClick={() => toggleRole(role)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    active
                      ? 'border-primary-500 bg-primary-600 text-white shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  {role}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tech Stack Chips & Input */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Tech Stack Tags
          </label>
          <div className="flex flex-wrap gap-1.5 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              >
                <span>{tech}</span>
                <button
                  type="button"
                  onClick={() => removeTech(tech)}
                  className="text-slate-400 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <div className="flex items-center gap-1 ml-auto">
              <input
                type="text"
                placeholder="Add tech..."
                value={customTech}
                onChange={(e) => setCustomTech(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTech(e)}
                className="w-28 px-2 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              />
              <button
                type="button"
                onClick={addTech}
                className="p-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <Input
          label="Website or Prototype URL (Optional)"
          placeholder="https://apexhealth.ai"
          icon={<Globe className="w-4 h-4 text-slate-400" />}
          error={errors.website_url?.message}
          {...register('website_url')}
        />

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(ROUTES.STARTUPS)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
          >
            <Rocket className="w-4 h-4 mr-2" />
            <span>Publish Proposal</span>
          </Button>
        </div>
      </form>
    </Card>
  );
}
