import { z } from 'zod';
import { USER_YEARS, SKILL_PROFICIENCIES } from '../config/skills';

export const onboardingStep1Schema = z.object({
  full_name: z.string().trim().min(2, 'Full name must be at least 2 characters').max(50, 'Max 50 characters'),
  college: z.string().trim().min(2, 'College / University is required').max(100),
  year_of_study: z.enum(USER_YEARS, { errorMap: () => ({ message: 'Please select a valid year' }) }),
  city: z.string().trim().max(50).optional().or(z.literal('')),
  avatar_url: z.string().url('Invalid URL').optional().or(z.literal(''))
});

export const onboardingStep2Schema = z.object({
  skills: z.array(z.object({
    skill_name: z.string().trim().min(1),
    proficiency: z.enum(SKILL_PROFICIENCIES).default('Beginner'),
    is_primary: z.boolean().default(false),
    display_order: z.number().default(0)
  })).min(1, 'Please select at least 1 skill').max(10, 'Maximum 10 skills allowed')
});

export const onboardingStep3Schema = z.object({
  looking_for: z.array(z.string()).min(1, 'Select at least 1 goal in Looking For'),
  interests: z.array(z.string()).default([])
});

const urlPattern = z.string().url('Must be a valid URL').optional().or(z.literal(''));

export const onboardingStep5Schema = z.object({
  bio: z.string().trim().min(10, 'Bio must be at least 10 characters').max(500, 'Bio cannot exceed 500 characters'),
  github_url: urlPattern,
  portfolio_url: urlPattern,
  twitter_url: urlPattern,
  linkedin_url: urlPattern,
  website_url: urlPattern
});

export const editProfileSchema = z.object({
  full_name: z.string().trim().min(2, 'Full name must be at least 2 characters').max(50),
  college: z.string().trim().min(2, 'College is required').max(100),
  year_of_study: z.enum(USER_YEARS),
  city: z.string().trim().max(50).optional().or(z.literal('')),
  avatar_url: urlPattern,
  cover_image_url: urlPattern,
  bio: z.string().trim().min(10, 'Bio must be at least 10 characters').max(500),
  looking_for: z.array(z.string()).default([]),
  interests: z.array(z.string()).default([]),
  github_url: urlPattern,
  portfolio_url: urlPattern,
  twitter_url: urlPattern,
  linkedin_url: urlPattern,
  website_url: urlPattern
});

export const updateProfileSchema = editProfileSchema;
