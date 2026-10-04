const { z } = require('zod');

const kanbanStatuses = ['todo', 'in_progress', 'review', 'done'];

const createKanbanCardSchema = z.object({
  title: z.string().trim().min(1, 'Card title is required').max(200, 'Title cannot exceed 200 characters'),
  description: z.string().trim().max(2000, 'Description cannot exceed 2000 characters').optional().nullable(),
  status: z.enum(kanbanStatuses).default('todo'),
  priority: z.number().int().min(0).max(3).default(0),
  assigned_to: z.string().uuid('Invalid assigned user UUID').optional().nullable(),
  display_order: z.number().int().default(0)
});

const updateKanbanCardSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().max(2000).optional().nullable(),
  status: z.enum(kanbanStatuses).optional(),
  priority: z.number().int().min(0).max(3).optional(),
  assigned_to: z.string().uuid().optional().nullable(),
  display_order: z.number().int().optional()
});

const moveKanbanCardSchema = z.object({
  status: z.enum(kanbanStatuses),
  display_order: z.number().int().default(0)
});

module.exports = {
  createKanbanCardSchema,
  updateKanbanCardSchema,
  moveKanbanCardSchema,
  kanbanStatuses
};
