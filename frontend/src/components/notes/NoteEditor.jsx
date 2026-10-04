import React, { useState } from 'react';
import Input from '../shared/Input';
import Textarea from '../shared/Textarea';
import Button from '../shared/Button';

export default function NoteEditor({
  initialData = null,
  onSave,
  onCancel,
  isLoading = false
}) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title: title.trim() || 'Untitled Note', content });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Note Title"
        placeholder="e.g. Architecture Decisions & API Endpoints"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Textarea
        label="Note Content"
        placeholder="Brainstorm architecture, write meeting notes, draft user stories, track submission links..."
        rows={8}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
          Save Note
        </Button>
      </div>
    </form>
  );
}
