import { api } from './api';

export const chatService = {
  getMessages(projectId) {
    return api.get(`/projects/${projectId}/messages`);
  },

  sendMessage(projectId, data) {
    return api.post(`/projects/${projectId}/messages`, data);
  }
};
