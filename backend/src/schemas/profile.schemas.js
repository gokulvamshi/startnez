const { z } = require('zod');
const { USER_YEARS, SKILL_PROFICIENCIES, LOOKING_FOR_OPTIONS } = require('../utils/constants');

const onboardingStep1Schema = z.object({
  full_name: z.string().trim().min(2, 'Full name must be at least 2 characters').max(50, 'Full name cannot exceed 50 characters'),
  college: z.string().trim().min(2, 'College/University name must be at least 2 characters').max(100, 'College name cannot exceed 100 characters'),
  year_of_study: z.enum(USER_YEARS, { errorMap: () => ({ message: 'Please select a valid year of study' }) }),
  city: z.string().trim().max(50, 'City cannot exceed 50 characters').optional().nullable(),
  avatar_url: z.string().url('Avatar must be a valid URL').optional().nullable()
});

const skillItemSchema = z.preprocess((val) => {
  if (typeof val === 'string') {
    return { skill_name: val.trim(), proficiency: 'Intermediate', is_primary: false, display_order: 0 };
  }
  if (val && typeof val === 'object') {
    return {
      skill_name: (val.skill_name || val.name || '').trim(),
      proficiency: val.proficiency || 'Intermediate',
      is_primary: !!val.is_primary,
      display_order: typeof val.display_order === 'number' ? val.display_order : 0
    };
  }
  return val;
}, z.object({
  skill_name: z.string().trim().min(1, 'Skill name is required').max(50, 'Skill name cannot exceed 50 characters'),
  proficiency: z.enum(SKILL_PROFICIENCIES).default('Beginner'),
  is_primary: z.boolean().default(false),
  display_order: z.number().int().default(0)
}));

const onboardingStep2Schema = z.object({
  skills: z.array(skillItemSchema).min(1, 'Please select at least 1 skill').max(10, 'You can select up to 10 skills')
});

const onboardingStep3Schema = z.object({
  looking_for: z.array(z.string()).min(1, 'Select at least 1 option of what you are looking for'),
  interests: z.array(z.string()).default([])
});

const onboardingStep4Schema = z.object({
  proficiencies: z.array(
    z.object({
      skill_name: z.string().trim().min(1),
      proficiency: z.enum(SKILL_PROFICIENCIES)
    })
  ).min(1, 'At least one skill proficiency required')
});

const urlPattern = z.string().trim().transform((val) => {
  if (!val || val === '') return null;
  return val;
}).refine((val) => {
  if (!val) return true;
  if (val.startsWith('blob:') || val.startsWith('data:')) return true;
  try {
    const toTest = val.startsWith('http://') || val.startsWith('https://') ? val : `https://${val}`;
    new URL(toTest);
    return true;
  } catch {
    return false;
  }
}, { message: 'Must be a valid URL' }).optional().nullable();

const onboardingStep5Schema = z.object({
  bio: z.string().trim().min(10, 'Bio must be at least 10 characters').max(500, 'Bio cannot exceed 500 characters'),
  github_url: urlPattern,
  portfolio_url: urlPattern,
  twitter_url: urlPattern,
  linkedin_url: urlPattern,
  website_url: urlPattern
});

const completeOnboardingSchema = z.object({
  full_name: z.string().trim().min(2, 'Full name must be at least 2 characters').max(50),
  college: z.string().trim().min(2, 'College is required').max(100),
  year_of_study: z.enum(USER_YEARS),
  city: z.string().trim().max(50).optional().nullable(),
  avatar_url: urlPattern,
  cover_image_url: urlPattern,
  bio: z.string().trim().min(10, 'Bio must be at least 10 characters').max(500),
  looking_for: z.array(z.string()).min(1, 'Select at least 1 item in Looking For'),
  interests: z.array(z.string()).default([]),
  skills: z.array(skillItemSchema).min(1, 'Select at least 1 skill').max(10),
  github_url: urlPattern,
  portfolio_url: urlPattern,
  twitter_url: urlPattern,
  linkedin_url: urlPattern,
  website_url: urlPattern
});

const updateProfileSchema = z.object({
  full_name: z.string().trim().min(2).max(50).optional(),
  college: z.string().trim().min(2).max(100).optional(),
  year_of_study: z.enum(USER_YEARS).optional(),
  city: z.string().trim().max(50).optional().nullable(),
  avatar_url: urlPattern,
  cover_image_url: urlPattern,
  bio: z.string().trim().max(500).optional(),
  looking_for: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  github_url: urlPattern,
  portfolio_url: urlPattern,
  twitter_url: urlPattern,
  linkedin_url: urlPattern,
  website_url: urlPattern
});

const connectionRequestSchema = z.object({
  receiver_id: z.string().uuid('Invalid receiver user ID')
});

const updateConnectionSchema = z.object({
  status: z.enum(['accepted', 'rejected'])
});

module.exports = {
  onboardingStep1Schema,
  onboardingStep2Schema,
  onboardingStep3Schema,
  onboardingStep4Schema,
  onboardingStep5Schema,
  completeOnboardingSchema,
  updateProfileSchema,
  connectionRequestSchema,
  updateConnectionSchema,
  skillItemSchema
};
