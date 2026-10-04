const { z } = require('zod');

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1, 'Page must be at least 1').default(1),
  limit: z.coerce.number().int().min(1, 'Limit must be at least 1').max(50, 'Limit cannot exceed 50').default(20),
  cursor: z.string().optional()
});

const searchSchema = z.object({
  query: z.string().trim().min(1, 'Search query cannot be empty'),
  type: z.enum(['all', 'people', 'posts', 'startups', 'projects']).default('all')
});

const uuidParamSchema = z.object({
  id: z.string().uuid('Invalid UUID format')
});

module.exports = {
  paginationSchema,
  searchSchema,
  uuidParamSchema
};
