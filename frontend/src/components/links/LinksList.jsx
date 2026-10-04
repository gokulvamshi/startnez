import React, { useState, useEffect } from 'react';
import { Plus, Globe } from 'lucide-react';
import { projectService } from '../../services/projectService';
import LinkCard from './LinkCard';
import AddLinkForm from './AddLinkForm';
import Button from '../shared/Button';
import Modal from '../shared/Modal';
import LoadingSpinner from '../shared/LoadingSpinner';

export default function LinksList({ projectId }) {
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchLinks = async () => {
    try {
      setIsLoading(true);
      const res = await projectService.getLinks(projectId);
      const list = res?.data || res || [];
      setLinks(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to load links:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, [projectId]);

  const handleAdd = async (formData) => {
    try {
      setIsSubmitting(true);
      const res = await projectService.addLink(projectId, formData);
      const created = res?.data || res;
      setLinks((prev) => [created, ...prev]);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save link:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (linkId) => {
    setLinks((prev) => prev.filter((l) => l.id !== linkId));
    try {
      await projectService.deleteLink(linkId);
    } catch (err) {
      console.error('Failed to delete link:', err);
      fetchLinks();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Shared Resource Links ({links.length})
        </h4>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          <span>Add Link</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="md" />
        </div>
      ) : links.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <Globe className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            No shared links yet. Add Figma files, API docs, GitHub repos, or slide decks for your team.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {links.map((link) => (
            <LinkCard key={link.id} link={link} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Shared Resource Link"
        size="md"
      >
        <AddLinkForm
          onSubmit={handleAdd}
          onCancel={() => setIsModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
}
