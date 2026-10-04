import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().trim().min(2, 'Project name must be at least 2 characters').max(100),
  description: z.string().trim().min(10, 'Description must be at least 10 characters').max(1000),
  hackathon_name: z.string().trim().max(100).optional().or(z.literal('')),
  deadline: z.string().optional().or(z.literal('')),
  project_type: z.string().default('hackathon'),
  member_ids: z.array(z.string()).default([])
});

export const addLinkSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  url: z.string().url('Please enter a valid URL'),
  description: z.string().trim().max(500).optional().or(z.literal(''))
});

export const noteSchema = z.object({
  title: z.string().trim().min(1, 'Note title is required').max(200),
  content: z.string().default('')
});

export const chatMessageSchema = z.object({
  content: z.string().trim().min(1, 'Message cannot be empty').max(2000)
});

export const createLinkSchema = addLinkSchema;
export const createNoteSchema = noteSchema;
export const updateNoteSchema = noteSchema;
export const sendMessageSchema = chatMessageSchema;
