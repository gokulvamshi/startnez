const { z } = require('zod');
const { PROJECT_TYPES, PROJECT_ROLES } = require('../utils/constants');

const createProjectSchema = z.object({
  name: z.string().trim().min(2, 'Project name must be at least 2 characters').max(100, 'Project name cannot exceed 100 characters'),
  description: z.string().trim().min(10, 'Description must be at least 10 characters').max(1000, 'Description cannot exceed 1000 characters'),
  hackathon_name: z.string().trim().max(100).optional().nullable(),
  deadline: z.string().datetime().optional().nullable().or(z.string().optional().nullable()),
  project_type: z.enum(PROJECT_TYPES).default('hackathon'),
  member_ids: z.array(z.string().uuid('Invalid user UUID')).default([])
});

const updateProjectSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  description: z.string().trim().min(10).max(1000).optional(),
  hackathon_name: z.string().trim().max(100).optional().nullable(),
  deadline: z.string().datetime().optional().nullable().or(z.string().optional().nullable()),
  project_type: z.enum(PROJECT_TYPES).optional(),
  is_active: z.boolean().optional()
});

const addProjectMemberSchema = z.object({
  user_id: z.string().uuid('Invalid member user ID'),
  role: z.enum(PROJECT_ROLES).default('member')
});

const updateProjectMemberRoleSchema = z.object({
  role: z.enum(PROJECT_ROLES)
});

const createLinkSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  url: z.string().url('Must be a valid URL'),
  description: z.string().trim().max(500).optional().nullable()
});

const updateLinkSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  url: z.string().url().optional(),
  description: z.string().trim().max(500).optional().nullable()
});

const createNoteSchema = z.object({
  title: z.string().trim().min(1).max(200).default('Untitled Note'),
  content: z.string().default('')
});

const updateNoteSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  content: z.string().optional()
});

const sendMessageSchema = z.object({
  content: z.string().trim().min(1, 'Message cannot be empty').max(2000, 'Message cannot exceed 2000 characters'),
  message_type: z.enum(['text', 'file', 'system']).default('text'),
  file_url: z.string().url().optional().nullable()
});

module.exports = {
  createProjectSchema,
  updateProjectSchema,
  addProjectMemberSchema,
  updateProjectMemberRoleSchema,
  createLinkSchema,
  updateLinkSchema,
  createNoteSchema,
  updateNoteSchema,
  sendMessageSchema
};
