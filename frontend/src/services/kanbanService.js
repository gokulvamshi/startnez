import { api } from './api';

export const kanbanService = {
  getCards(projectId) {
    return api.get(`/projects/${projectId}/kanban`);
  },

  createCard(projectId, data) {
    return api.post(`/projects/${projectId}/kanban`, data);
  },

  updateCard(cardId, data) {
    return api.put(`/kanban/${cardId}`, data);
  },

  deleteCard(cardId) {
    return api.delete(`/kanban/${cardId}`);
  },

  moveCard(cardId, status, displayOrder = 0) {
    return api.put(`/kanban/${cardId}/move`, { status, display_order: displayOrder });
  }
};
