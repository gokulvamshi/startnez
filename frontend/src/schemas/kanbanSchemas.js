import { z } from 'zod';

export const kanbanCardSchema = z.object({
  title: z.string().trim().min(1, 'Task title is required').max(200),
  description: z.string().trim().max(2000).optional().or(z.literal('')),
  status: z.enum(['todo', 'in_progress', 'review', 'done']).default('todo'),
  priority: z.coerce.number().int().min(0).max(3).default(0),
  assigned_to: z.string().optional().or(z.literal(''))
});

export const createKanbanCardSchema = kanbanCardSchema;
export const updateKanbanCardSchema = kanbanCardSchema;
