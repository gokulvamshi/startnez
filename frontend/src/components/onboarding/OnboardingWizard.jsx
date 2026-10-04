import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { useAuthStore } from '../../stores/authStore';
import { profileService } from '../../services/profileService';
import OnboardingProgress from './OnboardingProgress';
import OnboardingStep1 from './OnboardingStep1';
import OnboardingStep2 from './OnboardingStep2';
import OnboardingStep3 from './OnboardingStep3';
import OnboardingStep4 from './OnboardingStep4';
import OnboardingStep5 from './OnboardingStep5';
import Card from '../shared/Card';
import { ROUTES } from '../../config/routes';

export default function OnboardingWizard() {
  const navigate = useNavigate();
  const { currentStep, nextStep, prevStep, data, reset } = useOnboardingStore();
  const { fetchProfile } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleFinalSubmit = async (step5Data) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const formattedSkills = (data.skills || [])
        .map((s, idx) => {
          if (typeof s === 'string') {
            return {
              skill_name: s.trim(),
              proficiency: 'Intermediate',
              is_primary: idx < 3,
              display_order: idx + 1
            };
          }
          return {
            skill_name: (s.skill_name || s.name || '').trim(),
            proficiency: s.proficiency || 'Intermediate',
            is_primary: typeof s.is_primary === 'boolean' ? s.is_primary : idx < 3,
            display_order: typeof s.display_order === 'number' ? s.display_order : idx + 1
          };
        })
        .filter((s) => s.skill_name.length > 0);

      const payload = {
        full_name: data.full_name,
        college: data.college,
        year_of_study: data.year_of_study,
        city: data.city || null,
        avatar_url: data.avatar_url || null,
        skills: formattedSkills,
        looking_for: data.looking_for || [],
        interests: data.interests || [],
        bio: step5Data.bio || data.bio,
        github_url: step5Data.github_url || null,
        portfolio_url: step5Data.portfolio_url || null,
        twitter_url: step5Data.twitter_url || null,
        linkedin_url: step5Data.linkedin_url || null,
        website_url: step5Data.website_url || null
      };

      await profileService.completeOnboarding(payload);
      await fetchProfile();
      reset();
      navigate(ROUTES.HOME);
    } catch (err) {
      setSubmitError(err?.message || 'Failed to complete profile onboarding. Please check your data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4">
      <OnboardingProgress currentStep={currentStep} />

      {submitError && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-sm text-red-600 dark:text-red-400">
          {submitError}
        </div>
      )}

      <Card className="p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900 rounded-2xl">
        {currentStep === 1 && <OnboardingStep1 onNext={nextStep} />}
        {currentStep === 2 && <OnboardingStep2 onNext={nextStep} onPrev={prevStep} />}
        {currentStep === 3 && <OnboardingStep3 onNext={nextStep} onPrev={prevStep} />}
        {currentStep === 4 && <OnboardingStep4 onNext={nextStep} onPrev={prevStep} />}
        {currentStep === 5 && (
          <OnboardingStep5
            onPrev={prevStep}
            onSubmitFinal={handleFinalSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </Card>
    </div>
  );
}
