const { z } = require('zod');
const { STARTUP_STAGES } = require('../utils/constants');

const urlPattern = z.string().url('Must be a valid URL').optional().nullable().or(z.literal(''));

const createStartupSchema = z.object({
  name: z.string().trim().min(2, 'Startup name must be at least 2 characters').max(100, 'Startup name cannot exceed 100 characters'),
  one_liner: z.string().trim().min(10, 'One-liner pitch must be at least 10 characters').max(150, 'One-liner cannot exceed 150 characters'),
  problem_statement: z.string().trim().min(20, 'Problem statement must be at least 20 characters').max(1000, 'Problem statement cannot exceed 1000 characters'),
  solution: z.string().trim().min(20, 'Solution must be at least 20 characters').max(2000, 'Solution cannot exceed 2000 characters'),
  description: z.string().trim().max(5000, 'Description cannot exceed 5000 characters').optional().nullable(),
  tech_stack: z.array(z.string().trim()).default([]),
  roles_needed: z.array(z.string().trim()).min(1, 'Please specify at least 1 role needed'),
  stage: z.enum(STARTUP_STAGES).default('idea'),
  logo_url: urlPattern,
  website_url: urlPattern
});

const updateStartupSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  one_liner: z.string().trim().min(10).max(150).optional(),
  problem_statement: z.string().trim().min(20).max(1000).optional(),
  solution: z.string().trim().min(20).max(2000).optional(),
  description: z.string().trim().max(5000).optional().nullable(),
  tech_stack: z.array(z.string().trim()).optional(),
  roles_needed: z.array(z.string().trim()).optional(),
  stage: z.enum(STARTUP_STAGES).optional(),
  logo_url: urlPattern,
  website_url: urlPattern,
  is_active: z.boolean().optional()
});

const applyToStartupSchema = z.object({
  message: z.string().trim().max(500, 'Application message cannot exceed 500 characters').optional().nullable(),
  role_applied_for: z.string().trim().min(1, 'Role applied for is required').optional().nullable()
});

const reviewApplicationSchema = z.object({
  status: z.enum(['accepted', 'rejected'])
});

module.exports = {
  createStartupSchema,
  updateStartupSchema,
  applyToStartupSchema,
  reviewApplicationSchema
};
