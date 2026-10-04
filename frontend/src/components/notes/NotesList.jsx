import React, { useState, useEffect } from 'react';
import { Plus, FileText } from 'lucide-react';
import { projectService } from '../../services/projectService';
import NoteCard from './NoteCard';
import NoteEditor from './NoteEditor';
import Button from '../shared/Button';
import Modal from '../shared/Modal';
import LoadingSpinner from '../shared/LoadingSpinner';

export default function NotesList({ projectId }) {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingNote, setEditingNote] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const res = await projectService.getNotes(projectId);
      const list = res?.data || res || [];
      setNotes(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to load notes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [projectId]);

  const handleSave = async (formData) => {
    try {
      setIsSubmitting(true);
      if (editingNote) {
        const res = await projectService.updateNote(editingNote.id, formData);
        const updated = res?.data || res;
        setNotes((prev) => prev.map((n) => (n.id === editingNote.id ? updated : n)));
      } else {
        const res = await projectService.createNote(projectId, formData);
        const created = res?.data || res;
        setNotes((prev) => [created, ...prev]);
      }
      setIsModalOpen(false);
      setEditingNote(null);
    } catch (err) {
      console.error('Failed to save note:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (noteId) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    try {
      await projectService.deleteNote(noteId);
    } catch (err) {
      console.error('Failed to delete note:', err);
      fetchNotes();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Collaborative Project Notes ({notes.length})
        </h4>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setEditingNote(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          <span>New Note</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="md" />
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            No notes yet. Create meeting agendas, technical specs, or submission bullet points.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={(n) => {
                setEditingNote(n);
                setIsModalOpen(true);
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingNote(null);
        }}
        title={editingNote ? 'Edit Note' : 'Create New Note'}
        size="md"
      >
        <NoteEditor
          initialData={editingNote}
          onSave={handleSave}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingNote(null);
          }}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
}
