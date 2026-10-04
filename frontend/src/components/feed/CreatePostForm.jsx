import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Globe, Users, Send, Sparkles } from 'lucide-react';
import { createPostSchema } from '../../schemas/postSchemas';
import { postService } from '../../services/postService';
import { PREDEFINED_SKILLS } from '../../config/skills';
import PostTypeSelector from './PostTypeSelector';
import RichTextEditor from './RichTextEditor';
import ImageUploader from './ImageUploader';
import Input from '../shared/Input';
import Button from '../shared/Button';
import Card from '../shared/Card';

export default function CreatePostForm({ onPostCreated, onCancel }) {
  const [images, setImages] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const flatSkills = Object.values(PREDEFINED_SKILLS).flat();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      post_type: 'hackathon_experience',
      title: '',
      content: '',
      visibility: 'public',
      tags: []
    }
  });

  const postType = watch('post_type');
  const visibility = watch('visibility');

  const toggleTag = (tag) => {
    let next;
    if (selectedTags.includes(tag)) {
      next = selectedTags.filter((t) => t !== tag);
    } else {
      if (selectedTags.length >= 5) return;
      next = [...selectedTags, tag];
    }
    setSelectedTags(next);
    setValue('tags', next);
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setServerError(null);

      const payload = {
        post_type: data.post_type,
        title: data.title || null,
        content: data.content,
        images: images,
        tags: selectedTags,
        visibility: data.visibility
      };

      const res = await postService.createPost(payload);
      onPostCreated?.(res?.data || res);
    } catch (err) {
      setServerError(err?.message || 'Failed to create post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md rounded-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create a Post</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Share hackathon triumphs, project demos, learnings, or team requests.
          </p>
        </div>
      </div>

      {serverError && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-xs text-red-600 dark:text-red-400">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Post Type Selector */}
        <Controller
          name="post_type"
          control={control}
          render={({ field }) => (
            <PostTypeSelector
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        {/* Title */}
        <Input
          label="Title (Optional)"
          placeholder="e.g. How we built an AI voice agent in 36 hours at TreeHacks"
          error={errors.title?.message}
          {...register('title')}
        />

        {/* Rich Text Editor */}
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <RichTextEditor
              value={field.value}
              onChange={field.onChange}
              error={errors.content?.message}
            />
          )}
        />

        {/* Image Attachments */}
        <ImageUploader
          images={images}
          onChange={setImages}
          maxImages={4}
        />

        {/* Tags Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Topic & Skill Tags ({selectedTags.length}/5)
            </label>
            <span className="text-[11px] text-slate-400">Click to tag relevant technologies</span>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            {flatSkills.slice(0, 24).map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                    active
                      ? 'border-primary-500 bg-primary-600 text-white font-semibold'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  #{tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Visibility Radios */}
        <div className="flex items-center gap-4 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="public"
              checked={visibility === 'public'}
              onChange={() => setValue('visibility', 'public')}
              className="text-primary-600 focus:ring-primary-500"
            />
            <Globe className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Public (All Builders)
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="connections_only"
              checked={visibility === 'connections_only'}
              onChange={() => setValue('visibility', 'connections_only')}
              className="text-primary-600 focus:ring-primary-500"
            />
            <Users className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Connections Only
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
          >
            <Send className="w-4 h-4 mr-2" />
            <span>Publish Post</span>
          </Button>
        </div>
      </form>
    </Card>
  );
}
