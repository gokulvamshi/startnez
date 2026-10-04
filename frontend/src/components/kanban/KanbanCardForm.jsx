import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createKanbanCardSchema } from '../../schemas/kanbanSchemas';
import { KANBAN_STATUSES, KANBAN_PRIORITIES } from '../../config/skills';
import Input from '../shared/Input';
import Textarea from '../shared/Textarea';
import Select from '../shared/Select';
import Button from '../shared/Button';

export default function KanbanCardForm({
  initialData = null,
  initialStatus = 'todo',
  members = [],
  onSubmit,
  onCancel,
  isLoading = false
}) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(createKanbanCardSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      status: initialData?.status || initialStatus || 'todo',
      priority: initialData?.priority ?? 1,
      assigned_to: initialData?.assigned_to?.id || initialData?.assigned_to || ''
    }
  });

  const memberOptions = [
    { value: '', label: 'Unassigned' },
    ...members.map((m) => ({ value: m.id, label: m.full_name }))
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Task Title"
        placeholder="e.g. Implement Supabase Realtime subscriptions"
        error={errors.title?.message}
        {...register('title')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Select
          label="Column Status"
          options={KANBAN_STATUSES.map((s) => ({ value: s.value, label: s.label }))}
          error={errors.status?.message}
          {...register('status')}
        />

        <Select
          label="Priority Level"
          options={KANBAN_PRIORITIES.map((p) => ({ value: p.value, label: p.label }))}
          error={errors.priority?.message}
          {...register('priority', { valueAsNumber: true })}
        />
      </div>

      <Select
        label="Assign Teammate"
        options={memberOptions}
        error={errors.assigned_to?.message}
        {...register('assigned_to')}
      />

      <Textarea
        label="Description / Acceptance Criteria (Optional)"
        placeholder="Specific requirements, endpoints, Figma component references, etc."
        rows={3}
        error={errors.description?.message}
        {...register('description')}
      />

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
          {initialData ? 'Update Card' : 'Add Card'}
        </Button>
      </div>
    </form>
  );
}
