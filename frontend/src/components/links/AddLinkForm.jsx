import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createLinkSchema } from '../../schemas/projectSchemas';
import Input from '../shared/Input';
import Textarea from '../shared/Textarea';
import Button from '../shared/Button';

export default function AddLinkForm({ onSubmit, onCancel, isLoading = false }) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(createLinkSchema),
    defaultValues: { title: '', url: '', description: '' }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Resource Title"
        placeholder="e.g. Figma Design System / API Documentation"
        error={errors.title?.message}
        {...register('title')}
      />

      <Input
        label="URL Address"
        placeholder="https://figma.com/..."
        error={errors.url?.message}
        {...register('url')}
      />

      <Textarea
        label="Description (Optional)"
        placeholder="Brief note about why this resource is useful..."
        rows={2}
        error={errors.description?.message}
        {...register('description')}
      />

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
          Save Link
        </Button>
      </div>
    </form>
  );
}
