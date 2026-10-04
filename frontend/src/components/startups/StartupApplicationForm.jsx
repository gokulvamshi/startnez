import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, CheckCircle2, UserPlus } from 'lucide-react';
import { applyToStartupSchema } from '../../schemas/startupSchemas';
import { startupService } from '../../services/startupService';
import Select from '../shared/Select';
import Textarea from '../shared/Textarea';
import Button from '../shared/Button';

export default function StartupApplicationForm({
  startupId,
  rolesNeeded = [],
  onSuccess,
  onCancel
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(applyToStartupSchema),
    defaultValues: {
      role_applied_for: rolesNeeded[0] || 'Technical Co-founder',
      message: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      await startupService.applyToStartup(startupId, data);
      setIsSuccess(true);
      onSuccess?.();
    } catch (err) {
      setError(err?.message || 'Failed to submit application. You may have already applied.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-6 space-y-4">
        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white">Application Sent!</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          The founder will review your profile and pitch. You'll receive a notification when they respond.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="mb-2">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-primary-500" />
          <span>Apply to Join Team</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Tell the founder why you're excited about this problem space and what you'll build together.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 text-xs text-red-600">
          {error}
        </div>
      )}

      {rolesNeeded.length > 0 ? (
        <Select
          label="Role Applying For"
          options={rolesNeeded.map((r) => ({ value: r, label: r }))}
          error={errors.role_applied_for?.message}
          {...register('role_applied_for')}
        />
      ) : (
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Role Applying For
          </label>
          <input
            type="text"
            placeholder="e.g. Lead Frontend Engineer"
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            {...register('role_applied_for')}
          />
        </div>
      )}

      <Textarea
        label="Pitch Message (Max 500 chars)"
        placeholder="Share relevant past projects, hackathon wins, or why this vision resonates with you..."
        rows={4}
        error={errors.message?.message}
        {...register('message')}
      />

      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          size="sm"
          isLoading={isLoading}
        >
          <Send className="w-3.5 h-3.5 mr-1.5" />
          <span>Submit Application</span>
        </Button>
      </div>
    </form>
  );
}
