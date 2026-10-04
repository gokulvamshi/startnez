import { z } from 'zod';

export const createPostSchema = z.object({
  post_type: z.string().default('hackathon_experience'),
  title: z.string().trim().max(100, 'Title cannot exceed 100 characters').optional().or(z.literal('')),
  content: z.string().trim().min(10, 'Content must be at least 10 characters').max(5000, 'Content cannot exceed 5000 characters'),
  tags: z.array(z.string()).default([]),
  images: z.array(z.string().url()).max(4).default([]),
  visibility: z.enum(['public', 'connections_only']).default('public')
});

export const commentSchema = z.object({
  content: z.string().trim().min(1, 'Comment cannot be empty').max(1000, 'Max 1000 characters')
});
