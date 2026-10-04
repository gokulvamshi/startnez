import React, { useState, useEffect } from 'react';
import { kanbanService } from '../../services/kanbanService';
import { supabase } from '../../lib/supabase';
import { KANBAN_STATUSES } from '../../config/skills';
import KanbanColumn from './KanbanColumn';
import KanbanCardForm from './KanbanCardForm';
import Modal from '../shared/Modal';
import LoadingSpinner from '../shared/LoadingSpinner';

export default function KanbanBoard({ projectId, members = [] }) {
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalState, setModalState] = useState({
    isOpen: false,
    card: null,
    status: 'todo'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCards = async () => {
    try {
      setIsLoading(true);
      const res = await kanbanService.getCards(projectId);
      const list = res?.data || res || [];
      setCards(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to load kanban cards:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();

    // Supabase Realtime subscription for cards on this project
    let channel;
    try {
      channel = supabase
        .channel(`kanban:${projectId}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'kanban_cards', filter: `project_id=eq.${projectId}` },
          () => {
            fetchCards();
          }
        )
        .subscribe();
    } catch (e) {
      // Offline fallback
    }

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [projectId]);

  const handleMoveCard = async (cardId, newStatus) => {
    // Optimistic UI update
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, status: newStatus } : c))
    );

    try {
      await kanbanService.moveCard(cardId, newStatus);
    } catch (err) {
      console.error('Failed to move card:', err);
      fetchCards(); // Revert
    }
  };

  const handleDeleteCard = async (cardId) => {
    setCards((prev) => prev.filter((c) => c.id !== cardId));
    try {
      await kanbanService.deleteCard(cardId);
    } catch (err) {
      console.error('Failed to delete card:', err);
      fetchCards();
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      if (modalState.card) {
        // Edit card
        const res = await kanbanService.updateCard(modalState.card.id, formData);
        const updated = res?.data || res;
        setCards((prev) =>
          prev.map((c) => (c.id === modalState.card.id ? updated : c))
        );
      } else {
        // Create card
        const res = await kanbanService.createCard(projectId, formData);
        const created = res?.data || res;
        setCards((prev) => [...prev, created]);
      }
      setModalState({ isOpen: false, card: null, status: 'todo' });
    } catch (err) {
      console.error('Failed to save card:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 4-column responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {KANBAN_STATUSES.map((col) => {
          const colCards = cards.filter((c) => c.status === col.value);

          return (
            <KanbanColumn
              key={col.value}
              status={col.value}
              label={col.label}
              cards={colCards}
              onMoveCard={handleMoveCard}
              onDeleteCard={handleDeleteCard}
              onEditCard={(card) =>
                setModalState({ isOpen: true, card, status: card.status })
              }
              onAddCard={(status) =>
                setModalState({ isOpen: true, card: null, status })
              }
            />
          );
        })}
      </div>

      {/* Create / Edit Card Modal */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, card: null, status: 'todo' })}
        title={modalState.card ? 'Edit Task Card' : 'Create Task Card'}
        size="md"
      >
        <KanbanCardForm
          initialData={modalState.card}
          initialStatus={modalState.status}
          members={members}
          onSubmit={handleFormSubmit}
          onCancel={() => setModalState({ isOpen: false, card: null, status: 'todo' })}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
}
