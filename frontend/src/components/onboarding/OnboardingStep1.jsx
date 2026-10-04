import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, School, Calendar, MapPin, Upload, Camera } from 'lucide-react';
import { onboardingStep1Schema } from '../../schemas/profileSchemas';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { UNIVERSITIES, YEAR_OPTIONS } from '../../config/skills';
import Input from '../shared/Input';
import Select from '../shared/Select';
import Button from '../shared/Button';
import Avatar from '../shared/Avatar';

export default function OnboardingStep1({ onNext }) {
  const { data, updateData } = useOnboardingStore();
  const [avatarPreview, setAvatarPreview] = useState(data.avatar_url || '');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(onboardingStep1Schema),
    defaultValues: {
      full_name: data.full_name || '',
      college: data.college || '',
      year_of_study: data.year_of_study || '2nd Year',
      city: data.city || ''
    }
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
      updateData({ avatar_url: url });
    }
  };

  const onSubmit = (formData) => {
    updateData({ ...formData, avatar_url: avatarPreview });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Your Campus Identity</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Tell fellow hackathon builders who you are and where you study.
        </p>
      </div>

      {/* Avatar Upload */}
      <div className="flex flex-col items-center justify-center">
        <div className="relative group cursor-pointer">
          <Avatar
            src={avatarPreview}
            name={data.full_name || 'HC'}
            size="2xl"
            className="ring-4 ring-slate-100 dark:ring-slate-800 shadow-md"
          />
          <label className="absolute inset-0 bg-black/40 rounded-2xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <Camera className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-semibold">Upload</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </label>
        </div>
        <span className="text-[11px] text-slate-400 mt-2">Recommended: Square format, max 5MB</span>
      </div>

      <div className="space-y-4">
        <Input
          label="Full Name"
          placeholder="e.g. Liam Patel"
          icon={<User className="w-4 h-4 text-slate-400" />}
          error={errors.full_name?.message}
          {...register('full_name')}
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            College / University
          </label>
          <div className="relative">
            <School className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              list="universities-list"
              placeholder="e.g. Stanford University"
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              {...register('college')}
            />
            <datalist id="universities-list">
              {UNIVERSITIES.map((u) => (
                <option key={u} value={u} />
              ))}
            </datalist>
          </div>
          {errors.college && <p className="text-xs text-red-500">{errors.college.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Year of Study"
            options={YEAR_OPTIONS.map((y) => ({ value: y, label: y }))}
            error={errors.year_of_study?.message}
            {...register('year_of_study')}
          />

          <Input
            label="City / Location"
            placeholder="e.g. San Francisco, CA"
            icon={<MapPin className="w-4 h-4 text-slate-400" />}
            error={errors.city?.message}
            {...register('city')}
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto">
          Next: Choose Skills
        </Button>
      </div>
    </form>
  );
}
