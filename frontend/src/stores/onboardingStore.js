import { create } from 'zustand';

const initialFormData = {
  // Step 1
  full_name: '',
  college: '',
  year_of_study: '1st Year',
  city: '',
  avatar_url: '',
  // Step 2 & 4
  skills: [
    { skill_name: 'Frontend', proficiency: 'Intermediate', is_primary: true, display_order: 1 },
    { skill_name: 'UI/UX Design', proficiency: 'Beginner', is_primary: true, display_order: 2 }
  ],
  // Step 3
  looking_for: ['Hackathon Teammates', 'Startup Co-founders'],
  interests: ['Web Development', 'AI/ML', 'Design Systems'],
  // Step 5
  bio: '',
  github_url: '',
  portfolio_url: '',
  twitter_url: '',
  linkedin_url: '',
  website_url: ''
};

export const useOnboardingStore = create((set) => ({
  currentStep: 1,
  formData: initialFormData,
  // Aliases for compatibility with components expecting { data, updateData }
  data: initialFormData,

  setStep: (step) => set({ currentStep: Math.min(5, Math.max(1, step)) }),

  nextStep: () => set((state) => ({ currentStep: Math.min(5, state.currentStep + 1) })),

  prevStep: () => set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),

  updateFormData: (newData) =>
    set((state) => {
      const merged = { ...state.formData, ...newData };
      return { formData: merged, data: merged };
    }),

  updateData: (newData) =>
    set((state) => {
      const merged = { ...(state.data || state.formData), ...newData };
      return { formData: merged, data: merged };
    }),

  reset: () => set({ currentStep: 1, formData: initialFormData, data: initialFormData })
}));
