const { z } = require('zod');
const { POST_CATEGORIES } = require('../utils/constants');

const createPostSchema = z.object({
  post_type: z.enum(POST_CATEGORIES).default('hackathon_experience'),
  title: z.string().trim().max(100, 'Title cannot exceed 100 characters').optional().nullable(),
  content: z.string().trim().min(10, 'Content must be at least 10 characters').max(5000, 'Content cannot exceed 5000 characters'),
  images: z.array(z.string().url('Invalid image URL')).max(4, 'Maximum 4 images allowed').default([]),
  tags: z.array(z.string().trim()).default([]),
  visibility: z.enum(['public', 'connections_only']).default('public')
});

const updatePostSchema = z.object({
  post_type: z.enum(POST_CATEGORIES).optional(),
  title: z.string().trim().max(100).optional().nullable(),
  content: z.string().trim().min(10).max(5000).optional(),
  images: z.array(z.string().url()).max(4).optional(),
  tags: z.array(z.string().trim()).optional(),
  visibility: z.enum(['public', 'connections_only']).optional()
});

const createCommentSchema = z.object({
  content: z.string().trim().min(1, 'Comment cannot be empty').max(1000, 'Comment cannot exceed 1000 characters'),
  parent_comment_id: z.string().uuid('Invalid parent comment ID').optional().nullable()
});

const updateCommentSchema = z.object({
  content: z.string().trim().min(1, 'Comment cannot be empty').max(1000, 'Comment cannot exceed 1000 characters')
});

module.exports = {
  createPostSchema,
  updatePostSchema,
  createCommentSchema,
  updateCommentSchema
};
