import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { User, School, MapPin, Camera, Save, ArrowLeft, Github, Globe, Linkedin, Twitter } from 'lucide-react';
import { updateProfileSchema } from '../../schemas/profileSchemas';
import { profileService } from '../../services/profileService';
import { useAuthStore } from '../../stores/authStore';
import { YEAR_OPTIONS, UNIVERSITIES } from '../../config/skills';
import Input from '../shared/Input';
import Textarea from '../shared/Textarea';
import Select from '../shared/Select';
import Button from '../shared/Button';
import Avatar from '../shared/Avatar';
import Card from '../shared/Card';
import { ROUTES } from '../../config/routes';

export default function EditProfileForm() {
  const navigate = useNavigate();
  const { profile, fetchProfile } = useAuthStore();
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || '');
  const [coverPreview, setCoverPreview] = useState(profile?.cover_image_url || '');
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      college: profile?.college || '',
      year_of_study: profile?.year_of_study || '2nd Year',
      city: profile?.city || '',
      bio: profile?.bio || '',
      github_url: profile?.github_url || '',
      portfolio_url: profile?.portfolio_url || '',
      linkedin_url: profile?.linkedin_url || '',
      twitter_url: profile?.twitter_url || '',
      website_url: profile?.website_url || ''
    }
  });

  const handleAvatarFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const handleCoverFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCoverPreview(url);
    }
  };

  const onSubmit = async (formData) => {
    try {
      setIsLoading(true);
      setServerError(null);

      const payload = {
        ...formData,
        avatar_url: avatarPreview || null,
        cover_image_url: coverPreview || null
      };

      await profileService.updateProfile(payload);
      await fetchProfile();
      navigate(ROUTES.PROFILE(profile?.id || 'me'));
    } catch (err) {
      setServerError(err?.message || 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto p-6 sm:p-8 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl shadow-md space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Edit Your Profile</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Update your academic details, verified portfolios, and collaborative status.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          <span>Cancel</span>
        </Button>
      </div>

      {serverError && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 text-sm text-red-600">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Cover Photo & Avatar Picker */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Profile Imagery
          </label>
          <div className="h-36 rounded-2xl relative overflow-hidden bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 group">
            {coverPreview && (
              <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
            )}
            <label className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs font-semibold">
              <Camera className="w-4 h-4 mr-2" />
              <span>Change Cover Image</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleCoverFile} />
            </label>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <div className="relative group cursor-pointer">
              <Avatar
                src={avatarPreview}
                name={profile?.full_name || 'Builder'}
                size="xl"
                className="ring-4 ring-white dark:ring-slate-900 shadow-md"
              />
              <label className="absolute inset-0 bg-black/50 rounded-2xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-4 h-4" />
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarFile} />
              </label>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Avatar Photo</p>
              <p className="text-[11px] text-slate-400">Square JPG or PNG, max 5MB</p>
            </div>
          </div>
        </div>

        {/* Basic Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            icon={<User className="w-4 h-4 text-slate-400" />}
            error={errors.full_name?.message}
            {...register('full_name')}
          />

          <Select
            label="Year of Study"
            options={YEAR_OPTIONS.map((y) => ({ value: y, label: y }))}
            error={errors.year_of_study?.message}
            {...register('year_of_study')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="College / University"
            icon={<School className="w-4 h-4 text-slate-400" />}
            error={errors.college?.message}
            {...register('college')}
          />

          <Input
            label="City / Location"
            icon={<MapPin className="w-4 h-4 text-slate-400" />}
            error={errors.city?.message}
            {...register('city')}
          />
        </div>

        {/* Bio */}
        <Textarea
          label="Bio"
          placeholder="Share your technical interests, hackathons won, and what you want to build next..."
          rows={4}
          error={errors.bio?.message}
          {...register('bio')}
        />

        {/* Social / External Links */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Verified Links & Portfolios
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="GitHub URL"
              icon={<Github className="w-4 h-4 text-slate-400" />}
              error={errors.github_url?.message}
              {...register('github_url')}
            />

            <Input
              label="Portfolio URL"
              icon={<Globe className="w-4 h-4 text-slate-400" />}
              error={errors.portfolio_url?.message}
              {...register('portfolio_url')}
            />

            <Input
              label="LinkedIn URL"
              icon={<Linkedin className="w-4 h-4 text-slate-400" />}
              error={errors.linkedin_url?.message}
              {...register('linkedin_url')}
            />

            <Input
              label="Twitter / X URL"
              icon={<Twitter className="w-4 h-4 text-slate-400" />}
              error={errors.twitter_url?.message}
              {...register('twitter_url')}
            />
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
          >
            <Save className="w-4 h-4 mr-2" />
            <span>Save Profile</span>
          </Button>
        </div>
      </form>
    </Card>
  );
}
