import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Github, Globe, Twitter, Linkedin, ArrowLeft, Rocket } from 'lucide-react';
import { onboardingStep5Schema } from '../../schemas/profileSchemas';
import { useOnboardingStore } from '../../stores/onboardingStore';
import Textarea from '../shared/Textarea';
import Input from '../shared/Input';
import Button from '../shared/Button';

export default function OnboardingStep5({ onPrev, onSubmitFinal, isSubmitting }) {
  const { data, updateData } = useOnboardingStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(onboardingStep5Schema),
    defaultValues: {
      bio: data.bio || '',
      github_url: data.github_url || '',
      portfolio_url: data.portfolio_url || '',
      twitter_url: data.twitter_url || '',
      linkedin_url: data.linkedin_url || '',
      website_url: data.website_url || ''
    }
  });

  const bioValue = watch('bio') || '';

  const handleFormSubmit = (formData) => {
    updateData(formData);
    onSubmitFinal(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Bio & Verified Links</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Tell teammates about your passion projects, hackathons won, and where to find your code.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Textarea
            label="Short Bio"
            placeholder="e.g. CS junior passionate about building distributed systems and high-impact web apps. 2x hackathon winner looking for a killer UI/UX designer and ML hacker for CalHacks!"
            rows={4}
            error={errors.bio?.message}
            {...register('bio')}
          />
          <div className="flex justify-end mt-1">
            <span className="text-[11px] font-mono text-slate-400">
              {bioValue.length}/500 chars (min 10)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="GitHub Profile URL"
            placeholder="https://github.com/username"
            icon={<Github className="w-4 h-4 text-slate-400" />}
            error={errors.github_url?.message}
            {...register('github_url')}
          />

          <Input
            label="Portfolio Website"
            placeholder="https://yourname.dev"
            icon={<Globe className="w-4 h-4 text-slate-400" />}
            error={errors.portfolio_url?.message}
            {...register('portfolio_url')}
          />

          <Input
            label="LinkedIn URL"
            placeholder="https://linkedin.com/in/username"
            icon={<Linkedin className="w-4 h-4 text-slate-400" />}
            error={errors.linkedin_url?.message}
            {...register('linkedin_url')}
          />

          <Input
            label="Twitter / X"
            placeholder="https://x.com/username"
            icon={<Twitter className="w-4 h-4 text-slate-400" />}
            error={errors.twitter_url?.message}
            {...register('twitter_url')}
          />
        </div>
      </div>

      <div className="pt-4 flex items-center justify-between gap-4">
        <Button type="button" variant="outline" onClick={onPrev}>
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          <span>Back</span>
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
        >
          <Rocket className="w-4 h-4 mr-2" />
          <span>Launch Profile</span>
        </Button>
      </div>
    </form>
  );
}
