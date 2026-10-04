import { z } from 'zod';

const urlPattern = z.string().url('Must be a valid URL').optional().or(z.literal(''));

export const createStartupSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  one_liner: z.string().trim().min(10, 'One-liner pitch must be at least 10 characters').max(150),
  problem_statement: z.string().trim().min(20, 'Problem statement must be at least 20 characters').max(1000),
  solution: z.string().trim().min(20, 'Solution must be at least 20 characters').max(2000),
  description: z.string().trim().max(5000).optional().or(z.literal('')),
  tech_stack: z.array(z.string()).default([]),
  roles_needed: z.array(z.string()).min(1, 'Please select at least 1 role needed'),
  stage: z.string().default('idea'),
  logo_url: urlPattern,
  website_url: urlPattern
});

export const applyStartupSchema = z.object({
  role_applied_for: z.string().trim().min(1, 'Please specify the role you are applying for'),
  message: z.string().trim().max(500).optional().or(z.literal(''))
});

export const applyToStartupSchema = applyStartupSchema;
